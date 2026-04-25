import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { readJSON } from '@/lib/storage';
import { UserNote } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const body = await req.json();
    const { lectureContent, lectureTitle } = body;

    const userNotes = readJSON<UserNote[]>('user-notes.json', []);

    let styleContext = '';
    if (userNotes.length > 0) {
      const noteSamples = userNotes.slice(0, 5).map(n => `Title: ${n.title}\n${n.content}`).join('\n\n---\n\n');
      styleContext = `
Here are examples of how this user writes their notes. Carefully analyze their style, formatting, level of detail, use of bullet points, headers, abbreviations, and personal understanding patterns:

${noteSamples}

Now convert the lecture content below into notes that match this exact style and level of understanding.`;
    } else {
      styleContext = `Convert the following lecture content into clear, well-organized study notes. Use bullet points, headers, and highlight key concepts.`;
    }

    const prompt = `${styleContext}

Lecture Title: ${lectureTitle || 'Lecture'}
Lecture Content:
${lectureContent}

Generate comprehensive notes that capture all important concepts, definitions, examples, and key takeaways from this lecture.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: "You are an expert note-taking assistant that creates personalized study notes. You carefully match the user's writing style, formatting preferences, and level of detail based on their existing notes.",
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    const generatedContent = completion.choices[0].message.content || '';
    return NextResponse.json({ generatedContent });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate notes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
