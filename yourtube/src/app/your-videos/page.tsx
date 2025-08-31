"use client";
import { useEffect, useState } from "react";

export default function YourVideos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("http://localhost:5000/api/videos/user/USER_ID");
      const data = await res.json();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Uploaded Videos</h1>
      <div className="grid grid-cols-3 gap-4">
        {videos.map((video: any) => (
          <div key={video._id} className="p-2 border rounded-lg">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              allowFullScreen
            ></iframe>
            <h2 className="mt-2 font-semibold">{video.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
