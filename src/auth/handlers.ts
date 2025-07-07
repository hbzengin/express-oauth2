import { Request, Response } from "express";
import { backendOauth2Client, getAuthUrl } from "./oauth2Client";
import { NewUser, toPublicUser, User } from "../db/schema/users";
import { userRepo } from "../db/repositories/users";

export function authenticate(req: Request, res: Response) {
  res.redirect(getAuthUrl());
}

// TODO: After user completes this, if they originally wanted to access
// some other place, maybe instead redirect them instead of returning user info.

export async function authenticateCallback(req: Request, res: Response) {
  const { code } = req.query;
  if (!code) {
    res.status(400).send("Missing code");
    return;
  }
  if (typeof code !== "string") {
    res.status(400).send("Invalid code");
    return;
  }

  try {
    const { tokens } = await backendOauth2Client.getToken(code);
    const ticket = await backendOauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // Won't happen but just in case
    if (!payload) {
      res.sendStatus(400);
      return;
    }

    const existing = await userRepo.getBySub(payload.sub);
    const refreshToken = tokens.refresh_token ?? existing?.refresh_token;

    if (!refreshToken) {
      res.sendStatus(500);
      return;
    }

    const newUser: NewUser = {
      sub: payload.sub,
      name: payload.name!,
      email: payload.email!,
      picture: payload.picture ?? null,
      access_token: tokens.access_token!,
      refresh_token: refreshToken,
      expiry_date: tokens.expiry_date!,
    };

    let user: User;
    let status: number;

    if (existing) {
      user = (await userRepo.update(existing.id, newUser))!;
      status = 200;
    } else {
      user = await userRepo.create(newUser);
      status = 201;
    }

    // User id for later identification
    res.cookie("id", user.id, {
      httpOnly: true,
      signed: true,
      secure: false, // Fix for https later
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    const publicUser = toPublicUser(user);
    res.status(status).json(publicUser);
    return;
  } catch (error) {
    res.status(400).send(error);
    return;
  }
}
