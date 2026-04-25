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
  const notes = readJSON<UserNote[]>('user-notes.json', []);
  const newNote: UserNote = {
    id: uuidv4(),
    title: body.title,
    content: body.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  writeJSON('user-notes.json', notes);
  return NextResponse.json(newNote, { status: 201 });
}
