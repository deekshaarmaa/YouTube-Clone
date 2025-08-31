'use client';
import VideoCard from '@/components/ui/VideoCard';

const watchLaterVideos = [
  {
    youtubeId: 'qwerty12345',
    title: 'How to Master TypeScript',
    views: '27K',
    channel: 'CodeWithMe',
  },
  {
    youtubeId: 'asdfgh67890',
    title: 'Node.js for Beginners',
    views: '45K',
    channel: 'Backend Simplified',
  },
];

export default function WatchLaterPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⏰ Watch Later</h1>
      {watchLaterVideos.length === 0 ? (
        <p className="text-gray-500">No videos added to watch later.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {watchLaterVideos.map((video, idx) => (
            <VideoCard
              key={idx}
              youtubeId={video.youtubeId}
              title={video.title}
              views={video.views}
              channel={video.channel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
