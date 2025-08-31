// yourtube-backend/models/Download.js
import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  userUid: { type: String, required: true, index: true }, // Firebase UID
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Download", downloadSchema);
