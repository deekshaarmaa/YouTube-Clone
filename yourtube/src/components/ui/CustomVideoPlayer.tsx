'use client';

import { useRef, useState, useEffect } from 'react';
import Comments from './Comments';

interface CustomVideoPlayerProps {
  videos?: string[]; // optional list of video URLs
}

export default function CustomVideoPlayer({ videos }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null);

  const videoList = videos && videos.length ? videos : ['/videos/sample.mp4'];

  /** Play / Pause single tap in middle */
  const handleSingleTap = (x: number, width: number) => {
    const video = videoRef.current;
    if (!video) return;
    const middleStart = width * 0.3;
    const middleEnd = width * 0.7;

    if (x >= middleStart && x <= middleEnd) {
      if (video.paused) video.play();
      else video.pause();
    }
  };

  /** Double-tap left/right to skip 10s */
  const handleDoubleTap = (x: number, width: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (x < width / 2) video.currentTime -= 10;
    else video.currentTime += 10;
  };

  /** Triple-tap gestures */
  const handleTripleTap = (x: number, width: number) => {
    // Left: show comments
    if (x < width / 3) setShowComments(true);

    // Center: next video
    else if (x >= width / 3 && x <= (2 * width) / 3) {
      setCurrentIndex((prev) => (prev + 1) % videoList.length);
      setShowComments(false);
    }

    // Right: close website
    else if (x > (2 * width) / 3) {
      window.close(); // may not work in all browsers
      console.log('Close website triggered');
    }
  };

  /** Handle tap logic */
  const handleTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    setTapCount((prev) => prev + 1);

    if (tapTimer) clearTimeout(tapTimer);

    setTapTimer(
      setTimeout(() => {
        if (tapCount === 1) handleSingleTap(x, width);
        else if (tapCount === 2) handleDoubleTap(x, width);
        else if (tapCount >= 3) handleTripleTap(x, width);

        setTapCount(0);
      }, 250) // 250ms for multi-tap detection
    );
  };

  /** Reset comments when video changes */
  useEffect(() => {
    setShowComments(false);
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      className="w-full max-w-3xl mx-auto flex flex-col"
    >
      <video
        ref={videoRef}
        key={currentIndex}
        src={videoList[currentIndex]}
        className="w-full rounded-lg shadow-lg"
        controls
        autoPlay
      />

      {/* Gesture hints */}
      <div className="mt-2 text-sm text-gray-500">
        <p>Double-tap left/right: ⬅️ / ➡️ 10s skip</p>
        <p>Single-tap center: ⏯ Play/Pause</p>
        <p>Triple-tap center: ⏭ Next video</p>
        <p>Triple-tap left: 💬 Show comments / translate</p>
        <p>Triple-tap right: ❌ Close website</p>
      </div>

      {/* Comments Section */}
      {showComments && <Comments videoId={`video-${currentIndex}`} />}
    </div>
  );
}
