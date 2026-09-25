import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/AiTool";
import { completion, PROFILE_FIELDS, useProfile, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Student Profile — PrepCop" }, { name: "description", content: "Edit your placement profile." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, save } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => setDraft(profile), [profile]);
  const pc = completion(draft);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.email && !/^\S+@\S+\.\S+$/.test(draft.email)) return setErr("Enter a valid email.");
    if (draft.cgpa && (isNaN(+draft.cgpa) || +draft.cgpa > 10 || +draft.cgpa < 0)) return setErr("CGPA must be between 0 and 10.");
    setErr(""); save(draft); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader tag="Student profile" title="Build your profile" sub="Every AI tool uses this as context. The more complete, the better the advice." />
      <div className="mb-6 border-2 border-ink bg-ink p-4 text-paper">
        <div className="flex justify-between font-mono text-xs uppercase"><span>Profile completion</span><span className="text-saffron">{pc}%</span></div>
        <div className="mt-2 h-4 border-2 border-saffron"><div className="h-full bg-saffron transition-all" style={{ width: `${pc}%` }} /></div>
      </div>
      <form onSubmit={submit} className="grid gap-4 border-2 border-ink bg-smoke p-5 md:grid-cols-2">
        {PROFILE_FIELDS.map((f) => (
          <label key={f.key} className={`flex flex-col gap-1.5 ${"long" in f && f.long ? "md:col-span-2" : ""}`}>
            <span className="label-mono">{f.label}</span>
            {"long" in f && f.long ? (
              <textarea rows={3} className="field-brut" value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
            ) : (
              <input className="field-brut" value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
            )}
          </label>
        ))}
        <div className="flex items-center gap-4 md:col-span-2">
          <button className="btn-brut px-6 py-3 text-sm">Save profile</button>
          {saved && <span className="font-mono text-xs uppercase text-saffron-deep">Saved ✓</span>}
          {err && <span className="text-sm text-destructive">{err}</span>}
        </div>
      </form>
    </div>
  );
}
