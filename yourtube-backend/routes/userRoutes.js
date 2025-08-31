import express from "express";
import User from "../models/User.js";  // adjust path if needed

const router = express.Router();

// Subscribe
router.post("/:id/subscribe", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { channelId } = req.body;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.subscriptions.includes(channelId)) {
      user.subscriptions.push(channelId);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unsubscribe
router.post("/:id/unsubscribe", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { channelId } = req.body;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.subscriptions = user.subscriptions.filter(
      (c) => c.toString() !== channelId
    );

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export router correctly
export default router;
