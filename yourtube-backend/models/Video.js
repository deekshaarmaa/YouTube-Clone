import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  city: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
}, { timestamps: true });

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  youtubeId: String, // or file path if uploaded locally
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [commentSchema],
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);
