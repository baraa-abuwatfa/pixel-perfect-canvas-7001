import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/lib/profile-context";
import { EMPTY_PROFILE, type Profile } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — SkillBridge Lite" },
      { name: "description", content: "Enter your skills, projects, and experience to compare against opportunities." },
      { property: "og:title", content: "My Profile — SkillBridge Lite" },
      { property: "og:description", content: "Enter your skills, projects, and experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const fields: { key: keyof Profile; label: string; multi?: boolean; hint?: string }[] = [
  { key: "name", label: "Name" },
  { key: "headline", label: "Headline", hint: "e.g. Computer Engineering student" },
  { key: "about", label: "About", multi: true },
  { key: "skills", label: "Skills", multi: true, hint: "Separate skills with commas" },
  { key: "projects", label: "Projects", multi: true, hint: "One project per line" },
  { key: "experience", label: "Experience", multi: true },
];

function ProfilePage() {
  const { profile, isSample, saveProfile } = useProfile();
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold">My Profile</h1>
      <p className="mt-2 text-muted-foreground">Your profile is used when analyzing fit with an opportunity.</p>

      {isSample && (
        <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <strong>Sample profile.</strong> The details below are fictional placeholders, not your
          information. Edit and save to use your own profile.
        </div>
      )}

      <form
        className="mt-6 space-y-5 rounded-xl border border-border bg-card p-6 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          saveProfile(form);
          setSaved(true);
        }}
      >
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.multi ? (
              <Textarea id={f.key} rows={3} value={form[f.key]} placeholder={f.hint}
                onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
            ) : (
              <Input id={f.key} value={form[f.key]} placeholder={f.hint}
                onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
            )}
            {f.hint && f.multi && <p className="text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit">Save profile</Button>
          <Button type="button" variant="ghost" onClick={() => { setForm(EMPTY_PROFILE); setSaved(false); }}>
            Clear form
          </Button>
          {saved && <span className="text-sm font-medium text-success">Profile saved.</span>}
        </div>
      </form>
    </div>
  );
}
