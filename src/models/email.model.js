import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verificationOTP: {
      type: String,
      required: true,
    },
    verificationOTPExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const OTP = mongoose.model("Otp", otpSchema);
