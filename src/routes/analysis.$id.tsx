import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getOpportunity } from "@/lib/data";
import { FitAnalysis } from "@/components/FitAnalysis";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/analysis/$id")({
  loader: ({ params }) => {
    const opportunity = getOpportunity(params.id);
    if (!opportunity) throw notFound();
    return { opportunity };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Fit Analysis: ${loaderData.opportunity.title} — SkillBridge Lite` : "Fit Analysis — SkillBridge Lite";
    return {
      meta: [
        { title: t },
        { name: "description", content: "Relevant skills, potential gaps, and recommended next steps for an opportunity." },
        { property: "og:title", content: t },
        { property: "og:description", content: "Relevant skills, potential gaps, and next steps." },
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
  component: Analysis,
});

function Analysis() {
  const { opportunity: o } = Route.useLoaderData();
  const { profile, isSample } = useProfile();
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/opportunities/$id" params={{ id: o.id }} className="text-sm font-medium text-muted-foreground hover:text-foreground">
        ← Back to {o.title}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">AI Fit Analysis</h1>
      <p className="mt-2 text-muted-foreground">
        {o.title} at {o.company} · using {isSample ? "the fictional sample profile" : `${profile.name || "your"} profile`}
      </p>

      <div className="mt-8">
        <FitAnalysis profile={profile} opportunity={o} />
      </div>
    </div>
  );
}

