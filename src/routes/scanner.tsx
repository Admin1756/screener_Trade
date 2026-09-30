import { createFileRoute, redirect } from "@tanstack/react-router";

// Existing scanner links lead to the screener now embedded on the homepage.
export const Route = createFileRoute("/scanner")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});