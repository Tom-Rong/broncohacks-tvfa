'use client';
import { useState, useEffect } from 'react';
import { Lecture } from '@/types';

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', content: '', uploadedBy: '' });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState<{ lectureId: string; content: string } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchLectures(); }, []);

  async function fetchLectures() {
    const res = await fetch('/api/lectures');
    const data = await res.json();
    setLectures(data);
    setLoading(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', subject: '', description: '', content: '', uploadedBy: '' });
    setShowUpload(false);
    setSaving(false);
    fetchLectures();
  }

  async function handleGenerateFromLecture(lecture: Lecture) {
    setGenerating(lecture.id);
    setGeneratedNotes(null);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lectureContent: lecture.content, lectureTitle: lecture.title }),
    });
    const data = await res.json();
    setGenerating(null);
    setGeneratedNotes({ lectureId: lecture.id, content: data.generatedContent });
  }

  const filtered = lectures.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.subject.toLowerCase().includes(search.toLowerCase()) ||
    l.uploadedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecture Library</h1>
          <p className="text-gray-500 mt-1">Browse and transform lectures into your personalized notes</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          + Upload Lecture
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search lectures by title, subject, or uploader..."
          className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Upload a Lecture</h2>
            <form onSubmit={handleUpload}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Physics, CS101" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Brief description..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded By</label>
                <input type="text" value={form.uploadedBy} onChange={e => setForm({...form, uploadedBy: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name (optional)" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Content *</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Paste lecture transcript, notes, or content here..." required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Uploading...' : 'Upload Lecture'}
                </button>
                <button type="button" onClick={() => setShowUpload(false)} className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Notes Modal */}
      {generatedNotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Personalized Notes</h2>
              <div className="flex gap-3">
                <button onClick={() => navigator.clipboard.writeText(generatedNotes.content)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">📋 Copy</button>
                <button onClick={() => setGeneratedNotes(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm font-mono bg-gray-50 rounded-xl p-6 leading-relaxed">{generatedNotes.content}</pre>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading lectures...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {search ? 'No lectures found' : 'No lectures yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {search ? 'Try a different search term' : 'Be the first to upload a lecture!'}
          </p>
          {!search && (
            <button onClick={() => setShowUpload(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Upload First Lecture
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(lecture => (
            <div key={lecture.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">{lecture.subject}</span>
                <span className="text-xs text-gray-400">{new Date(lecture.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{lecture.title}</h3>
              {lecture.description && <p className="text-gray-500 text-sm mb-3 flex-1">{lecture.description}</p>}
              <p className="text-xs text-gray-400 mb-4">By {lecture.uploadedBy || 'Anonymous'}</p>
              <p className="text-xs text-gray-500 mb-4 line-clamp-3 bg-gray-50 p-3 rounded-lg">{lecture.content.substring(0, 150)}...</p>
              <button
                onClick={() => handleGenerateFromLecture(lecture)}
                disabled={generating === lecture.id}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
              >
                {generating === lecture.id ? '🤖 Generating...' : '✨ Generate My Notes'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
