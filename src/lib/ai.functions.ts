import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TASKS: Record<string, { role: string; task: string; format: string }> = {
  resume: {
    role: "an experienced technical recruiter and resume coach for software engineering freshers in India",
    task: "Analyze the student's resume (and compare with the job description if given).",
    format:
      "Sections: ## Overall Quality (score /100, labelled as an AI estimate, NOT an ATS score), ## Skills Detected, ## Missing Skills, ## Project Quality, ## Experience & Education Relevance, ## Job Match (match %, ✓ matched skills, • missing skills — only if a JD is given), ## Formatting Suggestions, ## Keyword Suggestions, ## Achievement Rewrites (before → after bullets).",
  },
  job: {
    role: "a hiring manager who explains job requirements simply to beginners",
    task: "Extract requirements from the job description and compare against the student's profile.",
    format:
      "Sections: ## Requirements (required skills, preferred skills, experience, education, technologies, responsibilities), ## Matched Skills, ## Partially Matched, ## Missing Skills, ## Relevant Projects to Highlight, ## Likely Interview Topics, ## DSA Topics, ## What should I learn for this job? (prioritized numbered roadmap with rough time estimates).",
  },
  skillgap: {
    role: "a placement mentor who maps skills against industry expectations",
    task: "Perform a skill-gap analysis for the target role.",
    format:
      "Sections: ## Current Strengths, ## Gap Table (markdown table: Skill | Current level | Required level | Priority), ## Top 5 Gaps and Why They Matter, ## 4-Week Plan to Close Gaps, ## Free Resources.",
  },
  dsa: {
    role: "a patient DSA coach who teaches beginners",
    task: "Teach the requested DSA topic or help with the given problem.",
    format:
      "Sections: ## Intuition (simple language), ## Pattern Recognition (how to spot it), ## Worked Example with code in the student's preferred language, ## Complexity, ## Common Mistakes, ## 5 Practice Problems (easy→hard, with LeetCode-style names).",
  },
  aptitude: {
    role: "an aptitude trainer for campus placement tests (TCS, Infosys, Wipro, Accenture style)",
    task: "Generate a practice set for the requested topic and difficulty.",
    format:
      "Give 5 numbered MCQs with 4 options each. Then a ## Answers & Explanations section with short step-by-step solutions and a shortcut trick for each.",
  },
  interview: {
    role: "a senior software engineer conducting a technical interview",
    task: "Conduct a mock interview. If no answers are provided, generate questions. If the student provides an answer, evaluate it.",
    format:
      "When generating: ## Interview Questions (5 numbered questions mixing technical, CS fundamentals and behavioral for the chosen type). When evaluating: ## Score (/10), ## What was good, ## What was missing, ## Model Answer, ## Follow-up Question.",
  },
  project: {
    role: "an interviewer who deep-dives into candidate projects",
    task: "Prepare the student to explain and defend their project in interviews.",
    format:
      "Sections: ## 60-second Pitch, ## Architecture Explanation, ## 10 Likely Interview Questions with strong sample answers, ## Weak Spots Interviewers Will Probe, ## How to Improve the Project.",
  },
  plan: {
    role: "a structured study-plan designer for placement preparation",
    task: "Create a personalized day-by-day study plan.",
    format:
      "Sections: ## Goal Summary, ## Weekly Breakdown (each week: DSA, Core CS, Development, Aptitude, Mock Interviews, with daily hour split), ## Milestones, ## Weekly Review Checklist.",
  },
  mentor: {
    role: "a friendly AI career mentor for CSE/IT students preparing for software placements",
    task: "Answer the student's question with practical, honest, beginner-friendly guidance.",
    format: "Concise markdown. Use short headings or bullets when helpful. End with one concrete next step.",
  },
  recommend: {
    role: "a placement readiness advisor",
    task: "Give a short personalized recommendation of what to focus on next.",
    format: "2–3 sentences, plain text, no headings. Name specific topics.",
  },
};

const Input = z.object({
  task: z.string().refine((t) => t in TASKS, "Unknown task"),
  input: z.string().min(1).max(30000),
  profile: z.string().max(8000).optional(),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) })).max(30).optional(),
});

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "AI is not configured." };
    const t = TASKS[data.task];
    const system = `# ROLE\nYou are ${t.role}.\n# TASK\n${t.task}\n# CONTEXT\nStudent profile:\n${data.profile || "(not provided)"}\n# CONSTRAINTS\nUse simple, practical language for beginners. Never invent facts about the student. Scores are AI-generated preparation indicators, not validated metrics.\n# OUTPUT FORMAT\n${t.format}`;
    const input = [
      ...(data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.input },
    ];
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: system,
        input,
        stream: true,
        store: false,
        reasoning: { effort: "low" },
      }),
    });
    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => "");
      let msg = "The AI request failed. Please try again later.";
      if (res.status === 429) msg = "Too many requests right now. Please wait a moment and try again.";
      if (res.status === 402) msg = "AI credits have run out for this workspace.";
      try { const j = JSON.parse(body); if (j?.error?.message || j?.message) msg = j.error?.message ?? j.message; } catch {}
      return { ok: false as const, error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "", failure = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const p = line.slice(5).trim();
        if (!p || p === "[DONE]") continue;
        try {
          const ev = JSON.parse(p);
          if (ev.type === "response.output_text.delta") text += ev.delta;
          if (ev.type === "error" || ev.type === "response.failed") failure = ev.error?.message ?? ev.response?.error?.message ?? "AI error";
        } catch {}
      }
    }
    if (!text) return { ok: false as const, error: failure || "The AI returned no answer." };
    return { ok: true as const, text };
  });
