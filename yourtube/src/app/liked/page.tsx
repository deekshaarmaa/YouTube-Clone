'use client';
import VideoCard from '@/components/ui/VideoCard';

const likedVideos = [
  {
    youtubeId: 'a1b2c3d4e5',
    title: 'Frontend Developer Roadmap 2025',
    views: '10K',
    channel: 'TechJourney',
  },
  {
    youtubeId: 'x9y8z7w6v5',
    title: 'React Hooks Crash Course',
    views: '32K',
    channel: 'React Simplified',
  },
];

export default function LikedPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👍 Liked Videos</h1>
      {likedVideos.length === 0 ? (
        <p className="text-gray-500">You haven’t liked any videos yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {likedVideos.map((video, idx) => (
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
