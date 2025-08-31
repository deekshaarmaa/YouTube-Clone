// yourtube-backend/models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userUid: { type: String, required: true, unique: true },
  plan: { type: String, enum: ["FREE", "PREMIUM"], default: "FREE" },
  active: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Subscription", subscriptionSchema);
