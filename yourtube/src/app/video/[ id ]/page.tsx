"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Comment {
  _id: string;
  text: string;
  city: string;
  likes: number;
  dislikes: number;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeId: string; // for iframe
  uploadedBy: string;
  likes: number;
  dislikes: number;
}

export default function VideoPage() {
  const { id } = useParams(); // video id from URL
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch video + comments
  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:5000/api/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(err => console.error("Error fetching video:", err));

    axios.get(`http://localhost:5000/api/videos/${id}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Error fetching comments:", err));
  }, [id]);

  // ✅ Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, { text: newComment });
      setComments(prev => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ✅ Like/Dislike comment
  const handleCommentAction = async (commentId: string, action: "like" | "dislike") => {
    try {
      const res = await axios.post(`http://localhost:5000/api/comments/${commentId}/${action}`);
      setComments(prev =>
        prev.map(c => (c._id === commentId ? res.data : c))
      );
    } catch (err) {
      console.error(`Error on ${action}:`, err);
    }
  };

  // ✅ Translate comment
  const handleTranslate = async (commentId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${commentId}/translate?lang=hi`); // example: Hindi
      setComments(prev =>
        prev.map(c => (c._id === commentId ? { ...c, text: res.data.translatedText } : c))
      );
    } catch (err) {
      console.error("Error translating:", err);
    }
  };

  if (!video) return <p className="p-4">Loading video...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="aspect-video mb-4">
        <iframe
          className="w-full h-full rounded-2xl shadow"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allowFullScreen
        />
      </div>

      {/* Video Info */}
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <p className="text-gray-600 mb-4">{video.description}</p>
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-gray-200 rounded-xl">👍 {video.likes}</button>
        <button className="px-4 py-2 bg-gray-200 rounded-xl">👎 {video.dislikes}</button>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Comments</h2>

        {/* Add Comment */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border px-3 py-2 rounded-xl"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Post
          </button>
        </div>

        {/* Comment List */}
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment._id} className="p-3 border rounded-xl bg-gray-50">
              <p className="mb-1">{comment.text}</p>
              <span className="text-sm text-gray-500">📍 {comment.city}</span>
              <div className="flex gap-3 mt-2">
                <button onClick={() => handleCommentAction(comment._id, "like")}>👍 {comment.likes}</button>
                <button onClick={() => handleCommentAction(comment._id, "dislike")}>👎 {comment.dislikes}</button>
                <button onClick={() => handleTranslate(comment._id)} className="text-blue-600">🌐 Translate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
