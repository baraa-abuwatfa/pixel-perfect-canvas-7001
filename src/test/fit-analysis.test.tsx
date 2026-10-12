import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FitAnalysis, type FitResult, type FitResponse } from "@/components/FitAnalysis";
import { EMPTY_PROFILE, OPPORTUNITIES, SAMPLE_PROFILE } from "@/lib/data";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));
afterEach(cleanup);
const opportunity = OPPORTUNITIES[0];
if (!opportunity) throw new Error("Test requires an opportunity");
const result: FitResponse = { ok: true, result: {
  relevantSkills: [{ item: "Python experience", evidence: "Built scripts", relevance: "Role uses Python" }],
  potentialGaps: [{ requirement: "API experience", reason: "No evidence in profile" }],
  recommendedNextSteps: [{ action: "Build an API project", reason: "Shows API skills" }],
} satisfies FitResult };

describe("Fit analysis interface", () => {
  it("starts idle with all three empty result sections and honest availability", () => {
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} />);
    expect(screen.getByText("Ready to check your fit")).toBeInTheDocument();
    for (const title of ["Relevant Skills", "Potential Gaps", "Recommended Next Steps"]) {
      expect(screen.getByRole("region", { name: title })).toBeInTheDocument();
    }
    expect(screen.getByText(/Real AI analysis is unavailable/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(screen.getByText("Real AI analysis is unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Python experience")).not.toBeInTheDocument();
  });

  it("requires profile information without making a request", () => {
    const analyze = vi.fn();
    render(<FitAnalysis profile={EMPTY_PROFILE} opportunity={opportunity} analyze={analyze} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(screen.getByText("Not enough profile information")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Complete My Profile" })).toHaveAttribute("href", "/profile");
    expect(analyze).not.toHaveBeenCalled();
  });

  it("shows loading only during a request, disables duplicates, then renders its result", async () => {
    let resolveRequest: ((result: FitResponse) => void) | undefined;
    const analyze = vi.fn(() => new Promise<FitResponse>((resolve) => { resolveRequest = resolve; }));
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} analyze={analyze} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(screen.getByRole("button", { name: "Analyzing…" })).toBeDisabled();
    expect(screen.getByText("Analyzing your fit…")).toBeInTheDocument();
    await act(async () => { resolveRequest?.(result); });
    expect(screen.getByText("Analysis complete")).toBeInTheDocument();
    for (const item of ["Python experience", "API experience", "Build an API project"]) expect(screen.getByText(item)).toBeInTheDocument();
    expect(analyze).toHaveBeenCalledTimes(1);
  });

  it("shows a safe error and allows an explicit retry", async () => {
    const analyze = vi.fn().mockRejectedValueOnce(new Error("private service details")).mockResolvedValueOnce(result);
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} analyze={analyze} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn’t complete your analysis");
    expect(screen.queryByText("private service details")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Analysis complete")).toBeInTheDocument();
  });

  it("rejects malformed results instead of claiming success", async () => {
    const analyze = vi.fn().mockResolvedValue({ ok: true, result: { relevantSkills: [] } });
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} analyze={analyze} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Analysis complete")).not.toBeInTheDocument();
  });

  it("discards stale results when the profile changes", async () => {
    let resolveRequest: ((result: FitResponse) => void) | undefined;
    const analyze = () => new Promise<FitResponse>((resolve) => { resolveRequest = resolve; });
    const { rerender } = render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} analyze={analyze} />);
    fireEvent.click(screen.getByRole("button", { name: "Analyze My Fit" }));
    rerender(<FitAnalysis profile={EMPTY_PROFILE} opportunity={opportunity} analyze={analyze} />);
    await act(async () => { resolveRequest?.(result); });
    expect(screen.getByText("Ready to check your fit")).toBeInTheDocument();
    expect(screen.queryByText("Analysis complete")).not.toBeInTheDocument();
  });
});