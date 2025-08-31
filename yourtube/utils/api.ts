const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export async function fetchComments(videoId: string) {
  const res = await fetch(`${BASE}/comments/${videoId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function postComment(payload: {
  videoId: string;
  text: string;
  author: { name: string; email: string; avatar?: string };
}) {
  const res = await fetch(`${BASE}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to post comment');
  return res.json();
}

export async function likeComment(id: string, userKey: string) {
  const res = await fetch(`${BASE}/comments/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userKey }),
  });
  if (!res.ok) throw new Error('Failed to like');
  return res.json();
}

export async function dislikeComment(id: string, userKey: string) {
  const res = await fetch(`${BASE}/comments/${id}/dislike`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userKey }),
  });
  if (!res.ok) throw new Error('Failed to dislike');
  return res.json();
}

export async function translateText(text: string, target: string) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, target }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Translate failed');
  return res.json() as Promise<{ translatedText: string }>;
}
