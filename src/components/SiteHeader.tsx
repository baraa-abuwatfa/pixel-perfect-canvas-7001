import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "My Profile" },
  { to: "/opportunities", label: "Opportunities" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">
            SB
          </span>
          <span className="hidden sm:inline">SkillBridge Lite</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
