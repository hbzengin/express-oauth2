import express from "express";
import * as handlers from "./handlers";

const router = express.Router();

router.get("/google", handlers.authenticate);
router.get("/google/callback", handlers.authenticateCallback);

export default router;
