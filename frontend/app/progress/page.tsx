"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Zap, Target } from "lucide-react";
import { api } from "@/lib/api";

export default function ProgressPage() {
  const [mastery, setMastery] = useState<{
    score: number; level: string; emoji: string; recommendations: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const result = await api.getProgress({
        exercises_score: 75,
        quiz_avg: 68,
        code_quality: 80,
        streak: 5,
        weak_modules: ["oop", "error-handling"],
      });
      setMastery(result);
    } catch {
      setMastery({ score: 0, level: "Beginner", emoji: "🔴", recommendations: "Backend not connected." });
    } finally {
      setLoading(false);
    }
  };

  const LEVEL_COLORS: Record<string, string> = {
    Beginner: "var(--beginner)",
    Learning: "var(--learning)",
    Proficient: "var(--proficient)",
    Mastered: "var(--mastered)",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="text-[var(--text-secondary)]"><ArrowLeft size={18} /></Link>
        <Trophy size={20} style={{ color: "var(--accent)" }} />
        <span className="font-bold text-[var(--text-primary)]">My Progress</span>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Mastery card */}
        <div className="rounded-xl border p-6 mb-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          {mastery ? (
            <>
              <div className="text-5xl mb-3">{mastery.emoji}</div>
              <div className="text-4xl font-bold mb-1" style={{ color: LEVEL_COLORS[mastery.level] || "var(--accent)" }}>
                {mastery.score}
              </div>
              <div className="text-[var(--text-secondary)] text-sm mb-4">Mastery Score — {mastery.level}</div>
              <div className="progress-bar max-w-xs mx-auto mb-4">
                <div className="progress-fill" style={{ width: `${mastery.score}%`, background: LEVEL_COLORS[mastery.level] }} />
              </div>
              {mastery.recommendations && (
                <div className="text-left text-sm text-[var(--text-secondary)] mt-4 p-3 rounded-lg"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <p className="text-xs text-[var(--accent)] font-medium mb-2">🎯 Recommendations</p>
                  <pre className="whitespace-pre-wrap font-sans">{mastery.recommendations}</pre>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">📊</div>
              <p className="text-[var(--text-secondary)] text-sm mb-4">Calculate your Python mastery score</p>
              <button
                onClick={calculate}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-sm font-medium"
                style={{ background: loading ? "var(--border)" : "var(--accent)", color: "#080B14" }}
              >
                {loading ? "Calculating..." : "Calculate Mastery"}
              </button>
            </>
          )}
        </div>

        {/* Mastery levels legend */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: "🔴", level: "Beginner", range: "0–40" },
            { emoji: "🟡", level: "Learning", range: "41–70" },
            { emoji: "🟢", level: "Proficient", range: "71–90" },
            { emoji: "🔵", level: "Mastered", range: "91–100" },
          ].map((l) => (
            <div key={l.level} className="flex items-center gap-3 p-3 rounded-lg border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <span className="text-xl">{l.emoji}</span>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{l.level}</p>
                <p className="text-xs text-[var(--text-secondary)]">Score: {l.range}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
