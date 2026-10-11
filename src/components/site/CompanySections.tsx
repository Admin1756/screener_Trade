import { ArrowUpRight, Award, BookOpen, Instagram, Leaf, Linkedin, Send, ShieldCheck, Youtube } from "lucide-react";

const strengths = [
  { title: "SEBI Registered", description: "Research Analyst registration INH000016199 · BSE enlistment 6158.", Icon: Award },
  { title: "Ethical Investing", description: "Research grounded in Shariah-conscious investment principles.", Icon: Leaf },
  { title: "Shariah Screening", description: "Business activities, financial ratios, and qualitative review form the published framework.", Icon: ShieldCheck },
  { title: "Investor Education", description: "Research and education to support more informed investment decisions.", Icon: BookOpen },
];

const profiles = [
  { name: "Instagram", href: "https://www.instagram.com/zamzamcapitalindia", Icon: Instagram, description: "Research snapshots and updates" },
  { name: "YouTube", href: "https://www.youtube.com/@zamzamcapital", Icon: Youtube, description: "Explainers and walkthroughs" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/zamzam-capital", Icon: Linkedin, description: "Company news and announcements" },
  { name: "Telegram", href: "https://t.me/zamzamcapital", Icon: Send, description: "Research updates" },
];

export function AboutSection() {
  return (
    <section id="about" className="company-editorial scroll-mt-16 border-b border-company-rule bg-company-ink py-12 text-company-copy sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-4xl">
          <p className="label-mono text-company-accent">Who we are</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-4xl">About Zamzam Capital</h2>
          <p className="mt-5 text-base leading-relaxed text-company-muted sm:mt-6 sm:text-lg">Zamzam Capital is a SEBI-registered Research Analyst firm focused on market research and Shariah-conscious investing in Indian equities.</p>
          <p className="mt-3 text-base leading-relaxed text-company-muted sm:text-lg">Founded by Saif Ahmed, the firm brings together fundamental and technical analysis with a published three-stage Shariah screening framework.</p>
        </div>

        <div className="mt-7 grid w-fit max-w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-lg border border-company-rule bg-company-card p-3.5 sm:mt-8 sm:items-center sm:gap-4 sm:p-4 sm:pr-7">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-company-accent text-company-icon-foreground"><ShieldCheck className="size-5" /></span>
          <div className="min-w-0">
            <p className="label-mono text-company-accent">SEBI registered</p>
            <p className="text-sm font-semibold">Research Analyst</p>
            <p className="text-xs leading-relaxed text-company-muted">License No: INH000016199 <span className="inline-block">· BSE Enlistment No: 6158</span></p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
          {strengths.map(({ title, description, Icon }) => (
            <div key={title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 rounded-lg border border-company-rule bg-company-card p-4 sm:block sm:p-6">
              <span className="row-span-2 flex size-10 shrink-0 items-center justify-center rounded-md bg-company-icon-surface text-company-accent"><Icon className="size-5" strokeWidth={1.7} /></span>
              <h3 className="min-w-0 text-base font-semibold sm:mt-5 sm:text-lg">{title}</h3>
              <p className="mt-1 min-w-0 text-sm leading-relaxed text-company-muted sm:mt-2">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConnectSection() {
  return (
    <section id="connect" className="company-editorial scroll-mt-16 bg-company-connect py-12 text-company-copy sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-mono text-company-accent">Stay connected</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-4xl">Join Our Community</h2>
          <p className="mt-4 text-base leading-relaxed text-company-muted">Follow Zamzam Capital&apos;s official profiles for research, updates, and education.</p>
        </div>
        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
          {profiles.map(({ name, href, Icon, description }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} profile`} className="group relative grid min-h-24 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 sm:min-h-36 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start rounded-lg border border-company-rule bg-company-card p-4 transition-colors hover:border-company-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company-accent sm:min-h-36 sm:p-6">
              <span className="row-span-2 flex size-10 shrink-0 items-center sm:row-span-1 justify-center rounded-md bg-company-icon-surface text-company-accent"><Icon className="size-5" strokeWidth={1.7} /></span>
              <ArrowUpRight className="col-start-3 row-span-2 row-start-1 size-5 shrink-0 self-center text-company-accent sm:col-start-2 sm:row-span-1 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
              <span className="col-start-2 row-start-1 min-w-0 text-base sm:col-span-2 sm:col-start-1 sm:row-start-auto font-semibold sm:mt-5 sm:text-lg">{name}</span>
              <span className="col-start-2 row-start-2 mt-1 min-w-0 text-sm leading-relaxed sm:col-span-2 sm:col-start-1 sm:row-start-auto text-company-muted">{description}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}