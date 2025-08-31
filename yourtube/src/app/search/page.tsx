'use client';

import { useSearchParams } from 'next/navigation';
import VideoCard from '@/components/ui/VideoCard';

const allVideos = [
  {
    youtubeId: 'abc123',
    title: 'React vs Angular - Which one to choose?',
    views: '45K',
    channel: 'CodeWithDeeksha',
    tags: ['react', 'angular', 'frontend'],
  },
  {
    youtubeId: 'xyz789',
    title: 'Tailwind CSS Full Course',
    views: '33K',
    channel: 'NullClass Tutorials',
    tags: ['tailwind', 'css', 'design'],
  },
  {
    youtubeId: 'pqr456',
    title: 'Node.js Crash Course',
    views: '19K',
    channel: 'CodeWithDeeksha',
    tags: ['node', 'backend', 'javascript'],
  },
  {
    youtubeId: 'lmn987',
    title: 'Relaxing Music for Focus',
    views: '102K',
    channel: 'Relaxation Hub',
    tags: ['relax', 'focus', 'music'],
  },
  {
    youtubeId: 'stu321',
    title: 'Responsive Layout in React',
    views: '17K',
    channel: 'CodeWithDeeksha',
    tags: ['react', 'layout', 'css'],
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filtered = allVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(query) ||
      video.channel.toLowerCase().includes(query) ||
      video.tags.some((tag) => tag.toLowerCase().includes(query))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🔍 Search Results for: <span className="text-orange-500">{query}</span>
      </h1>

      {filtered.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((video, idx) => (
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

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">✨ Recommended Videos</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {allVideos
            .filter((video) => !filtered.includes(video))
            .slice(0, 3)
            .map((video, idx) => (
              <VideoCard
                key={idx}
                youtubeId={video.youtubeId}
                title={video.title}
                views={video.views}
                channel={video.channel}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
