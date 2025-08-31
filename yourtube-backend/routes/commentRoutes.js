
import express from "express";
import {
  createComment,
  getCommentsByVideo,
  toggleLike,
  toggleDislike,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:videoId", getCommentsByVideo);
router.post("/", createComment);
router.post("/:id/like", toggleLike);
router.post("/:id/dislike", toggleDislike);

export default router;
