import express from "express";
import { signIn, signUp, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { checkDuplicateUser } from "../middleware/verifySignup";

const router = express.Router()

router.post("/signup", checkDuplicateUser, signUp)
router.post("/signin", signIn)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router