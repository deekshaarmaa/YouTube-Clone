// src/components/ProfileHeader.tsx
interface ProfileHeaderProps {
  username: string;
  profilePicture: string;
  subscribers: number;
}

export default function ProfileHeader({ username, profilePicture, subscribers }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src={profilePicture}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-bold">{username}</h2>
        <p className="text-gray-500 dark:text-gray-400">{subscribers} subscribers</p>
      </div>
    </div>
  );
}
