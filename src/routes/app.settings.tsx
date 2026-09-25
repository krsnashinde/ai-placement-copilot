import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AiTool";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — PrepCop" }, { name: "description", content: "Manage your PrepCop data." }] }),
  component: () => {
    const [msg, setMsg] = useState("");
    const reset = () => {
      if (!confirm("Delete your profile, scores and progress from this browser?")) return;
      ["apc-profile", "apc-scores", "apc-topics", "apc-rec"].forEach((k) => localStorage.removeItem(k));
      setMsg("All data cleared.");
    };
    return (
      <div>
        <PageHeader tag="Settings" title="Settings" sub="Your data is currently saved in this browser only." />
        <div className="max-w-xl border-2 border-ink bg-smoke p-5">
          <h2 className="font-display text-2xl uppercase">Reset data</h2>
          <p className="mt-1 text-sm text-ink/75">Clears your profile, scores and topic progress.</p>
          <button onClick={reset} className="btn-ink mt-4 px-5 py-3 text-sm">Clear all data</button>
          {msg && <p className="mt-3 font-mono text-xs uppercase">{msg}</p>}
        </div>
      </div>
    );
  },
});
