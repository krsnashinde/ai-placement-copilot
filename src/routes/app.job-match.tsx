import { createFileRoute } from "@tanstack/react-router";
import { AiTool, extractScore, PageHeader } from "@/components/AiTool";
import { useScores } from "@/lib/profile";

export const Route = createFileRoute("/app/job-match")({
  head: () => ({ meta: [{ title: "Job Matcher — PrepCop" }, { name: "description", content: "Compare a job description with your profile." }] }),
  component: () => {
    const { update } = useScores();
    return (
      <div>
        <PageHeader tag="Jobs" title="Job Matcher" sub="Paste a job description. We extract requirements, compare with your profile and tell you what to learn." />
        <AiTool task="job" cta="Match me"
          fields={[{ key: "jd", label: "Job description", type: "textarea", required: true }]}
          build={(v) => `JOB DESCRIPTION:\n${v.jd}\n\nAlso give an overall match percentage near the top.`}
          onResult={(t) => { const s = extractScore(t); if (s !== undefined) update({ job: s }); }}
        />
      </div>
    );
  },
});
