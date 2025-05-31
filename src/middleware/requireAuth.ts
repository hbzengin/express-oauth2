import { Request, Response, NextFunction } from "express";
import { userRepo } from "../db/repositories/users";
import { authenticate } from "../auth/handlers";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.signedCookies.id;
  if (!userId) {
    authenticate(req, res);
    return;
  }

  const user = await userRepo.getById(userId);
  if (!user) {
    res.clearCookie("id");
    authenticate(req, res);
    return;
  }

  req.user = user;
  next();
}
