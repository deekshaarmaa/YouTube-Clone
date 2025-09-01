// yourtube-backend/models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userUid: { type: String, required: true, unique: true },
  plan: { 
    type: String, 
    enum: ["FREE", "BRONZE", "SILVER", "GOLD"], 
    default: "FREE" 
  },
  active: { type: Boolean, default: false },
  expiry: { type: Date }, // Bronze & Silver have time limit, Gold is unlimited
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Subscription", subscriptionSchema);
