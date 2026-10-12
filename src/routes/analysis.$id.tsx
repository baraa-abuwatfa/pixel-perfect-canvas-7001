import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getOpportunity, type Opportunity, type Profile } from "@/lib/data";
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

type Result = { relevant: string[]; gaps: string[]; steps: string[] };
type State =
  | { kind: "loading" }
  | { kind: "insufficient" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string }
  | { kind: "success"; result: Result };

/** No AI service is configured in this prototype. Returns false until one is. */
const AI_SERVICE_CONFIGURED = false;

async function runAnalysis(profile: Profile, _o: Opportunity): Promise<State> {
  if (!profile.skills.trim() && !profile.projects.trim() && !profile.experience.trim()) {
    return { kind: "insufficient" };
  }
  if (!AI_SERVICE_CONFIGURED) return { kind: "unavailable" };
  // A real AI call would go here once a service is configured.
  return { kind: "error", message: "AI service not implemented." };
}

const DEMO: Result = {
  relevant: ["Python — listed in the sample profile and required by the role"],
  gaps: ["APIs — no documented experience connecting to APIs", "Automation tools — no related project listed"],
  steps: ["Build a small project that calls a public API with Python", "Add the project to your profile with a short description"],
};

function Analysis() {
  const { opportunity: o } = Route.useLoaderData();
  const { profile, isSample } = useProfile();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [showDemo, setShowDemo] = useState(false);

  const start = () => {
    setState({ kind: "loading" });
    runAnalysis(profile, o)
      .then(setState)
      .catch((e) => setState({ kind: "error", message: e instanceof Error ? e.message : "Unknown error" }));
  };
  useEffect(start, [o.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
        {state.kind === "loading" && (
          <Notice title="Analyzing…" body="Checking your profile against this opportunity." />
        )}
        {state.kind === "insufficient" && (
          <Notice tone="warning" title="Not enough profile information"
            body="Add skills, projects, or experience to your profile so an analysis can be performed.">
            <Button asChild><Link to="/profile">Complete My Profile</Link></Button>
          </Notice>
        )}
        {state.kind === "unavailable" && (
          <Notice tone="warning" title="Real AI analysis is currently unavailable"
            body="No AI service is configured in this prototype, so no analysis of your profile has been performed.">
            <Button variant="outline" onClick={() => setShowDemo((v) => !v)}>
              {showDemo ? "Hide demonstration example" : "Show demonstration example"}
            </Button>
          </Notice>
        )}
        {state.kind === "error" && (
          <Notice tone="error" title="Something went wrong" body={state.message}>
            <Button onClick={start}>Try again</Button>
          </Notice>
        )}
        {state.kind === "success" && <ResultView result={state.result} />}
        {state.kind === "unavailable" && showDemo && (
          <div className="mt-6">
            <div className="mb-3 inline-block rounded-md border border-warning/50 bg-warning/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Demonstration example — not a real analysis of your profile
            </div>
            <ResultView result={DEMO} />
          </div>
        )}
      </div>
    </div>
  );
}

function Notice({ title, body, tone, children }: { title: string; body: string; tone?: "warning" | "error"; children?: React.ReactNode }) {
  const cls = tone === "warning" ? "border-warning/40 bg-warning/10" : tone === "error" ? "border-destructive/40 bg-destructive/10" : "border-border bg-card";
  return (
    <div className={`rounded-xl border p-6 shadow-card ${cls}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function ResultView({ result }: { result: Result }) {
  const sections = [
    { t: "Relevant Skills", items: result.relevant, dot: "bg-success" },
    { t: "Potential Gaps", items: result.gaps, dot: "bg-warning" },
    { t: "Recommended Next Steps", items: result.steps, dot: "bg-primary" },
  ];
  return (
    <div className="grid gap-4">
      {sections.map((s) => (
        <section key={s.t} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />{s.t}
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {s.items.map((i) => <li key={i}>• {i}</li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}
