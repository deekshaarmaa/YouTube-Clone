// routes/videoRoutes.js
import express from "express";
import Video from "../models/Video.js";

const router = express.Router();

// ✅ Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate("uploadedBy", "name email");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get videos uploaded by a user
router.get("/user/:id", async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.params.id }).populate(
      "uploadedBy",
      "name email"
    );
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Like video
router.post("/:id/like", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    video.likes += 1;
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Dislike video
router.post("/:id/dislike", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    video.dislikes += 1;
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add comment
router.post("/:id/comment", async (req, res) => {
  try {
    const { text, userId, city } = req.body;

    // Block special characters
    if (/[^a-zA-Z0-9\s.,!?'"@]/.test(text)) {
      return res.status(400).json({ error: "Special characters not allowed" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.comments.push({ text, userId, city, likes: 0, dislikes: 0 });
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Like/dislike comment
router.post("/:videoId/comment/:commentId/react", async (req, res) => {
  try {
    const { action } = req.body; // "like" or "dislike"
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (action === "like") comment.likes += 1;
    if (action === "dislike") comment.dislikes += 1;

    // Auto delete if 2 dislikes
    if (comment.dislikes >= 2) {
      comment.deleteOne();
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
