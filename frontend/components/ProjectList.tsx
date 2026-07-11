"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/lib/types";
import CreateProjectForm from "./CreateProjectForm";

export default function ProjectList({ teamId }: { teamId?: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(teamId !== undefined);

  useEffect(() => {
    projectsApi
      .list(teamId)
      .then(setProjects)
      .catch(() => setError("Couldn't load projects."))
      .finally(() => setLoading(false));
  }, [teamId]);

  function handleCreated(project: Project) {
    setProjects((prev) => [...prev, project]);
    if (teamId === undefined) {
      setShowCreateForm(false);
    }
  }

  function handleUpdated(project: Project) {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await projectsApi.remove(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p className="text-sm text-slate-400">Loading projects...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-700">Projects</h2>
        {teamId === undefined ? (
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950"
          >
            {showCreateForm ? "Close" : "Add project"}
          </button>
        ) : null}
      </div>

      {showCreateForm ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-slate-700">New project</h3>
          <CreateProjectForm teamId={teamId} onSuccess={handleCreated} />
        </div>
      ) : null}

      {projects.length === 0 ? (
        <p className="text-sm text-slate-500">No projects yet — create one above.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
          {projects.map((project) => (
            <li key={project.id} className="p-4">
              {editingId === project.id ? (
                <CreateProjectForm
                  teamId={teamId}
                  project={project}
                  onSuccess={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/project/${project.id}`}
                      className="font-medium text-slate-950 hover:text-slate-700"
                    >
                      {project.name}
                    </Link>
                    {project.description && (
                      <p className="text-sm text-slate-600">{project.description}</p>
                    )}
                    {teamId === undefined ? (
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Team {project.team_id}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => setEditingId(project.id)}
                      className="text-slate-600 hover:text-slate-950"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-slate-600 hover:text-red-600"
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