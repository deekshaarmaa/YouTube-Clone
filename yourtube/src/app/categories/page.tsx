// src/app/categories/page.tsx
'use client';

import VideoCard from '@/components/ui/VideoCard';

const categoryData: {
  [key: string]: {
    youtubeId: string;
    title: string;
    views: string;
    channel: string;
  }[];
} = {
  Technology: [
    {
      youtubeId: 'abc123',
      title: 'AI in 2025',
      views: '20K',
      channel: 'TechTalks',
    },
    {
      youtubeId: 'def456',
      title: 'JavaScript Deep Dive',
      views: '15K',
      channel: 'CodeWithDeeksha',
    },
  ],
  Music: [
    {
      youtubeId: 'ghi789',
      title: 'Lo-Fi Chill Beats',
      views: '50K',
      channel: 'ChillZone',
    },
  ],
  Education: [
    {
      youtubeId: 'jkl987',
      title: 'Math Tricks for Exams',
      views: '35K',
      channel: 'StudySmart',
    },
    {
      youtubeId: 'mno321',
      title: 'Science Explained Simply',
      views: '18K',
      channel: 'EduScope',
    },
  ],
};

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">📂 Browse by Categories</h1>

      {Object.entries(categoryData).map(([category, videos]) => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {videos.map((video, idx) => (
              <VideoCard key={idx} {...video} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
