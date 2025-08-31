'use client';

import Link from 'next/link';
import Image from 'next/image';

const subscribedChannels = [
  {
    id: 'codewithdeeksha',
    name: 'CodeWithDeeksha',
    profilePic: '/images.png',
  },
  {
    id: 'nullclass',
    name: 'NullClass Tutorials',
    profilePic: '/nullclasslogo.jpeg',
  },
  {
    id: 'relaxationhub',
    name: 'Relaxation Hub',
    profilePic: '/relaxahub.png',
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📺 Subscribed Channels</h1>
      <div className="space-y-4">
        {subscribedChannels.map((channel) => (
          <Link
            key={channel.id}
            href={`/subscriptions/${channel.id}`}
            className="flex items-center gap-4 hover:bg-gray-100 p-3 rounded-md"
          >
            <Image
              src={channel.profilePic}
              alt={channel.name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-lg font-semibold">{channel.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
