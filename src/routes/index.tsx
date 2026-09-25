import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "./app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrepCop — AI Placement Copilot for CSE & IT Students" },
      { name: "description", content: "Your AI-powered companion for resume preparation, coding practice, interviews and software placement preparation." },
      { property: "og:title", content: "PrepCop — AI Placement Copilot" },
      { property: "og:description", content: "Resume analysis, job matching, DSA coaching and AI mock interviews for placement prep." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  ["R", "AI Resume Analyzer", "Line-by-line review with rewritten bullets and missing-keyword flags."],
  ["J", "Job Match", "Paste any job description and see matched and missing skills."],
  ["D", "DSA Coach", "Patterns explained simply, with code and practice problems."],
  ["M", "Mock Interview", "Timed questions, typed answers, scored feedback with model answers."],
  ["S", "Skill Gap Analysis", "Map your stack to the target role and surface what's missing."],
  ["P", "Personalized Roadmap", "A week-by-week plan built around your hours and deadline."],
];
const STEPS = ["Build Profile", "Analyze Skills", "Improve Resume", "Practice DSA", "Mock Interviews", "Track Progress", "Get Placed"];

function Landing() {
  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <header className="sticky top-0 z-50 border-b-4 border-ink bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <Logo />
          <nav className="hidden items-center gap-7 font-mono text-[13px] uppercase tracking-wide md:flex">
            <a href="#features" className="hover:text-saffron-deep">Features</a>
            <a href="#workflow" className="hover:text-saffron-deep">Workflow</a>
          </nav>
          <Link to="/app" className="btn-brut px-4 py-2 text-[13px]">Open app</Link>
        </div>
      </header>

      <section className="border-b-4 border-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="animate-rise">
            <p className="inline-block border-2 border-ink bg-ink px-3 py-1 font-mono text-[12px] uppercase tracking-[0.15em] text-saffron">AI Placement Copilot</p>
            <h1 className="mt-5 font-display text-6xl uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">Get placed.<br /><span className="mt-2 inline-block bg-ink px-3 pt-2 text-saffron">Actually.</span></h1>
            <p className="mt-6 max-w-[46ch] text-lg font-medium text-ink/80">Your AI-powered companion for resume preparation, coding practice, interviews and software placement preparation.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/app/profile" className="btn-ink px-6 py-3.5 text-sm">Start Preparing</Link>
              <a href="#features" className="border-2 border-ink bg-paper px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wide transition-colors hover:bg-saffron">Explore Features</a>
            </div>
          </div>
          <div className="animate-rise [animation-delay:0.1s]">
            <div className="border-2 border-ink bg-saffron p-3 shadow-brut-lg">
              <div className="border-2 border-ink bg-paper p-5">
                <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                  <span className="font-mono text-[12px] font-bold uppercase">Readiness Score</span>
                  <span className="label-mono">AI-generated</span>
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <span className="font-display text-7xl leading-none">64</span>
                  <span className="mb-2 font-mono text-sm font-bold uppercase text-saffron-deep">/ 100</span>
                </div>
                <div className="mt-4 h-4 border-2 border-ink bg-smoke"><div className="h-full w-[64%] animate-growbar bg-ink" /></div>
                <p className="mt-4 font-mono text-[12px] uppercase text-ink/70">Example preview · yours starts after profile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b-4 border-ink">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-5xl uppercase leading-[0.9] tracking-tight">Six ways to<br />level up</h2>
            <p className="label-mono">01 — Capabilities</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([k, t, d], i) => (
              <div key={t} className="border-2 border-ink bg-paper p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut">
                <div className={`mb-4 grid size-11 place-items-center border-2 border-ink font-display text-xl ${i % 2 ? "bg-ink text-saffron" : "bg-saffron"}`}>{k}</div>
                <h3 className="font-display text-2xl uppercase tracking-tight">{t}</h3>
                <p className="mt-2 text-sm text-ink/75">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b-4 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-5xl uppercase leading-[0.9] tracking-tight text-saffron">The loop</h2>
            <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-paper/50">02 — Workflow</p>
          </div>
          <ol className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {STEPS.map((s, i) => (
              <li key={s} className="border-2 border-saffron/40 p-4">
                <div className="font-display text-4xl text-saffron">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2 font-display text-lg uppercase leading-tight">{s}</h3>
              </li>
            ))}
          </ol>
          <Link to="/app/profile" className="btn-brut mt-10 inline-block px-6 py-3.5 text-sm">Start Preparing</Link>
        </div>
      </section>

      <footer className="bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <span className="font-display text-2xl">PREP<span className="text-saffron">COP</span></span>
          <p className="font-mono text-[12px] uppercase text-paper/50">Built for the placement season</p>
        </div>
      </footer>
    </div>
  );
}
