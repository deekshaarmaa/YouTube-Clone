import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();

    if (!text || !target) {
      return NextResponse.json({ message: 'text and target are required.' }, { status: 400 });
    }

    // LibreTranslate free endpoint (no key). You can swap to your own later.
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 'source': 'auto' lets server detect
      body: JSON.stringify({ q: text, source: 'auto', target }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: 'Translation failed', details: data }, { status: 500 });
    }

    return NextResponse.json({ translatedText: data?.translatedText || data?.translated_text || '' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
