import { useEffect, useState } from "react";

export type Profile = Record<(typeof PROFILE_FIELDS)[number]["key"], string>;

export const PROFILE_FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "college", label: "College" },
  { key: "degree", label: "Degree" },
  { key: "branch", label: "Branch" },
  { key: "gradYear", label: "Graduation Year" },
  { key: "cgpa", label: "CGPA" },
  { key: "tenth", label: "10th Percentage" },
  { key: "twelfth", label: "12th Percentage" },
  { key: "skills", label: "Skills", long: true },
  { key: "languages", label: "Programming Languages" },
  { key: "frameworks", label: "Frameworks" },
  { key: "databases", label: "Databases" },
  { key: "projects", label: "Projects", long: true },
  { key: "certifications", label: "Certifications", long: true },
  { key: "internships", label: "Internship Experience", long: true },
  { key: "role", label: "Preferred Job Role" },
  { key: "companies", label: "Target Companies" },
  { key: "level", label: "Experience Level" },
] as const satisfies readonly { key: string; label: string; long?: boolean }[];

const KEY = "apc-profile";
const SCORES = "apc-scores";

export type Scores = { resume?: number; job?: number; dsa?: number; interview?: number };

const empty = () => Object.fromEntries(PROFILE_FIELDS.map((f) => [f.key, ""])) as Profile;

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(empty);
  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setProfile({ ...empty(), ...JSON.parse(s) }); } catch {}
  }, []);
  const save = (p: Profile) => { setProfile(p); localStorage.setItem(KEY, JSON.stringify(p)); };
  return { profile, save };
}

export function useScores() {
  const [scores, setScores] = useState<Scores>({});
  useEffect(() => { try { setScores(JSON.parse(localStorage.getItem(SCORES) || "{}")); } catch {} }, []);
  const update = (s: Partial<Scores>) => {
    setScores((prev) => { const n = { ...prev, ...s }; localStorage.setItem(SCORES, JSON.stringify(n)); return n; });
  };
  return { scores, update };
}

export function completion(p: Profile) {
  const filled = PROFILE_FIELDS.filter((f) => p[f.key]?.trim()).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

export function profileText(p: Profile) {
  return PROFILE_FIELDS.filter((f) => p[f.key]?.trim()).map((f) => `${f.label}: ${p[f.key]}`).join("\n");
}

export function readProfileText() {
  if (typeof window === "undefined") return "";
  try { return profileText({ ...empty(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }); } catch { return ""; }
}
