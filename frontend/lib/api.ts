const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  execute: (code: string) =>
    req<{ stdout: string; stderr: string; returncode: number }>("/api/execute", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  ask: (body: {
    user_id: string;
    message: string;
    code?: string;
    error?: string;
    module?: string;
    level?: string;
    attempts?: number;
  }) =>
    req<{ route: string; response: unknown }>("/api/tutor/ask", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  generateExercise: (module: string, difficulty = "medium") =>
    req<{
      title: string;
      description: string;
      starter_code: string;
      test_cases: { input: string; expected: string }[];
      hints: string[];
      solution: string;
    }>(`/api/tutor/exercise/generate?module=${module}&difficulty=${difficulty}`, {
      method: "POST",
      body: JSON.stringify({}),
    }),

  gradeExercise: (code: string, test_cases: unknown[], solution: string) =>
    req<{ score: number; passed: number; total: number; feedback: string }>(
      "/api/tutor/exercise/grade",
      { method: "POST", body: JSON.stringify({ code, test_cases, solution }) }
    ),

  getProgress: (data: {
    exercises_score: number;
    quiz_avg: number;
    code_quality: number;
    streak: number;
    weak_modules: string[];
  }) =>
    req<{
      score: number;
      level: string;
      emoji: string;
      recommendations: string;
    }>("/api/tutor/progress", { method: "POST", body: JSON.stringify(data) }),
};

export const MODULES = [
  { id: "basics", title: "Python Basics", topics: 5, color: "#00D4FF" },
  { id: "control-flow", title: "Control Flow", topics: 4, color: "#3FB950" },
  { id: "data-structures", title: "Data Structures", topics: 6, color: "#FFD700" },
  { id: "functions", title: "Functions", topics: 5, color: "#FF8800" },
  { id: "oop", title: "OOP", topics: 6, color: "#B87FFF" },
  { id: "files", title: "File Handling", topics: 3, color: "#FF4444" },
  { id: "error-handling", title: "Error Handling", topics: 4, color: "#00D4FF" },
  { id: "libraries", title: "Libraries", topics: 5, color: "#3FB950" },
];
