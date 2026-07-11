import NoteList from "@/components/NoteList";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Notes</h1>
      <NoteList projectId={projectId} />
    </main>
  );
}