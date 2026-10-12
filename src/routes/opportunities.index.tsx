import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { OPPORTUNITIES } from "@/lib/data";

export const Route = createFileRoute("/opportunities/")({
  head: () => ({
    meta: [
      { title: "Opportunities — SkillBridge Lite" },
      { name: "description", content: "Browse sample opportunities and check how your profile fits." },
      { property: "og:title", content: "Opportunities — SkillBridge Lite" },
      { property: "og:description", content: "Browse sample opportunities and check your fit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Opportunities,
});

function Opportunities() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Opportunities</h1>
      <p className="mt-2 text-muted-foreground">Three sample opportunities to compare with your profile.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {OPPORTUNITIES.map((o) => (
          <article key={o.id} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card">
            <p className="text-sm font-medium text-primary">{o.company}</p>
            <h2 className="mt-1 text-lg font-semibold">{o.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{o.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {o.skills.map((s) => (
                <span key={s} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{s}</span>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/opportunities/$id" params={{ id: o.id }}>View details</Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
