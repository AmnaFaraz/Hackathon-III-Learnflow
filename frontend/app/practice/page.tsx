"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Play, ArrowLeft, Bot, Send } from "lucide-react";
import { api } from "@/lib/api";

// Monaco editor — dynamic import (no SSR)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const STARTER = `# LearnFlow Python Practice
# Write your Python code here and click Run

def greet(name):
    return f"Hello, {name}!"

print(greet("Panaversity"))
`;

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export default function PracticePage() {
  const [code, setCode] = useState(STARTER);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I can help review your code, debug errors, or explain concepts. What do you need?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [exercise, setExercise] = useState<any>(null);

  const runCode = useCallback(async () => {
    setRunning(true);
    setOutput("Running...");
    try {
      const result = await api.execute(code);
      if (result.stdout) setOutput(result.stdout);
      else if (result.stderr) setOutput(`Error:\n${result.stderr}`);
      else setOutput("(no output)");
    } catch {
      setOutput("Error: Could not connect to backend.");
    } finally {
      setRunning(false);
    }
  }, [code]);

  const generateExercise = async () => {
    setOutput("Generating new exercise...");
    try {
      const ex = await api.generateExercise("basics", "medium");
      setExercise(ex);
      setCode(ex.starter_code || "");
      setOutput(`Exercise: ${ex.title}\n\n${ex.description}`);
    } catch (e) {
      setOutput("Failed to generate exercise.");
    }
  };

  const gradeCode = async () => {
    if (!exercise) return setOutput("Generate an exercise first!");
    setRunning(true);
    setOutput("Grading your code...");
    try {
      const result = await api.gradeExercise(code, exercise.test_cases, exercise.solution);
      setOutput(`Score: ${result.score}/100\nPassed: ${result.passed}/${result.total}\n\nFeedback: ${result.feedback}`);
    } catch {
      setOutput("Grading failed.");
    } finally {
      setRunning(false);
    }
  };

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const result = await api.ask({
        user_id: "demo",
        message: text,
        code,
        module: "basics",
      });
      const resp = typeof result.response === "string"
        ? result.response
        : JSON.stringify(result.response, null, 2);
      setMessages((m) => [...m, { role: "assistant", content: resp }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Backend not connected." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <nav className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="text-[var(--text-secondary)]"><ArrowLeft size={16} /></Link>
        <span className="font-bold text-[var(--text-primary)]">Python Practice</span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={generateExercise}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            New Exercise
          </button>
          <button
            onClick={gradeCode}
            disabled={running || !exercise}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Grade AI
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ background: chatOpen ? "var(--accent)" : "var(--surface-2)", color: chatOpen ? "#080B14" : "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <Bot size={14} />
            AI Tutor
          </button>
          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: running ? "var(--border)" : "var(--accent)", color: "#080B14" }}
          >
            <Play size={14} />
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </nav>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor + Output */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Output panel */}
          <div
            className="h-40 border-t p-3 font-mono text-sm overflow-auto flex-shrink-0"
            style={{ background: "#0A0F1C", borderColor: "var(--border)", color: output.startsWith("Error") ? "var(--error)" : "var(--text-primary)" }}
          >
            <div className="text-xs text-[var(--text-secondary)] mb-2">Output</div>
            <pre className="whitespace-pre-wrap">{output || "Press Run to execute your code"}</pre>
          </div>
        </div>

        {/* AI Tutor sidebar */}
        {chatOpen && (
          <div className="w-80 border-l flex flex-col" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <div className="p-3 border-b text-sm font-medium text-[var(--text-primary)]" style={{ borderColor: "var(--border)" }}>
              🤖 AI Tutor
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg leading-relaxed ${msg.role === "user" ? "ml-4" : "mr-4"}`}
                  style={{
                    background: msg.role === "user" ? "var(--accent)" : "var(--surface-2)",
                    color: msg.role === "user" ? "#080B14" : "var(--text-primary)",
                    border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  }}>
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </div>
              ))}
              {chatLoading && (
                <div className="text-xs text-[var(--text-secondary)] p-2">Thinking...</div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Ask about your code..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg text-xs outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <button onClick={sendChat} className="p-1.5 rounded-lg" style={{ background: "var(--accent)", color: "#080B14" }}>
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
