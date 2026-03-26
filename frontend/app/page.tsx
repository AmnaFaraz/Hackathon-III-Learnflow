import Link from "next/link";
import { Code2, Brain, Trophy, AlertTriangle } from "lucide-react";

const AGENTS = [
  { emoji: "🎯", name: "Triage", desc: "Routes to the right specialist" },
  { emoji: "💡", name: "Concepts", desc: "Explains topics at your level" },
  { emoji: "🔍", name: "Code Review", desc: "PEP8 + quality + efficiency" },
  { emoji: "🐛", name: "Debug", desc: "Hints before solutions" },
  { emoji: "✏️", name: "Exercise", desc: "Generates + auto-grades challenges" },
  { emoji: "📊", name: "Progress", desc: "Mastery scores + recommendations" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <Code2 size={20} style={{ color: "var(--accent)" }} />
          <span className="font-bold text-[var(--text-primary)]">LearnFlow</span>
        </div>
        <div className="flex gap-3">
          <Link href="/learn" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Learn</Link>
          <Link href="/practice" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Practice</Link>
          <Link href="/progress" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Progress</Link>
          <Link href="/teacher" className="text-sm px-3 py-1 rounded-lg" style={{ background: "var(--accent)", color: "#080B14" }}>Teacher</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
          style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "var(--accent)" }}>
          <Brain size={12} />
          Hackathon III — 1000+ pts
        </div>
        <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
          Learn Python with <span style={{ color: "var(--accent)" }}>AI</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mb-8">
          6 specialized AI agents guide you through Python — from basics to mastery.
          Real code execution, instant feedback, adaptive exercises.
        </p>
        <div className="flex gap-4">
          <Link href="/learn" className="px-6 py-3 rounded-lg font-medium" style={{ background: "var(--accent)", color: "#080B14" }}>
            Start Learning
          </Link>
          <Link href="/practice" className="px-6 py-3 rounded-lg font-medium" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            Practice Code →
          </Link>
        </div>
      </section>

      {/* Agents grid */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-center text-xl font-semibold text-[var(--text-primary)] mb-8">6 AI Agents</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {AGENTS.map((a) => (
            <div key={a.name} className="p-4 rounded-xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <span className="text-2xl">{a.emoji}</span>
              <p className="font-medium text-[var(--text-primary)] mt-2">{a.name}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t px-6 py-12" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { icon: <Code2 size={24} />, value: "8", label: "Python Modules" },
            { icon: <Brain size={24} />, value: "6", label: "AI Agents" },
            { icon: <Trophy size={24} />, value: "100", label: "Points Max" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ color: "var(--accent)" }} className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-3xl font-bold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
