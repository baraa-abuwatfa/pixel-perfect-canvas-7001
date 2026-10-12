<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Profile and selected opportunity live in React context (src/lib/profile-context.tsx), no database — the brief forbids persistence.
- Fit analysis runs server-side (src/lib/fit-analysis.server.ts via a server function) and is validated with a zod schema before display; failures map to unavailable/error states, never fallback results — honesty requirement and keeps the key off the client.
- Keep fit-analysis request states in the FitAnalysis presentation component; only a real request adapter may supply success results, so an unconfigured service never simulates analysis.
