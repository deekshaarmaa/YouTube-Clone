'use client';

import { useEffect, useState } from 'react';
import VideoCard from '../components/ui/VideoCard';

type Video = {
  _id?: string;
  youtubeId: string;
  title: string;
  channel: string;
  views: string;
};

const sampleVideos: Video[] = [
  {
    youtubeId: 'dFgzHOX84xQ',
    title: 'Mastering Tailwind CSS in 10 Minutes!',
    channel: 'CodeWithDeeksha',
    views: '1.2M',
  },
  {
    youtubeId: '2nFg1wSTnSQ',
    title: 'Building a YouTube Clone with Next.js',
    channel: 'NullClass Tutorials',
    views: '580K',
  },
  {
    youtubeId: '5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    channel: 'Chillhop Music',
    views: '3.4M',
  },
  {
    youtubeId: 'LXb3EKWsInQ',
    title: 'The Most Relaxing Drone Video of Norway',
    channel: 'Scenic Relaxation',
    views: '2.5M',
  },
  {
    youtubeId: 'tBfcRZj850ZPcSnp',
    title: 'hello, mai hu chatgpt',
    channel: 'Scenic Relaxation',
    views: '25M',
  },
  {
    youtubeId: 'IRM-FscOn-a3RNWu',
    title: 'hello uncle!',
    channel: 'yuhuu',
    views: '12k',
  },
];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/videos');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // ✅ Check if response is JSON
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.warn('⚠️ Expected JSON but got:', contentType);
          setVideos(sampleVideos); // fallback to sample videos
          return;
        }

        const data: Video[] = await res.json();

        // ✅ Merge DB videos + sample videos
        if (data.length > 0) {
          setVideos([...data, ...sampleVideos]);
        }
      } catch (error) {
        console.error('❌ Error fetching videos:', error);
        setVideos(sampleVideos); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="flex">
      <div className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 flex-1">
        {loading ? (
          <p className="text-gray-500">Loading videos...</p>
        ) : videos.length > 0 ? (
          videos.map((video, index) => (
            <VideoCard key={video._id || index} {...video} />
          ))
        ) : (
          <p className="text-gray-500">No videos available</p>
        )}
      </div>
    </main>
  );
}
