"use client";

import { useEffect, useState } from "react";
import { teamsApi } from "@/lib/api";
import { projectsApi } from "@/lib/api";
import type { Project, Team } from "@/lib/types";

interface Props {
  teamId?: number;
  project?: Project;
  onSuccess: (project: Project) => void;
  onCancel?: () => void;
}

export default function CreateProjectForm({ teamId, project, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [selectedTeamId, setSelectedTeamId] = useState<number>(teamId ?? project?.team_id ?? 0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(teamId === undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(project);

  useEffect(() => {
    if (teamId !== undefined) {
      setSelectedTeamId(teamId);
      return;
    }

    let active = true;
    setLoadingTeams(true);
    teamsApi
      .list()
      .then((items) => {
        if (active) {
          setTeams(items as typeof teams);
          if (project?.team_id) {
            setSelectedTeamId(project.team_id);
          }
        }
      })
      .finally(() => {
        if (active) {
          setLoadingTeams(false);
        }
      });

    return () => {
      active = false;
    };
  }, [project?.team_id, teamId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const resolvedTeamId = teamId ?? selectedTeamId;
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!resolvedTeamId) {
      setError("Choose a team for this project.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = isEdit
        ? await projectsApi.update(project!.id, { name, description, team_id: resolvedTeamId })
        : await projectsApi.create({ name, description, team_id: resolvedTeamId });
      onSuccess(result);
      if (!isEdit) {
        setName("");
        setDescription("");
        if (teamId === undefined) {
          setSelectedTeamId(0);
        }
      }
    } catch {
      setError("Couldn't save the project. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {teamId === undefined ? (
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(Number(e.target.value))}
          disabled={loadingTeams}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <option value={0}>{loadingTeams ? "Loading teams..." : "Select a team"}</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      ) : null}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
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