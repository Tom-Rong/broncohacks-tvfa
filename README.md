# NoteAI 📝

**BroncoHacks 2026** — Thomas Rong, Vivian Chen, Aidan Phu, and Felix Zheng

> AI-powered note-taking that adapts to *your* unique style. Turn any lecture into notes that feel like *you* wrote them.

## Features

- **Style Training** — Write a few sample notes in your natural style. The AI learns your formatting, abbreviations, level of detail, and how you organize information.
- **Note Generation (Text)** — Paste lecture slides, transcripts, or any text and get notes tailored to your personal style.
- **Note Generation (Audio Upload)** — Upload an MP3, WAV, M4A, or WebM lecture recording. The AI transcribes it with Whisper and then generates your personalized notes.
- **Live Recording** — Record a lecture directly in the browser, then let the AI transcribe and convert it to your notes in real time.
- **Lecture Library** — A shared repository where students and teachers can upload lectures. Any user can browse and convert any lecture into their own personalized notes.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| AI — Notes | OpenAI GPT-4o |
| AI — Transcription | OpenAI Whisper |
| Storage | JSON files (file-based, zero-config) |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure OpenAI
```bash
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key
```

### 3. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## App Structure

```
src/
  app/
    page.tsx               # Dashboard / landing page
    my-notes/page.tsx      # Manage personal notes (trains AI style)
    generate/page.tsx      # Generate notes from text / audio / live mic
    lectures/page.tsx      # Public lecture repository
    api/
      notes/               # GET, POST user notes
      notes/[id]/          # PUT, DELETE a note
      lectures/            # GET, POST lectures
      lectures/[id]/       # GET a lecture
      generate/            # POST → GPT-4o note generation
      transcribe/          # POST → Whisper transcription
  components/
    Navbar.tsx
  lib/
    storage.ts             # JSON file read/write helpers
  types/
    index.ts               # Shared TypeScript types
data/                      # Runtime JSON storage (gitignored)
```

## How It Works

1. **Train** — Go to *My Notes* and add 3+ of your own notes written in your natural style.
2. **Input** — Go to *Generate Notes* and paste lecture text, upload an audio file, or start live recording.
3. **Get Notes** — The AI reads your existing notes, learns your style, then rewrites the lecture as *your* notes.
4. **Library** — Visit *Lecture Library* to browse uploaded lectures and generate personalized notes from any of them.

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key (required) |
