import { createFileRoute } from "@tanstack/react-router";
import { AiTool, PageHeader } from "@/components/AiTool";

export const Route = createFileRoute("/app/project")({
  head: () => ({ meta: [{ title: "Project Interview Coach — PrepCop" }, { name: "description", content: "Prepare to explain your projects in interviews." }] }),
  component: () => (
    <div>
      <PageHeader tag="Projects" title="Project Interview Coach" sub="Describe a project. Get a pitch, likely questions with answers, and weak spots to fix." />
      <AiTool task="project" cta="Prep my project"
        fields={[
          { key: "name", label: "Project name", required: true },
          { key: "stack", label: "Tech stack", placeholder: "React, Spring Boot, MySQL" },
          { key: "desc", label: "What it does & your role", type: "textarea", required: true },
        ]}
        build={(v) => `Project: ${v.name}\nStack: ${v.stack}\nDescription: ${v.desc}`}
      />
    </div>
  ),
});
