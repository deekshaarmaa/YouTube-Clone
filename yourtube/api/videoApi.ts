import axios from "axios";

const API_URL = "http://localhost:5000/api/videos";

export const uploadVideoMeta = async (videoData: {
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  userId: string;
}) => {
  return axios.post(API_URL, videoData);
};

export const fetchVideos = async () => {
  return axios.get(API_URL);
};
