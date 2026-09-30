import { createFileRoute, redirect } from "@tanstack/react-router";

// Preserve old links to the retired Product page.
export const Route = createFileRoute("/how-it-works")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});