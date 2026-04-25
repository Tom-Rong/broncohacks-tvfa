import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { UserNote } from '@/types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { title, content } = body;
  if (title !== undefined && (typeof title !== 'string' || !title.trim() || title.length > 500)) {
    return NextResponse.json({ error: 'Title must be a non-empty string with maximum 500 characters' }, { status: 400 });
  }
  if (content !== undefined && (typeof content !== 'string' || !content.trim() || content.length > 50000)) {
    return NextResponse.json({ error: 'Content must be a non-empty string with maximum 50,000 characters' }, { status: 400 });
  }
  const notes = readJSON<UserNote[]>('user-notes.json', []);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  notes[idx] = {
    ...notes[idx],
    ...(title !== undefined && { title: title.trim() }),
    ...(content !== undefined && { content: content.trim() }),
    updatedAt: new Date().toISOString(),
  };
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
