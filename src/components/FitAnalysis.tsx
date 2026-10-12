import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, CircleDashed, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Opportunity, Profile } from "@/lib/data";

export type FitResult = {
  relevantSkills: { item: string; evidence: string; relevance: string }[];
  potentialGaps: { requirement: string; reason: string }[];
  recommendedNextSteps: { action: string; reason: string }[];
};
export type FitResponse = { ok: true; result: FitResult } | { ok: false; reason: "unavailable" | "invalid" | "error" };
type AnalysisState =
  | { kind: "idle" }
  | { kind: "analyzing" }
  | { kind: "insufficient" }
  | { kind: "unavailable" }
  | { kind: "error"; invalid?: boolean }
  | { kind: "success"; result: FitResult };

type Props = {
  profile: Profile;
  opportunity: Opportunity;
  /** Supply only a real analysis request; absence means no AI service is configured. */
  analyze?: (profile: Profile, opportunity: Opportunity) => Promise<FitResponse>;
};

const filled = (v: unknown) => typeof v === "string" && v.trim().length > 0;
function validList(items: unknown, keys: string[]) {
  return Array.isArray(items) && items.every((i) => i && typeof i === "object" && keys.every((k) => filled((i as Record<string, unknown>)[k])));
}
function validResult(value: FitResult | undefined): value is FitResult {
  return value != null && validList(value.relevantSkills, ["item", "evidence", "relevance"]) &&
    validList(value.potentialGaps, ["requirement", "reason"]) && validList(value.recommendedNextSteps, ["action", "reason"]);
}

export function FitAnalysis({ profile, opportunity, analyze }: Props) {
  const [state, setState] = useState<AnalysisState>({ kind: "idle" });
  const requestId = useRef(0);
  const pending = useRef(false);

  useEffect(() => {
    requestId.current += 1;
    pending.current = false;
    setState({ kind: "idle" });
    return () => { requestId.current += 1; };
  }, [profile, opportunity, analyze]);

  async function start() {
    if (pending.current) return;
    if (![profile.skills, profile.projects, profile.experience].some((value) => value.trim())) {
      setState({ kind: "insufficient" });
      return;
    }
    if (!analyze) {
      setState({ kind: "unavailable" });
      return;
    }
    const id = ++requestId.current;
    pending.current = true;
    setState({ kind: "analyzing" });
    try {
      const res = await analyze(profile, opportunity);
      if (id !== requestId.current) return;
      if (res?.ok && validResult(res.result)) setState({ kind: "success", result: res.result });
      else if (res && !res.ok && res.reason === "unavailable") setState({ kind: "unavailable" });
      else setState({ kind: "error", invalid: !res || res.ok || res.reason === "invalid" });
    } catch {
      if (id === requestId.current) setState({ kind: "error" });
    } finally {
      if (id === requestId.current) pending.current = false;
    }
  }

  const notices = {
    idle: { title: "Ready to check your fit", body: "No analysis has been performed yet." },
    analyzing: { title: "Analyzing your fit…", body: "Reviewing your skills, projects, and experience against this opportunity." },
    insufficient: { title: "Not enough profile information", body: "Add skills, a project, or experience to your profile before requesting an analysis." },
    unavailable: { title: "Real AI analysis is unavailable", body: analyze ? "The AI service is temporarily unavailable. No analysis of your profile has been performed. Please try again later." : "No AI service is configured. No AI analysis of your profile has been performed." },
    error: { title: "We couldn’t complete your analysis", body: state.kind === "error" && state.invalid ? "The AI returned a response that couldn’t be verified, so it isn’t shown. Please try again." : "The analysis request failed. Please try again. No new results are available." },
    success: { title: "Analysis complete", body: "Your profile has been reviewed against this opportunity." },
  };
  const notice = notices[state.kind];
  const Icon = state.kind === "analyzing" ? LoaderCircle : state.kind === "success" ? CheckCircle2 :
    ["error", "insufficient", "unavailable"].includes(state.kind) ? AlertCircle : CircleDashed;
  const tone = state.kind === "error" ? "border-destructive/40 bg-destructive/10" :
    state.kind === "unavailable" || state.kind === "insufficient" ? "border-warning/40 bg-warning/10" : "border-border bg-muted/50";
  const r = state.kind === "success" ? state.result : null;
  const sections = [
    { title: "Relevant Skills", items: r ? r.relevantSkills.map((x) => ({ head: x.item, lines: [["Evidence", x.evidence], ["Relevance", x.relevance]] })) : null, dot: "bg-success", empty: "No relevant skills were identified in this analysis." },
    { title: "Potential Gaps", items: r ? r.potentialGaps.map((x) => ({ head: x.requirement, lines: [["Why", x.reason]] })) : null, dot: "bg-warning", empty: "No potential gaps were identified in this analysis." },
    { title: "Recommended Next Steps", items: r ? r.recommendedNextSteps.map((x) => ({ head: x.action, lines: [["Why", x.reason]] })) : null, dot: "bg-primary", empty: "No next steps were recommended in this analysis." },
  ];

  return (
    <div aria-busy={state.kind === "analyzing"}>
      <div className={`rounded-lg border p-5 ${tone}`} role={state.kind === "error" ? "alert" : "status"} aria-live="polite">
        <div className="flex items-start gap-3">
          <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${state.kind === "analyzing" ? "animate-spin motion-reduce:animate-none" : ""}`} />
          <div>
            <h2 className="text-lg font-semibold">{notice.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{notice.body}</p>
            {!analyze && (state.kind !== "unavailable" || analyze) && (
              <p className="mt-2 text-sm text-muted-foreground">Real AI analysis is unavailable because no AI service is configured.</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {state.kind === "insufficient" ? (
            <Button asChild><Link to="/profile">Complete My Profile</Link></Button>
          ) : (state.kind !== "unavailable" || analyze) && (
            <Button onClick={start} disabled={state.kind === "analyzing"}>
              {state.kind === "analyzing" ? <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" /> : <Sparkles aria-hidden="true" />}
              {state.kind === "analyzing" ? "Analyzing…" : state.kind === "error" || state.kind === "unavailable" ? "Try again" : state.kind === "success" ? "Analyze Again" : "Analyze My Fit"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 divide-y divide-border">
        {sections.map((section) => (
          <section key={section.title} className="py-5 first:pt-0" aria-label={section.title}>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${section.dot}`} />
              {section.title}
            </h3>
            {section.items ? section.items.length ? (
              <ul className="mt-3 space-y-3 text-sm">
                {section.items.map((item, index) => (
                  <li key={index} className="break-words rounded-md border border-border p-3">
                    <p className="font-medium">{item.head}</p>
                    {item.lines.map(([label, text]) => (
                      <p key={label} className="mt-1 text-muted-foreground"><span className="font-medium text-foreground/80">{label}:</span> {text}</p>
                    ))}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-muted-foreground">{section.empty}</p> : (
              <p className="mt-3 text-sm text-muted-foreground">
                {state.kind === "analyzing" ? "Awaiting analysis results…" : "No analysis results yet."}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}