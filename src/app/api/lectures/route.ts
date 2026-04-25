import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { Lecture } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const lectures = readJSON<Lecture[]>('lectures.json', []);
  return NextResponse.json(lectures);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, subject, description, content, uploadedBy } = body;
  if (typeof title !== 'string' || !title.trim() || title.length > 500) {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  }
  if (typeof subject !== 'string' || !subject.trim() || subject.length > 200) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
  }
  if (typeof content !== 'string' || !content.trim() || content.length > 200000) {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }
  const lectures = readJSON<Lecture[]>('lectures.json', []);
  const newLecture: Lecture = {
    id: uuidv4(),
    title: title.trim(),
    subject: subject.trim(),
    description: typeof description === 'string' ? description.trim().substring(0, 1000) : '',
    content: content.trim(),
    uploadedBy: typeof uploadedBy === 'string' ? uploadedBy.trim().substring(0, 200) : 'Anonymous',
    createdAt: new Date().toISOString(),
  };
  lectures.push(newLecture);
  writeJSON('lectures.json', lectures);
  return NextResponse.json(newLecture, { status: 201 });
}
