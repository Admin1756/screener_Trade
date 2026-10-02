import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";
import zamzamDarkLogo from "@/assets/zamzam-logo-dark.png.asset.json";
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <a
          href={OFFICIAL_SITE}
          className="flex items-center gap-3"
          aria-label="Zamzam Capital — official website"
        >
          <span className="flex h-11 shrink-0 items-center overflow-hidden rounded-sm border border-border px-2">
            <img src={zamzamDarkLogo.url} alt="" className="h-full w-auto object-contain light:hidden" />
            <img src={zamzamLogo.url} alt="" className="hidden h-full w-auto object-contain light:block" />
          </span>
          <span className="leading-none">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-surface/90 px-5 py-3 md:hidden">
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
