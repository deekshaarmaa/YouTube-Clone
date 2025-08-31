'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="w-full px-6 py-3 shadow-md bg-white dark:bg-zinc-900 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600">
        YourTube
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none dark:bg-zinc-800 dark:text-white"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-3 py-2 rounded-r-lg"
        >
          <Search size={20} />
        </button>
      </form>

      {/* User Icon (placeholder) */}
      <div className="w-9 h-9 bg-gray-300 dark:bg-zinc-700 rounded-full" />
    </header>
  );
}
