import { createFileRoute } from "@tanstack/react-router";
import { AiTool, PageHeader } from "@/components/AiTool";

export const Route = createFileRoute("/app/aptitude")({
  head: () => ({ meta: [{ title: "Aptitude Practice — PrepCop" }, { name: "description", content: "Placement aptitude practice sets with explanations." }] }),
  component: () => (
    <div>
      <PageHeader tag="Aptitude" title="Aptitude Practice" sub="Generate a 5-question set with step-by-step answers and shortcut tricks." />
      <AiTool task="aptitude" cta="Generate set"
        fields={[
          { key: "topic", label: "Topic", type: "select", options: ["Percentages", "Profit & Loss", "Time & Work", "Time Speed Distance", "Ratio & Proportion", "Probability", "Permutation & Combination", "Number Series", "Blood Relations", "Coding-Decoding", "Syllogism", "Reading Comprehension"] },
          { key: "level", label: "Difficulty", type: "select", options: ["Easy", "Medium", "Hard"] },
        ]}
        build={(v) => `Topic: ${v.topic}\nDifficulty: ${v.level}`}
      />
    </div>
  ),
});
