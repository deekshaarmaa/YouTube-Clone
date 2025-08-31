'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { BACKEND_URL } from "../../lib/config";
import Link from "next/link";

type DL = {
  _id: string;
  createdAt: string;
  video: {
    _id: string;
    title: string;
    videoUrl?: string;
    fileUrl?: string;
  };
};

export default function DownloadsPage() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DL[]>([]);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [sub, setSub] = useState<{ plan: "FREE" | "PREMIUM"; active: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      try {
        const [d1, d2, d3] = await Promise.all([
          fetch(`${BACKEND_URL}/api/downloads/me?userUid=${user.uid}`).then(r => r.json()),
          fetch(`${BACKEND_URL}/api/downloads/count-today?userUid=${user.uid}`).then(r => r.json()),
          fetch(`${BACKEND_URL}/api/downloads/subscription?userUid=${user.uid}`).then(r => r.json()),
        ]);

        if (d1.ok) setDownloads(d1.downloads || []);
        if (d2.ok) setTodayCount(d2.countToday || 0);
        if (d3.ok) setSub({ plan: d3.plan, active: d3.active });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  if (!user) return <p className="p-6 text-red-500">Please login to see downloads.</p>;
  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Your Downloads</h1>
        <div className="text-sm">
          Plan: <b>{sub?.active && sub?.plan === "PREMIUM" ? "PREMIUM" : "FREE"}</b> — Today: <b>{todayCount}</b>/1
          {!(sub?.active && sub?.plan === "PREMIUM") && (
            <Link href="/premium" className="ml-3 underline text-blue-600">Go Premium</Link>
          )}
        </div>
      </div>

      {downloads.length === 0 ? (
        <p className="text-gray-500">No downloads yet.</p>
      ) : (
        <ul className="space-y-3">
          {downloads.map((d) => (
            <li key={d._id} className="p-3 rounded border flex items-center justify-between">
              <div>
                <div className="font-medium">{d.video?.title || "Untitled"}</div>
                <div className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleString()}</div>
              </div>
              <a
                href={d.video?.videoUrl || d.video?.fileUrl || "#"}
                target="_blank"
                rel="noopener"
                className="text-sm underline text-blue-600"
              >
                Open File
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
