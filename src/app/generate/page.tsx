'use client';
import { useState, useRef } from 'react';

type InputMode = 'text' | 'audio' | 'live';

export default function GeneratePage() {
  const [mode, setMode] = useState<InputMode>('text');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureText, setLectureText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [error, setError] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setError('Microphone access denied. Please allow microphone access.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  async function transcribeAudio(file: File | Blob, filename = 'audio.webm') {
    setTranscribing(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('audio', file instanceof File ? file : new File([file], filename, { type: 'audio/webm' }));
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) { setError(data.error); return ''; }
      setTranscribedText(data.text);
      return data.text as string;
    } catch {
      setError('Failed to transcribe audio. Please try again.');
      return '';
    } finally {
      setTranscribing(false);
    }
  }

  async function handleGenerate() {
    setError('');
    setGeneratedNotes('');
    let content = '';

    if (mode === 'text') {
      content = lectureText;
    } else if (mode === 'audio' && audioFile) {
      content = await transcribeAudio(audioFile, audioFile.name);
    } else if (mode === 'live' && recordedBlob) {
      content = await transcribeAudio(recordedBlob);
    }

    if (!content.trim()) {
      setError('Please provide lecture content.');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lectureContent: content, lectureTitle }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setGeneratedNotes(data.generatedContent);
    } catch {
      setError('Failed to generate notes. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  const tabs: { id: InputMode; label: string; icon: string }[] = [
    { id: 'text', label: 'Paste Text', icon: '📄' },
    { id: 'audio', label: 'Upload Audio', icon: '🎵' },
    { id: 'live', label: 'Live Recording', icon: '🎙️' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Notes</h1>
        <p className="text-gray-500 mt-1">Transform lecture content into notes tailored to your style</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Title (optional)</label>
          <input
            type="text"
            value={lectureTitle}
            onChange={e => setLectureTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Chapter 5: Thermodynamics"
          />
        </div>

        {/* Input Mode Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                mode === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Text Input */}
        {mode === 'text' && (
          <textarea
            value={lectureText}
            onChange={e => setLectureText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Paste your lecture notes, slides text, or any lecture content here..."
          />
        )}

        {/* Audio Upload */}
        {mode === 'audio' && (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-gray-600 mb-3">Upload an audio recording of your lecture</p>
              <input
                type="file"
                accept="audio/*"
                onChange={e => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="bg-indigo-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors font-medium">
                Choose Audio File
              </label>
              {audioFile && <p className="mt-3 text-sm text-green-600">✓ {audioFile.name}</p>}
            </div>
            <p className="text-xs text-gray-400 mt-2">Supports MP3, WAV, M4A, WebM, and more. Max 25MB.</p>
          </div>
        )}

        {/* Live Recording */}
        {mode === 'live' && (
          <div className="text-center py-6">
            <div className={`text-6xl mb-4 ${isRecording ? 'animate-pulse' : ''}`}>🎙️</div>
            {!isRecording && !recordedBlob && (
              <div>
                <p className="text-gray-600 mb-4">Record your lecture in real time</p>
                <button onClick={startRecording} className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors text-lg">
                  Start Recording
                </button>
              </div>
            )}
            {isRecording && (
              <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-semibold">Recording...</span>
                </div>
                <button onClick={stopRecording} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors">
                  Stop Recording
                </button>
              </div>
            )}
            {recordedBlob && !isRecording && (
              <div>
                <p className="text-green-600 font-semibold mb-4">✓ Recording captured ({(recordedBlob.size / 1024).toFixed(1)} KB)</p>
                <audio controls src={URL.createObjectURL(recordedBlob)} className="mx-auto mb-4" />
                <button onClick={startRecording} className="text-sm text-indigo-600 hover:underline">
                  Re-record
                </button>
              </div>
            )}
          </div>
        )}

        {transcribedText && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">Transcribed Text:</p>
            <p className="text-sm text-blue-700">{transcribedText}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={generating || transcribing}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {transcribing ? '🎤 Transcribing audio...' : generating ? '🤖 Generating notes...' : '✨ Generate My Notes'}
          </button>
        </div>
      </div>

      {generatedNotes && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Your Personalized Notes</h2>
            <button
              onClick={() => navigator.clipboard.writeText(generatedNotes)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              📋 Copy
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-gray-700 text-sm font-mono bg-gray-50 rounded-xl p-6 leading-relaxed">{generatedNotes}</pre>
        </div>
      )}
    </div>
  );
}
