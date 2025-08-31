// controllers/videoController.js
import Video from "../models/Video.js";

// Upload new video
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, fileUrl, thumbnailUrl, category, uploadedBy } = req.body;

    if (!title || !fileUrl || !uploadedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newVideo = new Video({
      title,
      description,
      fileUrl,
      thumbnailUrl,
      category,
      uploadedBy,
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error });
  }
};

// Fetch all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("uploadedBy", "name email");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
};
