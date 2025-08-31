// controllers/commentController.js
import axios from "axios";
import Comment from "../models/Comment.js";

// allow letters & numbers in ANY language + spaces + .,!?'"-
const ALLOWED_TEXT = /^[\p{L}\p{N}\s.,!?'"-]+$/u;

// Pull best-guess client IP
const getClientIp = (req) => {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress?.replace("::ffff:", "") || req.ip;
};

// Resolve city via free IP API
const getCityForIp = async (ip) => {
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 3000 });
    return data?.city || "Unknown";
  } catch {
    return "Unknown";
  }
};

// Detect language
const detectLanguage = async (text) => {
  try {
    const { data } = await axios.post("https://libretranslate.com/detect", { q: text });
    return Array.isArray(data) && data[0]?.language ? data[0].language : "auto";
  } catch {
    return "auto";
  }
};

// --- Controllers ---
export const createComment = async (req, res) => {
  try {
    const { videoId, text, author } = req.body;

    if (!videoId || !text || !author?.name || !author?.email) {
      return res.status(400).json({ message: "videoId, text, author{name,email} are required." });
    }

    if (!ALLOWED_TEXT.test(text)) {
      return res
        .status(400)
        .json({ message: "Only letters/numbers/spaces and . , ! ? \" ' - are allowed." });
    }

    const ip = getClientIp(req);
    const [language, city] = await Promise.all([detectLanguage(text), getCityForIp(ip)]);

    const comment = await Comment.create({
      videoId,
      text,
      language,
      city,
      author,
    });

    return res.status(201).json(comment);
  } catch (err) {
    console.error("createComment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ videoId, isRemoved: false }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("getComments error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userKey } = req.body;

    if (!userKey) return res.status(400).json({ message: "userKey is required." });

    const c = await Comment.findById(id);
    if (!c || c.isRemoved) return res.status(404).json({ message: "Comment not found." });

    const liked = c.likedBy.includes(userKey);
    if (liked) {
      c.likedBy = c.likedBy.filter((u) => u !== userKey);
    } else {
      c.likedBy.push(userKey);
      c.dislikedBy = c.dislikedBy.filter((u) => u !== userKey);
    }

    await c.save();
    res.json(c);
  } catch (err) {
    console.error("toggleLike error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleDislike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userKey } = req.body;

    if (!userKey) return res.status(400).json({ message: "userKey is required." });

    const c = await Comment.findById(id);
    if (!c || c.isRemoved) return res.status(404).json({ message: "Comment not found." });

    const disliked = c.dislikedBy.includes(userKey);
    if (disliked) {
      c.dislikedBy = c.dislikedBy.filter((u) => u !== userKey);
    } else {
      c.dislikedBy.push(userKey);
      c.likedBy = c.likedBy.filter((u) => u !== userKey);
    }

    if (c.dislikedBy.length >= 2) {
      c.isRemoved = true;
    }

    await c.save();
    res.json(c);
  } catch (err) {
    console.error("toggleDislike error", err);
    res.status(500).json({ message: "Server error" });
  }
};
