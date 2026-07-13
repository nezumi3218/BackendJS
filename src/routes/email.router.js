import { Router } from "express";
import { sendOTP, verifyEmail } from "../controllers/email.controller.js";

const router = Router();
router.route("/send-otp").post(sendOTP);

router.route("/verify-mail").post(verifyEmail);

export default router;
