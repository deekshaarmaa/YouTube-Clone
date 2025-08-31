'use client';

import { useParams } from 'next/navigation';
import VideoCard from '@/components/ui/VideoCard';

// Video data
const channelVideos: { [key: string]: any[] } = {
  codewithdeeksha: [
    {
      youtubeId: 'abc123',
      title: 'React vs Angular',
      views: '12K',
      channel: 'CodeWithDeeksha',
    },
    {
      youtubeId: 'def456',
      title: 'Tailwind CSS Tutorial',
      views: '9.1K',
      channel: 'CodeWithDeeksha',
    },
  ],
  nullclass: [
    {
      youtubeId: 'ghi789',
      title: 'Build a YouTube Clone',
      views: '22K',
      channel: 'NullClass Tutorials',
    },
  ],
  relaxationhub: [
    {
      youtubeId: 'jkl987',
      title: 'Relaxing Piano Music',
      views: '31K',
      channel: 'Relaxation Hub',
    },
  ],
};

// Channel descriptions and dialogues
const channelInfo: { [key: string]: { name: string; description: string; dialogue: string } } = {
  codewithdeeksha: {
    name: "CodeWithDeeksha",
    description: "Welcome to Deeksha’s Den – a creative coding cave for curious minds!",
    dialogue: "💬 'Code, coffee, and chaos – that’s the vibe!'",
  },
  nullclass: {
    name: "NullClass Tutorials",
    description: "NullClass – Practical learning for future developers.",
    dialogue: "💬 'Stop watching, start building!'",
  },
  relaxationhub: {
    name: "Relaxation Hub",
    description: "Your sanctuary for stress relief and peace of mind.",
    dialogue: "💬 'Breathe in peace, exhale stress.'",
  },
};

export default function ChannelVideosPage() {
  const { channelId } = useParams();
  const videos = channelVideos[channelId as string] || [];
  const info = channelInfo[channelId as string];

  return (
    <div className="p-6">
      {info && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{info.name}</h1>
          <p className="text-gray-600 text-lg">{info.description}</p>
          <p className="mt-2 italic text-orange-600">{info.dialogue}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">🎥 Uploaded Videos</h2>

      {videos.length === 0 ? (
        <p>No videos found for this channel.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((video, idx) => (
            <VideoCard key={idx} {...video} />
          ))}
        </div>
      )}
    </div>
  );
}
