"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  _id: string;
  text: string;
  user: { email: string };
  city: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

const Comments: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");

  // ✅ Fetch all comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${videoId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // ✅ Handle adding comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // Block special characters
    const specialCharRegex = /[^a-zA-Z0-9\s.,!?]/;
    if (specialCharRegex.test(newComment)) {
      alert("⚠️ Special characters are not allowed in comments.");
      return;
    }

    try {
      await axios.post("/api/comments", { text: newComment, videoId });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // ✅ Like / Dislike
  const handleLike = async (id: string) => {
    await axios.put(`/api/comments/${id}/like`);
    fetchComments();
  };

  const handleDislike = async (id: string) => {
    await axios.put(`/api/comments/${id}/dislike`);
    fetchComments();
  };

  // ✅ Translate comment
  const handleTranslate = async (id: string, text: string) => {
    try {
      const res = await axios.post(`/api/comments/${id}/translate`, {
        text,
        targetLang: selectedLang,
      });
      alert(`Translated: ${res.data.translatedText}`);
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      {/* Add new comment */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Post
        </button>
      </div>

      {/* Translate language dropdown */}
      <div className="mb-4">
        <label className="mr-2">Translate to:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Show comments */}
      {comments.map((c) => (
        <div key={c._id} className="border-b py-2">
          <p>
            <strong>{c.user?.email}</strong> from{" "}
            <span className="text-sm text-gray-500">{c.city}</span>
          </p>
          <p>{c.text}</p>
          <div className="flex gap-4 text-sm mt-2">
            <button
              onClick={() => handleLike(c._id)}
              className="text-green-600"
            >
              👍 {c.likes}
            </button>
            <button
              onClick={() => handleDislike(c._id)}
              className="text-red-600"
            >
              👎 {c.dislikes}
            </button>
            <button
              onClick={() => handleTranslate(c._id, c.text)}
              className="text-blue-600"
            >
              🌐 Translate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
