import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { completion, useProfile, useScores } from "@/lib/profile";
import { useAi } from "@/components/AiTool";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — PrepCop" }, { name: "description", content: "Your placement readiness at a glance." }] }),
  component: Dashboard,
});

function Bar({ v, tone = "ink" }: { v: number; tone?: "ink" | "saffron" }) {
  return <div className="mt-3 h-2 border border-ink bg-smoke"><div className={`h-full animate-growbar ${tone === "ink" ? "bg-ink" : "bg-saffron"}`} style={{ width: `${v}%` }} /></div>;
}

function Dashboard() {
  const { profile } = useProfile();
  const { scores } = useScores();
  const pc = completion(profile);
  const vals = [scores.resume, scores.job, scores.dsa, scores.interview !== undefined ? scores.interview * 10 : undefined, pc].filter((x): x is number => x !== undefined);
  const readiness = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  const { run, loading, error } = useAi();
  const [rec, setRec] = useState("");
  useEffect(() => { setRec(localStorage.getItem("apc-rec") || ""); }, []);
  const getRec = async () => {
    const t = await run("recommend", `My scores: ${JSON.stringify(scores)}. Profile completion ${pc}%. What should I focus on next?`);
    if (t) { setRec(t); localStorage.setItem("apc-rec", t); }
  };
  const fmt = (n?: number, s = "%") => (n === undefined ? "—" : `${n}${s}`);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight">Your Room</h1>
          <p className="label-mono mt-1">{profile.fullName || "Student"} · {profile.degree || "Degree not set"} · {profile.role || "Target role not set"}</p>
        </div>
        <span className="border-2 border-ink bg-saffron px-3 py-1.5 font-mono text-[12px] font-bold uppercase">Profile {pc}%</span>
      </div>

      <div className="flex flex-col justify-between gap-5 border-2 border-ink bg-ink p-6 text-paper sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] uppercase text-paper/60">Overall readiness</span>
            <span className="border border-saffron px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-saffron">AI-generated indicator</span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-display text-6xl leading-none text-saffron">{readiness}</span>
            <span className="mb-1 font-mono text-sm uppercase text-paper/60">/ 100</span>
          </div>
        </div>
        <div className="sm:w-56">
          <div className="h-5 border-2 border-saffron"><div className="h-full animate-growbar bg-saffron" style={{ width: `${readiness}%` }} /></div>
          <p className="mt-2 font-mono text-[11px] uppercase text-paper/50">Not a validated score — a prep guide</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {([
          ["Resume", fmt(scores.resume), scores.resume ?? 0, "/app/resume"],
          ["Job Match", fmt(scores.job), scores.job ?? 0, "/app/job-match"],
          ["DSA", fmt(scores.dsa), scores.dsa ?? 0, "/app/progress"],
          ["Interview", fmt(scores.interview, "/10"), (scores.interview ?? 0) * 10, "/app/interview"],
        ] as const).map(([l, v, w, to]) => (
          <Link key={l} to={to} className="border-2 border-ink bg-paper p-4 transition-all hover:-translate-y-0.5 hover:shadow-brut">
            <p className="label-mono">{l}</p>
            <p className="mt-1 font-display text-4xl leading-none">{v}</p>
            <Bar v={w} tone={l === "Job Match" ? "saffron" : "ink"} />
          </Link>
        ))}
        <Link to="/app/profile" className="col-span-2 border-2 border-ink bg-saffron p-4 md:col-span-1">
          <p className="label-mono">Profile</p>
          <p className="mt-1 font-display text-4xl leading-none">{pc}%</p>
          <div className="mt-3 h-2 border border-ink bg-paper"><div className="h-full bg-ink" style={{ width: `${pc}%` }} /></div>
        </Link>
      </div>

      <div className="flex flex-col gap-4 border-2 border-ink bg-paper p-6 sm:flex-row sm:items-center">
        <div className="grid size-12 shrink-0 place-items-center border-2 border-ink bg-ink font-display text-2xl text-saffron">AI</div>
        <div className="flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-saffron-deep">AI Mentor · Recommendation</p>
          <p className="mt-1 font-medium">{error || rec || "Fill your profile and run a few tools, then ask for a personalized recommendation."}</p>
        </div>
        <button onClick={getRec} disabled={loading} className="btn-brut shrink-0 px-5 py-3 text-[13px]">{loading ? "Thinking…" : "Get advice"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[["Analyze resume", "/app/resume"], ["Take a mock interview", "/app/interview"], ["Build study plan", "/app/study-plan"]].map(([l, to]) => (
          <Link key={to} to={to} className="border-2 border-ink bg-smoke p-5 font-display text-2xl uppercase transition-all hover:-translate-y-0.5 hover:shadow-brut">{l} →</Link>
        ))}
      </div>
    </div>
  );
}
