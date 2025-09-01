"use client";

import { useRef, useState } from "react";

type VideoCardProps = {
  youtubeId?: string;
  videoUrl?: string;
  title: string;
  channel: string;
  views: number;
};

export default function VideoCard({
  youtubeId,
  videoUrl,
  title,
  channel,
  views,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lastTap, setLastTap] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300) {
      // Double / Triple taps
      setTapCount((prev) => prev + 1);
    } else {
      setTapCount(1);
    }
    setLastTap(currentTime);

    const video = videoRef.current;
    if (!video) return;

    // Check tap position (left, center, right)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const isLeft = x < rect.width / 3;
    const isRight = x > (2 * rect.width) / 3;
    const isCenter = !isLeft && !isRight;

    if (tapCount === 2) {
      if (isRight) video.currentTime += 10;
      else if (isLeft) video.currentTime -= 10;
    }

    if (tapCount === 1 && isCenter) {
      video.paused ? video.play() : video.pause();
    }

    if (tapCount === 3) {
      if (isCenter) {
        // Next video → just reload for now
        window.location.reload();
      } else if (isRight) {
        window.close(); // Close tab
      } else if (isLeft) {
        alert("Show Comments Section"); // Replace with actual comments toggle
      }
    }
  };

  return (
    <div
      className="p-3 rounded-xl shadow-md bg-white dark:bg-gray-900"
      onClick={handleTap}
    >
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          className="w-full aspect-video rounded-xl"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full aspect-video rounded-xl"
        />
      )}
      <div className="mt-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{channel}</p>
        <p className="text-sm text-gray-500">{views} views</p>
      </div>
    </div>
  );
}
