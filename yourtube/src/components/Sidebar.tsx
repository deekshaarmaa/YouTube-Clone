// yourtube/src/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="w-64 min-h-screen p-4 bg-zinc-900 text-white fixed">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold mb-2">Home</h2>
          <ul>
            <li><Link href="/" className="hover:underline">🏠 Home</Link></li>
            <li><Link href="/subscriptions" className="hover:underline">📺 Subscriptions</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">My Library</h2>
          <ul>
            <li><Link href="/history" className="hover:underline">📜 History</Link></li>
            <li><Link href="/categories" className="hover:underline">🔥 Categories</Link></li>
            <li><Link href="/watch-later" className="hover:underline">⏰ Watch Later</Link></li>
            <li><Link href="/liked" className="hover:underline">❤️ Liked Videos</Link></li>
          </ul>
        </div>

        {!user ? (
          <div>
            <Link
              href="/register-login"
              className="block border border-white rounded-[20%] text-blue-400 px-3 py-1 text-center hover:bg-zinc-800"
            >
              Register/Login
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-2">Profile</h2>
            <ul>
              <li><Link href="/upload-video" className="hover:underline">Uploads</Link></li>
              <li><Link href="/your-videos" className="hover:underline">🎥 My Videos</Link></li>
              {/* ✅ New links visible only when logged in */}
              <li><Link href="/downloads" className="hover:underline">⬇️ Downloads</Link></li>
              <li><Link href="/premium" className="hover:underline">🌟 Premium</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
