import { createFileRoute } from "@tanstack/react-router";
import { AiTool, PageHeader } from "@/components/AiTool";

export const Route = createFileRoute("/app/study-plan")({
  head: () => ({ meta: [{ title: "Personalized Study Plan — PrepCop" }, { name: "description", content: "An AI study plan built around your goals." }] }),
  component: () => (
    <div>
      <PageHeader tag="Plan" title="Study Plan" sub="Tell us your timeline and hours. Get a week-by-week plan." />
      <AiTool task="plan" cta="Build my plan"
        fields={[
          { key: "weeks", label: "Weeks until placements", type: "select", options: ["4", "8", "12", "16", "24"] },
          { key: "hours", label: "Hours per day", type: "select", options: ["1", "2", "3", "4", "6"] },
          { key: "focus", label: "Anything specific to focus on?", type: "textarea" },
        ]}
        build={(v) => `Weeks: ${v.weeks}\nHours/day: ${v.hours}\nFocus: ${v.focus || "balanced"}`}
      />
    </div>
  ),
});
