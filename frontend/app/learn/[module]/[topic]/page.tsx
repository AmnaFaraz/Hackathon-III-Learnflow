import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ module: string; topic: string }>;
}) {
  const { module, topic } = await params;
  
  let explanation = "Could not load explanation. Make sure the backend is running.";
  try {
    const res = await api.ask({
      user_id: "demo-user", // In a real app, use auth
      message: `Explain the topic '${topic}' in the context of '${module}'`,
      module,
      level: "beginner"
    });
    explanation = res.response as string;
  } catch (e) {
    console.error("Failed to fetch explanation:", e);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/learn" className="text-[var(--text-secondary)]"><ArrowLeft size={18} /></Link>
        <span className="font-semibold text-[var(--text-primary)] capitalize">
          {module.replace(/-/g, " ")} — {topic}
        </span>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-8 flex gap-6">
        {/* Content */}
        <article className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 capitalize">
            {topic.replace(/-/g, " ")}
          </h1>
          <div className="text-[var(--text-secondary)] text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
            {explanation}
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
