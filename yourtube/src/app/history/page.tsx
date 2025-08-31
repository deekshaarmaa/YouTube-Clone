'use client';
import VideoCard from '../../components/ui/VideoCard';

const watchedVideos = [
  {
    youtubeId: 'N3AkSS5hXMA',
    title: 'Why React is Awesome',
    views: '15K',
    channel: 'TechTalks',
  },
  {
    youtubeId: '1WmNXEVia8I',
    title: 'Learn Next.js in 15 Minutes',
    views: '8.3K',
    channel: 'CodeBoost',
  },
  {
    youtubeId: 'Bv_5Zv5c-Ts',
    title: 'How JavaScript Works 🔥',
    views: '22K',
    channel: 'JS World',
  },
];

export default function HistoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🕘 Watch History</h1>
      {watchedVideos.length === 0 ? (
        <p className="text-gray-500">You haven’t watched any videos yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {watchedVideos.map((video, idx) => (
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

