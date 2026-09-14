import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administrator Sign In — Zamzam Capital" },
      { name: "description", content: "Zamzam Capital administrator access." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administrator Sign In — Zamzam Capital" },
      { property: "og:description", content: "Zamzam Capital administrator access." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: "/admin" });
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpError) throw signUpError;
        setMessage("Account created. Check your inbox to confirm the email address, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <span className="font-mono text-sm font-semibold text-primary">Z</span>
          </span>
          <span className="text-sm font-semibold tracking-tight">Zamzam Capital</span>
        </div>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">
          {mode === "signin" ? "Administrator sign in" : "Create administrator account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted area. This portal maintains the screening database.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="label-mono">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-primary/60 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-mono">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-primary/60 focus:outline-none"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-primary">{message}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin"
            ? "First administrator? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
