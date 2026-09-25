import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { runAi } from "@/lib/ai.functions";
import { readProfileText } from "@/lib/profile";

export type Field = { key: string; label: string; type?: "text" | "textarea" | "select"; options?: string[]; placeholder?: string; required?: boolean };

export function PageHeader({ title, sub, tag }: { title: string; sub: string; tag?: string }) {
  return (
    <div className="mb-6">
      {tag && <p className="label-mono mb-1">{tag}</p>}
      <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-2 max-w-[60ch] text-ink/75">{sub}</p>
    </div>
  );
}

export function AiOutput({ text }: { text: string }) {
  return (
    <div className="prose-brut border-2 border-ink bg-paper p-6 shadow-brut animate-rise">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export function useAi() {
  const call = useServerFn(runAi);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = async (task: string, input: string, history?: { role: "user" | "assistant"; content: string }[]) => {
    setLoading(true); setError("");
    try {
      const r = await call({ data: { task, input, profile: readProfileText(), history } });
      if (!r.ok) { setError(r.error); return null; }
      return r.text;
    } catch { setError("Something went wrong. Please try again."); return null; }
    finally { setLoading(false); }
  };
  return { run, loading, error };
}

export function AiTool({ task, fields, build, cta, onResult, extra }: {
  task: string; fields: Field[]; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  build: (v: any) => string; cta: string;
  onResult?: (text: string) => void; extra?: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, f.options?.[0] ?? ""])));
  const [out, setOut] = useState("");
  const { run, loading, error } = useAi();
  const [vErr, setVErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !values[f.key]?.trim());
    if (missing) { setVErr(`${missing.label} is required.`); return; }
    setVErr("");
    const t = await run(task, build(values));
    if (t) { setOut(t); onResult?.(t); }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
      <form onSubmit={submit} className="flex h-fit flex-col gap-4 border-2 border-ink bg-smoke p-5">
        {extra}
        {fields.map((f) => (
          <label key={f.key} className="flex flex-col gap-1.5">
            <span className="label-mono">{f.label}{f.required && " *"}</span>
            {f.type === "textarea" ? (
              <textarea rows={7} className="field-brut" placeholder={f.placeholder} value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
            ) : f.type === "select" ? (
              <select className="field-brut" value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}>
                {(f.options ?? []).map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input className="field-brut" placeholder={f.placeholder} value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
            )}
          </label>
        ))}
        {(vErr || error) && <p className="border-2 border-destructive bg-paper p-2 text-sm text-destructive">{vErr || error}</p>}
        <button disabled={loading} className="btn-brut px-5 py-3 text-sm">{loading ? "Thinking…" : cta}</button>
        <p className="label-mono normal-case tracking-normal">Your saved profile is sent as context. Results are AI-generated guidance.</p>
      </form>
      <div>
        {loading && <div className="border-2 border-ink bg-paper p-6 font-mono text-sm uppercase">Generating report<span className="animate-pulse">…</span></div>}
        {!loading && out && <AiOutput text={out} />}
        {!loading && !out && (
          <div className="grid min-h-60 place-items-center border-2 border-dashed border-ink/40 p-6 text-center font-mono text-xs uppercase tracking-wide text-ink/50">Your AI report appears here</div>
        )}
      </div>
    </div>
  );
}

export function extractScore(text: string) {
  const m = text.match(/(\d{1,3})\s*(%|\/\s*100)/);
  if (m) { const n = Number(m[1]); if (n <= 100) return n; }
  return undefined;
}
