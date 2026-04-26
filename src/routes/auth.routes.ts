import express from "express";
import { signIn, signUp } from "../controllers/auth.controller";
// import { signIn, signUp } from "../controller/auth.controller";
import { checkDuplicateUser } from "../middleware/verifySignup";
// import { veryfyToken } from "../middlewares/auth.JWT";


const router = express.Router()

router.post("/signup", checkDuplicateUser, signUp)
router.post("/signin", signIn)

export default router