import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/AiTool";
import { completion, useProfile, useScores } from "@/lib/profile";

export const Route = createFileRoute("/app/progress")({
  head: () => ({ meta: [{ title: "Progress — PrepCop" }, { name: "description", content: "Track your placement preparation progress." }] }),
  component: Progress,
});

const TOPICS = ["Arrays", "Strings", "HashMap", "Two Pointers", "Sliding Window", "Binary Search", "Recursion", "Linked List", "Stack & Queue", "Trees", "Graphs", "Dynamic Programming", "SQL Joins", "OOP", "OS Basics", "Networking"];

function Progress() {
  const { profile } = useProfile();
  const { scores, update } = useScores();
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem("apc-topics") || "[]")); } catch {} }, []);
  const toggle = (t: string) => {
    const n = done.includes(t) ? done.filter((x) => x !== t) : [...done, t];
    setDone(n); localStorage.setItem("apc-topics", JSON.stringify(n));
    update({ dsa: Math.round((n.length / TOPICS.length) * 100) });
  };
  const rows: [string, number][] = [
    ["Profile", completion(profile)],
    ["Resume", scores.resume ?? 0],
    ["Job match", scores.job ?? 0],
    ["DSA topics", scores.dsa ?? 0],
    ["Interview", (scores.interview ?? 0) * 10],
  ];
  return (
    <div>
      <PageHeader tag="Progress" title="Progress Dashboard" sub="Mark topics as done. Scores update automatically as you use the AI tools." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-2 border-ink bg-paper p-5">
          <h2 className="font-display text-2xl uppercase">Breakdown</h2>
          <div className="mt-4 space-y-4">
            {rows.map(([l, v]) => (
              <div key={l}>
                <div className="flex justify-between font-mono text-xs uppercase"><span>{l}</span><span>{v}%</span></div>
                <div className="mt-1 h-4 border-2 border-ink bg-smoke"><div className="h-full animate-growbar bg-ink" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-2 border-ink bg-smoke p-5">
          <h2 className="font-display text-2xl uppercase">Topic checklist · {done.length}/{TOPICS.length}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button key={t} onClick={() => toggle(t)}
                className={`border-2 border-ink px-3 py-1.5 font-mono text-xs uppercase ${done.includes(t) ? "bg-saffron font-bold" : "bg-paper"}`}>
                {done.includes(t) ? "✓ " : ""}{t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
