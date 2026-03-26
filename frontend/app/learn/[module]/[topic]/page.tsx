import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TopicPage({
  params,
}: {
  params: { module: string; topic: string };
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/learn" className="text-[var(--text-secondary)]"><ArrowLeft size={18} /></Link>
        <span className="font-semibold text-[var(--text-primary)] capitalize">
          {params.module.replace(/-/g, " ")} — {params.topic}
        </span>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-8 flex gap-6">
        {/* Content */}
        <article className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 capitalize">
            {params.topic.replace(/-/g, " ")}
          </h1>
          <div className="text-[var(--text-secondary)] text-sm leading-relaxed space-y-4">
            <p>
              Module: <span className="text-[var(--accent)]">{params.module}</span> |
              Topic: <span className="text-[var(--accent)]">{params.topic}</span>
            </p>
            <p>Content loading... Connect the backend to load AI-generated explanations.</p>
          </div>
        </article>

        {/* AI tutor panel */}
        <div className="w-64 flex-shrink-0">
          <div className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <p className="text-xs font-medium text-[var(--accent)] mb-2">🤖 AI Tutor</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Ask questions about this topic. The tutor uses your current module context to give relevant explanations.
            </p>
            <Link href="/practice" className="block mt-3 text-center text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "var(--accent)", color: "#080B14" }}>
              Open Practice Editor
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
