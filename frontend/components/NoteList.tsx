"use client";

import { useEffect, useState } from "react";
import { notesApi } from "@/lib/api";
import type { Note } from "@/lib/types";
import CreateNoteForm from "./CreateNoteForm";

export default function NoteList({ projectId }: { projectId?: number }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    notesApi
      .list(projectId)
      .then(setNotes)
      .catch(() => setError("Couldn't load notes."))
      .finally(() => setLoading(false));
  }, [projectId]);

  function handleCreated(note: Note) {
    setNotes((prev) => [...prev, note]);
  }

  function handleUpdated(note: Note) {
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this note?")) return;
    await notesApi.remove(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  if (loading) return <p className="text-sm text-slate-400">Loading notes...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-medium text-slate-700">New note</h2>
        <CreateNoteForm projectId={projectId} onSuccess={handleCreated} />
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-slate-500">No notes yet — create one above.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              {editingId === note.id ? (
                <CreateNoteForm
                  projectId={projectId}
                  note={note}
                  onSuccess={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-slate-950">{note.title}</h3>
                    <p className="whitespace-pre-wrap text-sm text-slate-600">{note.content}</p>
                    {projectId === undefined ? (
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Project {note.project_id}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-3 text-sm shrink-0 ml-4">
                    <button
                      onClick={() => setEditingId(note.id)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}