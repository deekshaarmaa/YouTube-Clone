// yourtube-backend/routes/downloadRoutes.js
import express from "express";
import Download from "../models/Download.js";
import Subscription from "../models/Subscription.js";
import Video from "../models/Video.js";

const router = express.Router();

// helper: start of today
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * POST /api/downloads/request
 * body: { userUid: string, videoId: string }
 * - FREE: 1 download per day
 * - PREMIUM: unlimited
 * returns: { ok: true, url: string } OR 403 with message
 */
router.post("/request", async (req, res) => {
  try {
    const { userUid, videoId } = req.body;
    if (!userUid || !videoId) {
      return res.status(400).json({ ok: false, message: "userUid and videoId are required" });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ ok: false, message: "Video not found" });

    const playableUrl = video.videoUrl || video.fileUrl;
    if (!playableUrl) {
      return res.status(400).json({ ok: false, message: "This video is not downloadable." });
    }

    // check subscription
    const sub = await Subscription.findOne({ userUid });
    const isPremium = !!(sub && sub.active && sub.plan === "PREMIUM");

    if (!isPremium) {
      const countToday = await Download.countDocuments({
        userUid,
        createdAt: { $gte: startOfToday() },
      });
      if (countToday >= 1) {
        return res.status(403).json({
          ok: false,
          message: "Daily download limit reached. Go Premium for unlimited downloads.",
        });
      }
    }

    // log download
    await Download.create({ userUid, video: video._id });

    return res.json({ ok: true, url: playableUrl });
  } catch (err) {
    console.error("download request error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * GET /api/downloads/me?userUid=xxx
 * returns list of your downloads (latest first)
 */
router.get("/me", async (req, res) => {
  try {
    const { userUid } = req.query;
    if (!userUid) return res.status(400).json({ ok: false, message: "userUid is required" });

    const downloads = await Download.find({ userUid })
      .sort({ createdAt: -1 })
      .populate("video");

    res.json({ ok: true, downloads });
  } catch (err) {
    console.error("downloads me error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * GET /api/downloads/count-today?userUid=xxx
 */
router.get("/count-today", async (req, res) => {
  try {
    const { userUid } = req.query;
    if (!userUid) return res.status(400).json({ ok: false, message: "userUid is required" });

    const countToday = await Download.countDocuments({
      userUid,
      createdAt: { $gte: startOfToday() },
    });

    res.json({ ok: true, countToday, freeLimit: 1 });
  } catch (err) {
    console.error("downloads count error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * GET /api/downloads/subscription?userUid=xxx
 * returns subscription status
 */
router.get("/subscription", async (req, res) => {
  try {
    const { userUid } = req.query;
    if (!userUid) return res.status(400).json({ ok: false, message: "userUid is required" });

    const sub = await Subscription.findOne({ userUid });
    if (!sub) return res.json({ ok: true, plan: "FREE", active: false });

    res.json({ ok: true, plan: sub.plan, active: sub.active });
  } catch (err) {
    console.error("subscription status error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
