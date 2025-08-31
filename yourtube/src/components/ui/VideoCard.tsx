// yourtube/src/components/VideoCard.tsx
'use client';

import { useState } from "react";
import { BACKEND_URL } from "../../lib/config";
import { useAuth } from "../../../context/AuthContext";

interface VideoCardProps {
  _id?: string;
  youtubeId?: string;         // old samples
  videoUrl?: string;          // backend videos
  fileUrl?: string;           // backend videos (older field)
  thumbnailUrl?: string;
  title: string;
  channel?: string;           // old samples
  views?: string;             // old samples
  uploadedBy?: { name?: string; email?: string };
}

const VideoCard = ({
  _id,
  youtubeId,
  videoUrl,
  fileUrl,
  thumbnailUrl,
  title,
  channel,
  views,
  uploadedBy
}: VideoCardProps) => {
  const playable = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : (videoUrl || fileUrl || "");
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      alert("Please login to download.");
      return;
    }
    if (!_id) {
      alert("Invalid video for download.");
      return;
    }
    try {
      setDownloading(true);
      const res = await fetch(`${BACKEND_URL}/api/downloads/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userUid: user.uid, videoId: _id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.message || "Download not allowed.");
        return;
      }
      // trigger browser download
      const a = document.createElement("a");
      a.href = data.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.download = ""; // hint
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
      alert("Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full sm:w-64 rounded-lg shadow-md overflow-hidden bg-white dark:bg-zinc-900">
      <div className="w-full h-40">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={playable}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-md font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500">{uploadedBy?.name || channel || "Unknown Channel"}</p>
        <p className="text-sm text-gray-400">{views ? `${views} views` : "—"}</p>

        {/* ✅ Download button appears only for real uploaded videos (videoUrl/fileUrl) */}
        { (videoUrl || fileUrl) && user && _id && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="mt-2 w-full text-sm bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {downloading ? "Preparing..." : "⬇️ Download"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
