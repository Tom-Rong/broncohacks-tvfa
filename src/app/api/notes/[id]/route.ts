import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { UserNote } from '@/types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const notes = readJSON<UserNote[]>('user-notes.json', []);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  notes[idx] = { ...notes[idx], ...body, updatedAt: new Date().toISOString() };
  writeJSON('user-notes.json', notes);
  return NextResponse.json(notes[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notes = readJSON<UserNote[]>('user-notes.json', []);
  const filtered = notes.filter(n => n.id !== id);
  writeJSON('user-notes.json', filtered);
  return NextResponse.json({ success: true });
}
