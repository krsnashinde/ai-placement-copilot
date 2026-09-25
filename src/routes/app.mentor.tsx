import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { PageHeader, useAi } from "@/components/AiTool";

export const Route = createFileRoute("/app/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — PrepCop" }, { name: "description", content: "Chat with your AI placement mentor." }] }),
  component: Mentor,
});

type Msg = { role: "user" | "assistant"; content: string };

function Mentor() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const { run, loading, error } = useAi();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { inputRef.current?.focus(); endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = async () => {
    const q = text.trim();
    if (!q || loading) return;
    const history = msgs.slice(-12);
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setText("");
    const a = await run("mentor", q, history);
    if (a) setMsgs((m) => [...m, { role: "assistant", content: a }]);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <PageHeader tag="Mentor" title="AI Mentor" sub="Ask anything about placements, careers, or what to study next." />
      <div className="flex-1 space-y-4 overflow-y-auto border-2 border-ink bg-smoke p-4">
        {msgs.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {["How do I start DSA from zero?", "Service vs product company — which should I target?", "How to explain a gap in my resume?"].map((s) => (
              <button key={s} onClick={() => setText(s)} className="border-2 border-ink bg-paper px-3 py-2 text-left text-sm hover:bg-saffron">{s}</button>
            ))}
          </div>
        )}
        {msgs.map((m, i) => m.role === "user" ? (
          <div key={i} className="ml-auto max-w-[80%] border-2 border-ink bg-ink px-4 py-3 text-paper">{m.content}</div>
        ) : (
          <div key={i} className="flex gap-3">
            <div className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-saffron font-display">AI</div>
            <div className="prose-brut min-w-0 max-w-[85%]"><ReactMarkdown>{m.content}</ReactMarkdown></div>
          </div>
        ))}
        {loading && <div className="font-mono text-xs uppercase text-ink/60">Mentor is typing<span className="animate-pulse">…</span></div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        <div ref={endRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-3 flex gap-3">
        <textarea ref={inputRef} rows={2} className="field-brut flex-1 resize-none" value={text} placeholder="Ask your mentor…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button disabled={loading || !text.trim()} className="btn-brut px-6 text-sm">Send</button>
      </form>
    </div>
  );
}
