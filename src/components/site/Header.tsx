import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLockup } from "@/components/site/BrandLockup";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/check", label: "Check Stock" },
  { to: "/scanner", label: "Scanner" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/methodology", label: "Methodology" },
  { to: "/about", label: "About" },
  { to: "/connect", label: "Connect" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <BrandLockup size="sm" caption={false} />
          <span className="leading-none">
            <span className="block text-sm font-semibold tracking-tight">Zamzam Capital</span>
            <span className="label-mono mt-1 block">Shariah Screener</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/check"
            className="hidden rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Check a Stock
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-surface/90 px-5 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-panel hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/check"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
          >
            Check a Stock
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
