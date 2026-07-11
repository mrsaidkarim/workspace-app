"use client";

import { useState } from "react";
import { teamsApi } from "@/lib/api";
import type { Team } from "@/lib/types";

interface Props {
  team?: Team;              // present = edit mode
  onSuccess: (team: Team) => void;
  onCancel?: () => void;
}

export default function CreateTeamForm({ team, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(team?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(team);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = isEdit
        ? await teamsApi.update(team!.id, { name })
        : await teamsApi.create({ name });
      onSuccess(result);
      if (!isEdit) setName("");
    } catch {
      setError("Couldn't save the team. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name"
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
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
    </form>
  );
}