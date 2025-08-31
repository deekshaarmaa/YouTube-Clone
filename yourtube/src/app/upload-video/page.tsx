"use client";
import { useState } from "react";

export default function UploadVideoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setMessage("⚠️ Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);

    try {
      const response = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text(); // always read as text first
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text); // try parsing JSON
        if (response.ok) {
          setMessage("✅ Video uploaded successfully!");
        } else {
          setMessage(`❌ Upload failed: ${data.message || "Unknown error"}`);
        }
      } catch {
        // if server returned HTML instead of JSON
        setMessage("❌ Server did not return JSON. Check backend route.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Error uploading video. Check console for details.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
