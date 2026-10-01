import { Link } from "@tanstack/react-router";
import { useRef } from "react";

const items = [
  { hash: "screener", label: "Screener" },
  { hash: "methodology", label: "Methodology" },
  { hash: "about", label: "About" },
  { hash: "connect", label: "Connect" },
] as const;

export function DesktopNav() {
  const navRef = useRef<HTMLElement>(null);
  const gliderRef = useRef<HTMLSpanElement>(null);

  function moveGlider(link: HTMLElement) {
    const nav = navRef.current;
    const glider = gliderRef.current;
    if (!nav || !glider || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    glider.style.width = `${linkRect.width}px`;
    glider.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    glider.style.opacity = "1";
  }

  return (
    <nav ref={navRef} aria-label="Main navigation" className="desktop-nav relative hidden items-center p-1 md:flex" onPointerLeave={() => {
      if (gliderRef.current) gliderRef.current.style.opacity = "0";
      navRef.current?.querySelectorAll<HTMLElement>(".nav-magnetic").forEach((item) => { item.style.transform = ""; });
    }}>
      <span ref={gliderRef} aria-hidden="true" className="nav-glider pointer-events-none absolute inset-y-1 left-0 rounded-sm bg-primary/15 opacity-0 ring-1 ring-primary/30" />
      {items.map((item) => (
        <Link
          key={item.hash}
          to="/"
          hash={item.hash}
          className="nav-magnetic relative z-10 px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          onPointerEnter={(event) => moveGlider(event.currentTarget)}
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
            const y = (event.clientY - rect.top - rect.height / 2) * 0.13;
            event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
          }}
          onPointerLeave={(event) => { event.currentTarget.style.transform = ""; }}
          onFocus={(event) => moveGlider(event.currentTarget)}
          onBlur={() => { if (gliderRef.current) gliderRef.current.style.opacity = "0"; }}
        >{item.label}</Link>
      ))}
    </nav>
  );
}