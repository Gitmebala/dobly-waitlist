import { NextResponse } from 'next/server';
import { getSpotsSnapshot } from '@/lib/waitlist';

export async function GET() {
  try {
    const snapshot = await getSpotsSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        'Cache-Control': 'public, max-age=10'
      }
    });
  } catch {
    return NextResponse.json({ count: 0, spotsLeft: 100, percentFull: 0 });
  }
}
