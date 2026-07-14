import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { OTP } from "../models/email.model.js";

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  // Generate a new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  let otpData = await OTP.findOne({ email });

  if (!otpData) {
    otpData = await OTP.create({
      email,
      verificationOTP: hashedOTP,
      verificationOTPExpiry: Date.now() + 10 * 60 * 1000,
    });
  } else {
    otpData.verificationOTP = hashedOTP;
    otpData.verificationOTPExpiry = Date.now() + 10 * 60 * 1000;
    await otpData.save();
  }

  // Send email
  try {
    await sendEmail({
      to: user.email,
      subject: "Your Lume verification code",
      html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your Lume account ✨</h2>

        <p>Your new verification code is:</p>

        <h1 style="letter-spacing: 5px;">${otp}</h1>

        <p>This OTP is valid for 10 minutes.</p>

        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    });
  } catch (error) {
    console.error("OTP email error:", error);
    throw new ApiError(500, "Failed to send OTP");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "A new OTP has been sent to your email."));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  console.log("entered OTP: ", otp);

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const otpData = await OTP.findOne({ email });
  console.log(otpData);
  if (!otpData) {
    throw new ApiError(400, "OTP not found");
  }

  if (!otpData.verificationOTP || !otpData.verificationOTPExpiry) {
    throw new ApiError(400, "OTP not found");
  }

  if (otpData.verificationOTPExpiry < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }

  const isOTPValid = await bcrypt.compare(otp, otpData.verificationOTP);

  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isVerified = true;

  await user.save();
  await OTP.deleteOne({ email });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

export { sendOTP, verifyEmail };
