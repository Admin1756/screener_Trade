import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep old bookmarks working while the separate stock-search page is retired.
export const Route = createFileRoute("/check")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});