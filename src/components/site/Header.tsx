import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { zamzamLogo } from "@/lib/media";
import { zamzamDarkLogo } from "@/lib/media";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

const OFFICIAL_SITE = "https://zamzam-capital.com/";

const NAV = [
  { hash: "screener", label: "Screener" },
  { hash: "methodology", label: "Methodology" },
  { hash: "about", label: "About" },
  { hash: "connect", label: "Connect" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-6">
        <a
          href={OFFICIAL_SITE}
          className="flex min-w-0 items-center gap-3"
          aria-label="Zamzam Capital — official website"
        >
          <span className="flex h-11 shrink-0 items-center overflow-hidden rounded-sm border border-border px-2">
            <img src={zamzamDarkLogo.url} alt="" className="h-full w-auto object-contain light:hidden" />
            <img src={zamzamLogo.url} alt="" className="hidden h-full w-auto object-contain light:block" />
          </span>
          <span className="hidden min-w-0 leading-none sm:block">
            <span className="block text-sm font-semibold tracking-tight">Zamzam Capital</span>
             <span className="label-mono mt-1 block">STOCK ANALYSIS SCREENER</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
            className="size-11 text-muted-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-navigation" className="border-t border-border bg-surface/90 px-5 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-panel hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
