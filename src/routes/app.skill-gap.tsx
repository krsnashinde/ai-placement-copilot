import { createFileRoute } from "@tanstack/react-router";
import { AiTool, PageHeader } from "@/components/AiTool";

export const Route = createFileRoute("/app/skill-gap")({
  head: () => ({ meta: [{ title: "Skill Gap Analyzer — PrepCop" }, { name: "description", content: "Find the skills you're missing for your target role." }] }),
  component: () => (
    <div>
      <PageHeader tag="Skills" title="Skill Gap Analyzer" sub="See where you stand against your target role and what to fix first." />
      <AiTool task="skillgap" cta="Find my gaps"
        fields={[
          { key: "role", label: "Target role", required: true, placeholder: "e.g. Java Backend Developer" },
          { key: "company", label: "Company type", type: "select", options: ["Service-based (TCS, Infosys)", "Product-based (Amazon, Flipkart)", "Startup"] },
        ]}
        build={(v) => `Target role: ${v.role}\nCompany type: ${v.company}`}
      />
    </div>
  ),
});
