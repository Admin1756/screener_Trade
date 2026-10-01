import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CursorAccent } from "./CursorAccent";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CursorAccent />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <p className="label-mono">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {intro ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
      </div>
    </header>
  );
}
