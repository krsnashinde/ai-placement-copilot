import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const NAV = [
  { to: "/app", label: "Dashboard" },
  { to: "/app/profile", label: "Profile" },
  { to: "/app/resume", label: "Resume Analyzer" },
  { to: "/app/job-match", label: "Job Matcher" },
  { to: "/app/skill-gap", label: "Skill Gap" },
  { to: "/app/dsa", label: "DSA Coach" },
  { to: "/app/aptitude", label: "Aptitude" },
  { to: "/app/interview", label: "Mock Interview" },
  { to: "/app/project", label: "Project Coach" },
  { to: "/app/study-plan", label: "Study Plan" },
  { to: "/app/mentor", label: "AI Mentor" },
  { to: "/app/progress", label: "Progress" },
  { to: "/app/settings", label: "Settings" },
] as const;

export const Route = createFileRoute("/app")({ component: AppLayout });

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center bg-ink font-display text-xl leading-none text-saffron">P</span>
      <span className="font-display text-2xl tracking-tight">PREP<span className="text-saffron-deep">COP</span></span>
    </Link>
  );
}

function AppLayout() {
  const [open, setOpen] = useState(false);
  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => (
        <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: true }}
          className="border-l-4 border-transparent px-3 py-2 font-mono text-[13px] uppercase tracking-wide hover:bg-paper"
          activeProps={{ className: "!border-saffron bg-paper font-bold" }}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-4 border-ink bg-paper px-5 py-3 lg:hidden">
        <Logo />
        <button onClick={() => setOpen(!open)} className="btn-brut px-3 py-1.5 text-xs">{open ? "Close" : "Menu"}</button>
      </header>
      {open && <div className="border-b-4 border-ink bg-smoke p-3 lg:hidden">{links}</div>}
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r-4 border-ink bg-smoke p-4 lg:flex">
          <Logo />
          <div className="label-mono px-2">Navigate</div>
          {links}
        </aside>
        <main className="min-w-0 flex-1 p-5 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
