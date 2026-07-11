import Link from "next/link";

const highlights = [
  {
    icon: "👥",
    title: "Teams",
    description: "Create and manage the people groups that own the work.",
    href: "/team",
  },
  {
    icon: "📂",
    title: "Projects",
    description: "Organize work into focused projects with clear ownership.",
    href: "/project",
  },
  {
    icon: "📝",
    title: "Notes",
    description: "Capture ideas, meeting notes, and follow-ups in one place.",
    href: "/notes",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-10">
        <div className="flex flex-col gap-8">

          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Workspace</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Organize your work in one place
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Manage teams, organize projects, and keep notes all within a lightweight workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/team"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Explore Teams
              </Link>
              <Link
                href="/project"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
              >
                <div className="text-2xl">{item.icon}</div>
                <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-slate-700 transition group-hover:text-slate-950">
                  Open {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}