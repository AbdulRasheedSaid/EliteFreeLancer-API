import { signIn, signup, session, sessionTry } from "controllers/authController.js";
import express from "express";


const router = express.Router();
router.post("/sign-up/email", signup)
router.post("/sign-in/email", signIn)
// router.get("/session/me", session)
router.post("/session/me", sessionTry)

export default router;