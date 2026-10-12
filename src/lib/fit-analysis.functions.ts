import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runFitAnalysis } from "./fit-analysis.server";
import { getOpportunity } from "./data";

const s = z.string().max(5000);
const input = z.object({
  opportunityId: z.string().max(100),
  profile: z.object({ name: s, headline: s, about: s, skills: s, projects: s, experience: s }),
});

export const analyzeFit = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }) => {
    const opportunity = getOpportunity(data.opportunityId);
    if (!opportunity) return { ok: false as const, reason: "error" as const };
    return runFitAnalysis(data.profile, opportunity);
  });
