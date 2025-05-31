import { google } from "googleapis";
import { NewUser, User } from "../db/schema/users";
import { userRepo } from "../db/repositories/users";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
  process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URL) {
  throw new Error("Missing some Google OAuth2 environment variables");
}

export function makeOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
  );
}

export function makeUserClient(user: User) {
  const client = makeOAuth2Client();
  client.setCredentials({
    access_token: user.access_token,
    refresh_token: user.refresh_token,
    expiry_date: user.expiry_date,
  });

  client.on("tokens", async (tokens) => {
    const updates: Partial<NewUser> = {};

    if (tokens.refresh_token) updates.refresh_token = tokens.refresh_token;
    // I think this is always returned
    if (tokens.access_token) updates.access_token = tokens.access_token;
    // This too is always returned I think
    if (tokens.expiry_date) updates.expiry_date = tokens.expiry_date;

    if (Object.keys(updates).length > 0)
      await userRepo.update(user.id, updates);
  });

  return client;
}

export const backendOauth2Client = makeOAuth2Client();
const scopes = [
  "https://www.googleapis.com/auth/gmail.modify",
  "openid",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getAuthUrl() {
  return backendOauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    scope: scopes,
  });
}
