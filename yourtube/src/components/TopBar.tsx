// yourtube/src/components/TopBar.tsx
'use client';
import { useAuth } from '../../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 left-0 right-0 bg-white p-4 shadow-md flex justify-end items-center z-40">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Signed in as <strong>{user.email}</strong></span>
          <button
            onClick={logout}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Not signed in</span>
      )}
    </div>
  );
}
