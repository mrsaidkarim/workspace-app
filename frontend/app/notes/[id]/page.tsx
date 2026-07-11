import Link from "next/link";

import { notesApi } from "@/lib/api";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await notesApi.get(Number(id));

  return (
    <main className="flex-1 bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <h1 className="text-3xl font-semibold text-white">{note.title}</h1>
        </div>
        <Link
          href="/notes"
          className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white"
        >
          Back to notes
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm shadow-black/20">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{note.content}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
          Project {note.project_id}
        </p>
      </div>
      </div>
    </main>
  );
}