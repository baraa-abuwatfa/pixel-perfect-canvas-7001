import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getOpportunity } from "@/lib/data";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const opportunity = getOpportunity(params.id);
    if (!opportunity) throw notFound();
    return { opportunity };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.opportunity.title} at ${loaderData.opportunity.company} — SkillBridge Lite` : "Opportunity not found — SkillBridge Lite";
    const d = loaderData?.opportunity.description ?? "This opportunity could not be found.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Opportunity not found</h1>
      <Button asChild className="mt-4"><Link to="/opportunities">Back to opportunities</Link></Button>
    </div>
  ),
  component: Details,
});

function Details() {
  const { opportunity: o } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/opportunities" className="text-sm font-medium text-muted-foreground hover:text-foreground">← All opportunities</Link>
      <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="text-sm font-medium text-primary">{o.company}</p>
        <h1 className="mt-1 text-3xl font-semibold">{o.title}</h1>
        <p className="mt-4 text-muted-foreground">{o.description}</p>

        <h2 className="mt-8 text-lg font-semibold">Required skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {o.skills.map((s) => (
            <span key={s} className="rounded-md bg-accent px-2.5 py-1 text-sm font-medium text-accent-foreground">{s}</span>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-semibold">Responsibilities</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {o.responsibilities.map((r) => <li key={r}>{r}</li>)}
        </ul>

        <Button asChild size="lg" className="mt-8">
          <Link to="/analysis/$id" params={{ id: o.id }}>Analyze My Fit</Link>
        </Button>
      </div>
    </div>
  );
}
