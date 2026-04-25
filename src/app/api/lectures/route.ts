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
  const lectures = readJSON<Lecture[]>('lectures.json', []);
  const newLecture: Lecture = {
    id: uuidv4(),
    title: body.title,
    subject: body.subject,
    description: body.description,
    content: body.content,
    uploadedBy: body.uploadedBy || 'Anonymous',
    createdAt: new Date().toISOString(),
  };
  lectures.push(newLecture);
  writeJSON('lectures.json', lectures);
  return NextResponse.json(newLecture, { status: 201 });
}
