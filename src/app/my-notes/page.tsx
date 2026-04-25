'use client';
import { useState, useEffect } from 'react';
import { UserNote } from '@/types';

export default function MyNotesPage() {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserNote | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchNotes(); }, []);

  async function fetchNotes() {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await fetch(`/api/notes/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: '', content: '' });
    setEditing(null);
    setShowForm(false);
    setSaving(false);
    fetchNotes();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  }

  function startEdit(note: UserNote) {
    setEditing(note);
    setForm({ title: note.title, content: note.content });
    setShowForm(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-500 mt-1">These notes train the AI to match your writing style</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', content: '' }); }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          + Add Note
        </button>
      </div>

      {notes.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <p className="text-indigo-800">
            <strong>Great!</strong> You have {notes.length} note{notes.length > 1 ? 's' : ''} helping train your AI style.
            {notes.length < 3 && ' Add at least 3 notes for best results.'}
          </p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-6">{editing ? 'Edit Note' : 'Add New Note'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Note title..."
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Write your notes here in your natural style..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Write exactly as you normally would — abbreviations, formatting, shorthand, etc.</p>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Saving...' : (editing ? 'Update Note' : 'Save Note')}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-4">📓</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No notes yet</h3>
          <p className="text-gray-500 mb-6">Add some notes to help the AI learn your style</p>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Add Your First Note
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-800">{note.title}</h3>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => startEdit(note)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                </div>
              </div>
              <pre className="text-gray-600 text-sm whitespace-pre-wrap font-mono bg-gray-50 rounded-lg p-4">{note.content}</pre>
              <p className="text-xs text-gray-400 mt-3">{new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
