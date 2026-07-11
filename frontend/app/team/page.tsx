import TeamList from "@/components/TeamList";

export default function TeamIndexPage() {
  return (
    <main className="flex-1 bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <h1 className="text-3xl font-semibold text-slate-950">All teams</h1>
          <p className="mt-2 text-sm text-slate-600">
            Browse every team in the workspace, add a new one, or update and delete existing teams.
          </p>
        </div>
        <TeamList />
      </div>
    </main>
  );
}