"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Users } from "lucide-react";

const MOCK_ALERTS = [
  { user: "student_01", module: "OOP", issue: "Same error 4 times: AttributeError", severity: "high", time: "5m ago" },
  { user: "student_03", module: "Functions", issue: "Exercise time > 15 min", severity: "medium", time: "12m ago" },
  { user: "student_07", module: "Error Handling", issue: "Quiz score 35% (< 50%)", severity: "high", time: "23m ago" },
  { user: "student_12", module: "Data Structures", issue: "6 failed code runs", severity: "medium", time: "1h ago" },
];

export default function TeacherPage() {
  const [resolved, setResolved] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="text-[var(--text-secondary)]"><ArrowLeft size={18} /></Link>
        <Users size={20} style={{ color: "var(--accent)" }} />
        <span className="font-bold text-[var(--text-primary)]">Teacher Dashboard</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,68,68,0.1)", color: "var(--error)" }}>
          {MOCK_ALERTS.length - resolved.size} active alerts
        </span>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle size={18} style={{ color: "var(--warning)" }} />
          <h1 className="font-semibold text-[var(--text-primary)]">Struggle Alerts</h1>
        </div>

        <div className="space-y-3">
          {MOCK_ALERTS.map((alert, i) => (
            !resolved.has(i) && (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ background: "var(--surface)", borderColor: alert.severity === "high" ? "rgba(255,68,68,0.3)" : "var(--border)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                  {alert.user.slice(-2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[var(--text-primary)]">{alert.user}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                      {alert.module}
                    </span>
                    <span className="text-xs" style={{ color: alert.severity === "high" ? "var(--error)" : "var(--warning)" }}>
                      ● {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{alert.issue}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{alert.time}</p>
                </div>
                <button
                  onClick={() => setResolved((r) => new Set([...r, i]))}
                  className="text-xs px-3 py-1 rounded-lg transition-colors"
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  Resolve
                </button>
              </div>
            )
          ))}

          {resolved.size === MOCK_ALERTS.length && (
            <div className="text-center py-12 text-[var(--text-secondary)] text-sm">
              ✅ All alerts resolved!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
