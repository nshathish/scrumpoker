import { NextResponse } from 'next/server';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get('seed') || 'default';

  const svg = createAvatar(bottts, {
    seed,
    size: 80,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
  }).toString();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
