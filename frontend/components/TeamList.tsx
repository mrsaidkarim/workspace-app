"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { teamsApi } from "@/lib/api";
import type { Team } from "@/lib/types";
import CreateTeamForm from "./CreateTeamForm";

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    teamsApi
      .list()
      .then(setTeams)
      .catch(() => setError("Couldn't load teams."))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(team: Team) {
    setTeams((prev) => [...prev, team]);
    setShowCreateForm(false);
  }

  function handleUpdated(team: Team) {
    setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this team?")) return;
    await teamsApi.remove(id);
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }

  if (loading) return <p className="text-sm text-gray-500">Loading teams...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-700">Teams</h2>
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950"
        >
          {showCreateForm ? "Close" : "Add team"}
        </button>
      </div>

      {showCreateForm ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-slate-700">New team</h3>
          <CreateTeamForm onSuccess={handleCreated} />
        </div>
      ) : null}

      {teams.length === 0 ? (
        <p className="text-sm text-slate-500">No teams yet — use the button above to create one.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
          {teams.map((team) => (
            <li key={team.id} className="p-4">
              {editingId === team.id ? (
                <CreateTeamForm
                  team={team}
                  onSuccess={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <Link
                    href={`/team/${team.id}`}
                    className="font-medium text-slate-950 hover:text-slate-700"
                  >
                    {team.name}
                  </Link>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => setEditingId(team.id)}
                      className="text-slate-600 hover:text-slate-950"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
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