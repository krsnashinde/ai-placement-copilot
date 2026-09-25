import { createFileRoute } from "@tanstack/react-router";
import { AiTool, extractScore, PageHeader } from "@/components/AiTool";
import { useScores } from "@/lib/profile";

export const Route = createFileRoute("/app/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — PrepCop" }, { name: "description", content: "AI resume review and job match." }] }),
  component: () => {
    const { update } = useScores();
    return (
      <div>
        <PageHeader tag="Resume" title="Resume Analyzer" sub="Paste your resume text (copy it from your PDF) and optionally a job description. Scores are AI estimates, not ATS results." />
        <AiTool task="resume" cta="Analyze resume"
          fields={[
            { key: "resume", label: "Resume text", type: "textarea", required: true, placeholder: "Paste your full resume here…" },
            { key: "jd", label: "Job description (optional)", type: "textarea" },
          ]}
          build={(v) => `RESUME:\n${v.resume}\n\nJOB DESCRIPTION:\n${v.jd || "(none)"}`}
          onResult={(t) => { const s = extractScore(t); if (s !== undefined) update({ resume: s }); }}
        />
      </div>
    );
  },
});
