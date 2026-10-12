import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge Lite — Understand Your Fit" },
      { name: "description", content: "See how your skills, projects, and experience relate to an opportunity and what to improve next." },
      { property: "og:title", content: "SkillBridge Lite — Understand Your Fit" },
      { property: "og:description", content: "See how your skills relate to an opportunity and what to improve next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  { n: "01", t: "Understand your fit", d: "Compare your documented skills with what an opportunity asks for." },
  { n: "02", t: "Discover what to improve", d: "Spot the gaps between your profile and the role." },
  { n: "03", t: "Take your next step", d: "Get focused, practical actions to move forward." },
];

function Home() {
  return (
    <div className="space-y-16">
      <section className="pt-6 text-center sm:pt-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">SkillBridge Lite</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Understand Your Fit. Discover Your Next Step.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          For students, recent graduates, and early-career professionals: see how your skills,
          projects, and experience relate to a professional opportunity.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/opportunities">Explore Opportunities</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/profile">Complete My Profile</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <span className="font-display text-sm font-semibold text-primary">{s.n}</span>
            <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
