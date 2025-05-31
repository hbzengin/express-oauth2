import "dotenv/config";
import express from "express";
import authRouter from "./auth";
import cookieParser from "cookie-parser";
import { requireAuth } from "./middleware/requireAuth";
import { toPublicUser } from "./db/schema/users";

const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const app = express();

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);

// All /api routes need auth
const apiRouter = express.Router();
apiRouter.use(requireAuth);

apiRouter.get("/user", (req, res) => {
  res.status(200).json({ hello: toPublicUser(req.user!) });
});

// // Mount your sub-routers under /api
// apiRouter.use("/profile", profileRouter);
// apiRouter.use("/games",   gamesRouter);
// // …you can add more: /api/messages, /api/settings, etc.

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Backend started on port ${PORT}`);
});
