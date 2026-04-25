import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { UserNote } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const notes = readJSON<UserNote[]>('user-notes.json', []);
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content } = body;
  if (typeof title !== 'string' || !title.trim() || title.length > 500) {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  }
  if (typeof content !== 'string' || !content.trim() || content.length > 50000) {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }
  const notes = readJSON<UserNote[]>('user-notes.json', []);
  const newNote: UserNote = {
    id: uuidv4(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  writeJSON('user-notes.json', notes);
  return NextResponse.json(newNote, { status: 201 });
}
