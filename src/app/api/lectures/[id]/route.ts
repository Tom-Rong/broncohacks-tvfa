import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/storage';
import { Lecture } from '@/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lectures = readJSON<Lecture[]>('lectures.json', []);
  const lecture = lectures.find(l => l.id === id);
  if (!lecture) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lecture);
}
