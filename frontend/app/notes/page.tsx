import NoteList from "@/components/NoteList";

export default function NotesPage() {
  return (
    <main className="flex-1 bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <h1 className="text-3xl font-semibold text-slate-950">All notes</h1>
          <p className="mt-2 text-sm text-slate-600">
            A quick view of every note stored in the workspace database.
          </p>
        </div>
        <NoteList />
      </div>
    </main>
  );
}