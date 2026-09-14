import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, SiteShell } from "@/components/site/SiteShell";
import { getActiveDataset, getSetting, formatDate } from "@/lib/stocks";

type Methodology = {
  intro?: string;
  business_activity?: string;
  financial?: string;
  thresholds?: string;
  data_updates?: string;
};

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Our Shariah Screening Approach — Zamzam Capital" },
      {
        name: "description",
        content:
          "How Zamzam Capital classifies stocks: business activity screening, financial screening, thresholds and data update practices.",
      },
      { property: "og:title", content: "Our Shariah Screening Approach — Zamzam Capital" },
      {
        property: "og:description",
        content:
          "Business activity screening, financial screening and the data behind every classification.",
      },
    ],
  }),
  component: MethodologyPage,
});

function Block({ label, text }: { label: string; text?: string | undefined }) {
  return (
    <section className="border-t border-border py-8">
      <p className="label-mono">{label}</p>
      {text?.trim() ? (
        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Not yet published. This section is maintained by Zamzam Capital and will appear here once
          set in the admin portal.
        </p>
      )}
    </section>
  );
}

function MethodologyPage() {
  const { data } = useQuery({
    queryKey: ["settings", "methodology"],
    queryFn: () => getSetting<Methodology>("methodology"),
  });
  const { data: dataset } = useQuery({
    queryKey: ["dataset", "active"],
    queryFn: getActiveDataset,
  });

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Methodology"
        title="Our Shariah Screening Approach"
        intro="Classifications on this platform are based on Zamzam Capital's selected methodology and maintained data."
      />
      <div className="mx-auto max-w-4xl px-5 pb-20 sm:px-6">
        {data?.intro ? (
          <p className="py-8 text-base leading-relaxed text-muted-foreground">{data.intro}</p>
        ) : null}
        <Block label="Business activity screening" text={data?.business_activity} />
        <Block label="Financial screening" text={data?.financial} />
        <Block label="Thresholds &amp; criteria" text={data?.thresholds} />
        <Block label="Data updates" text={data?.data_updates} />

        <section className="mt-8 rounded-xl border border-border glass p-6">
          <p className="label-mono">Current dataset</p>
          <dl className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <dt className="label-mono">Version</dt>
              <dd className="mt-1 font-mono text-sm">{dataset?.version ?? "—"}</dd>
            </div>
            <div>
              <dt className="label-mono">Records</dt>
              <dd className="mt-1 font-mono text-sm">{dataset?.record_count ?? "—"}</dd>
            </div>
            <div>
              <dt className="label-mono">Last screening date</dt>
              <dd className="mt-1 font-mono text-sm">{formatDate(dataset?.published_at)}</dd>
            </div>
            <div>
              <dt className="label-mono">Source</dt>
              <dd className="mt-1 font-mono text-sm">Zamzam Capital</dd>
            </div>
          </dl>
        </section>
      </div>
    </SiteShell>
  );
}
