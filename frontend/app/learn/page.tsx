import Link from "next/link";
import { MODULES } from "@/lib/api";
import { Code2, ArrowLeft } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ArrowLeft size={18} /></Link>
        <Code2 size={20} style={{ color: "var(--accent)" }} />
        <span className="font-bold text-[var(--text-primary)]">Python Curriculum</span>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">8 Python Modules</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">
          Work through modules in order. Each module has topics, exercises, and quizzes.
        </p>

        <div className="space-y-3">
          {MODULES.map((mod, i) => (
            <Link
              key={mod.id}
              href={`/learn/${mod.id}/intro`}
              className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[var(--accent)] group"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ background: `${mod.color}20`, color: mod.color }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {mod.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">{mod.topics} topics</p>
              </div>
              <div className="progress-bar w-24">
                <div className="progress-fill" style={{ width: "0%" }} />
              </div>
              <span className="text-xs text-[var(--text-secondary)]">0%</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
