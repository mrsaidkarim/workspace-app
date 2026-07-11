"use client";

import { useEffect, useState } from "react";
import { notesApi, projectsApi } from "@/lib/api";
import type { Note, Project } from "@/lib/types";

interface Props {
  projectId?: number;
  note?: Note;
  onSuccess: (note: Note) => void;
  onCancel?: () => void;
}

export default function CreateNoteForm({ projectId, note, onSuccess, onCancel }: Props) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projectId ?? note?.project_id ?? 0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(projectId === undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(note);

  useEffect(() => {
    if (projectId !== undefined) {
      setSelectedProjectId(projectId);
      return;
    }

    let active = true;
    setLoadingProjects(true);
    projectsApi
      .list()
      .then((items) => {
        if (active) {
          setProjects(items);
          if (note?.project_id) {
            setSelectedProjectId(note.project_id);
          }
        }
      })
      .finally(() => {
        if (active) {
          setLoadingProjects(false);
        }
      });

    return () => {
      active = false;
    };
  }, [note?.project_id, projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const resolvedProjectId = projectId ?? selectedProjectId;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!resolvedProjectId) {
      setError("Choose a project for this note.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = isEdit
        ? await notesApi.update(note!.id, { title, content, project_id: resolvedProjectId })
        : await notesApi.create({ title, content, project_id: resolvedProjectId });
      onSuccess(result);
      if (!isEdit) {
        setTitle("");
        setContent("");
        if (projectId === undefined) {
          setSelectedProjectId(0);
        }
      }
    } catch {
      setError("Couldn't save the note. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {projectId === undefined ? (
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          disabled={loadingProjects}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <option value={0}>{loadingProjects ? "Loading projects..." : "Select a project"}</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      ) : null}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
        rows={4}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save" : "Create"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}