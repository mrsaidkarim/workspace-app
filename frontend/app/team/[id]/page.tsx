import ProjectList from "@/components/ProjectList";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teamId = Number(id);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Projects</h1>
      <ProjectList teamId={teamId} />
    </main>
  );
}