import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workspace App",
  description: "Teams, projects, and notes workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-wide text-slate-950">
              Workspace App
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/team" className="hover:text-slate-950">
                Teams
              </Link>
              <Link href="/project" className="hover:text-slate-950">
                Projects
              </Link>
              <Link href="/notes" className="hover:text-slate-950">
                Notes
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
