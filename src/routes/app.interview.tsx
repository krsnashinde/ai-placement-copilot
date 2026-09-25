import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiOutput, PageHeader, useAi } from "@/components/AiTool";
import { useScores } from "@/lib/profile";

export const Route = createFileRoute("/app/interview")({
  head: () => ({ meta: [{ title: "AI Mock Interview — PrepCop" }, { name: "description", content: "Practice interviews and get scored feedback." }] }),
  component: Interview,
});

function Interview() {
  const { run, loading, error } = useAi();
  const { update } = useScores();
  const [type, setType] = useState("Technical (Java/OOP)");
  const [questions, setQuestions] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const start = async () => {
    setFeedback("");
    const t = await run("interview", `Generate questions for a ${type} interview.`);
    if (t) setQuestions(t);
  };
  const evaluate = async () => {
    if (!question.trim() || !answer.trim()) return;
    const t = await run("interview", `Evaluate my answer.\nQuestion: ${question}\nMy answer: ${answer}`);
    if (t) {
      setFeedback(t);
      const m = t.match(/(\d{1,2}(?:\.\d)?)\s*\/\s*10/);
      if (m?.[1] && Number(m[1]) <= 10) update({ interview: Number(m[1]) });
    }
  };

  return (
    <div>
      <PageHeader tag="Interview" title="AI Mock Interview" sub="Get questions, pick one, type your answer and receive a score with a model answer." />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3 border-2 border-ink bg-smoke p-5">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="label-mono">Interview type</span>
              <select className="field-brut" value={type} onChange={(e) => setType(e.target.value)}>
                {["Technical (Java/OOP)", "DSA", "DBMS & SQL", "Operating Systems & Networks", "Web Development", "HR / Behavioral"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
            <button onClick={start} disabled={loading} className="btn-ink px-5 py-3 text-sm">Start round</button>
          </div>
          {questions && <AiOutput text={questions} />}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 border-2 border-ink bg-smoke p-5">
            <label className="flex flex-col gap-1.5"><span className="label-mono">Question</span>
              <input className="field-brut" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Paste one question" /></label>
            <label className="flex flex-col gap-1.5"><span className="label-mono">Your answer</span>
              <textarea rows={7} className="field-brut" value={answer} onChange={(e) => setAnswer(e.target.value)} /></label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button onClick={evaluate} disabled={loading || !question || !answer} className="btn-brut px-5 py-3 text-sm">{loading ? "Thinking…" : "Evaluate answer"}</button>
          </div>
          {feedback && <AiOutput text={feedback} />}
        </div>
      </div>
    </div>
  );
}
