// yourtube-backend/models/OtpToken.js
import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema({
  userUid: { type: String, required: true, index: true },
  email: { type: String, required: true },
  code: { type: String, required: true },      // 6-digit code
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true });

otpTokenSchema.index({ userUid: 1, used: 1 });

export default mongoose.model("OtpToken", otpTokenSchema);
