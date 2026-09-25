import { createFileRoute } from "@tanstack/react-router";
import { AiTool, PageHeader } from "@/components/AiTool";

export const Route = createFileRoute("/app/dsa")({
  head: () => ({ meta: [{ title: "DSA Coach — PrepCop" }, { name: "description", content: "Learn DSA patterns with an AI coach." }] }),
  component: () => (
    <div>
      <PageHeader tag="DSA" title="DSA Coach" sub="Pick a topic or paste a problem. Get intuition, code, complexity and practice problems." />
      <AiTool task="dsa" cta="Teach me"
        fields={[
          { key: "topic", label: "Topic", type: "select", options: ["Arrays", "Strings", "HashMap", "Two Pointers", "Sliding Window", "Binary Search", "Recursion", "Linked List", "Stack & Queue", "Trees", "Graphs", "Dynamic Programming", "Greedy", "Heap"] },
          { key: "lang", label: "Language", type: "select", options: ["Java", "C++", "Python", "JavaScript"] },
          { key: "problem", label: "Specific problem or doubt (optional)", type: "textarea" },
        ]}
        build={(v) => `Topic: ${v.topic}\nLanguage: ${v.lang}\nProblem/doubt: ${v.problem || "(none — teach the topic)"}`}
      />
    </div>
  ),
});
