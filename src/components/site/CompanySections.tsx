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
    <section id="about" className="company-editorial scroll-mt-16 overflow-hidden border-b border-company-rule bg-company-ink py-16 text-company-copy sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-4xl">
          <p className="label-mono text-company-accent">Who we are</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">About <span className="text-company-accent">Zamzam Capital</span></h2>
          <p className="mt-5 text-base leading-relaxed text-company-muted sm:mt-6 sm:text-lg">Zamzam Capital is a SEBI-registered Research Analyst firm focused on market research and Shariah-conscious investing in Indian equities.</p>
          <p className="mt-3 text-base leading-relaxed text-company-muted sm:text-lg">Founded by Saif Ahmed, the firm brings together fundamental and technical analysis with a published three-stage Shariah screening framework.</p>
        </div>

        <div className="about-credential mt-9 grid w-fit max-w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-md border border-company-rule bg-company-card p-4 sm:mt-10 sm:items-center sm:gap-4 sm:p-5 sm:pr-8">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-company-accent text-company-icon-foreground"><ShieldCheck className="size-5" /></span>
          <div className="min-w-0">
            <p className="label-mono text-company-accent">SEBI registered</p>
            <p className="text-sm font-semibold">Research Analyst</p>
            <p className="text-xs leading-relaxed text-company-muted">License No: INH000016199 <span className="inline-block">· BSE Enlistment No: 6158</span></p>
          </div>
        </div>

        <div className="mt-9 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4">
          {strengths.map(({ title, description, Icon }, index) => (
            <div key={title} className="company-feature group relative overflow-hidden rounded-md border border-company-rule bg-company-card p-5 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none sm:min-h-52 sm:p-7">
              <span aria-hidden="true" className="absolute right-5 top-2 text-6xl font-semibold leading-none opacity-20 sm:text-7xl">0{index + 1}</span>
              <span className="relative flex size-11 items-center justify-center rounded-md bg-company-icon-surface text-company-accent"><Icon className="size-5" strokeWidth={1.7} /></span>
              <h3 className="relative mt-5 text-lg font-semibold sm:mt-7 sm:text-xl">{title}</h3>
              <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-company-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConnectSection() {
  return (
    <section id="connect" className="company-editorial scroll-mt-16 overflow-hidden bg-company-connect py-16 text-company-copy sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-mono text-company-accent">Stay connected</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">Join Our <span className="text-company-accent">Community</span></h2>
          <p className="mt-4 text-base leading-relaxed text-company-muted">Follow Zamzam Capital&apos;s official profiles for research, updates, and education.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4">
          {profiles.map(({ name, href, Icon, description }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} profile`} className="company-profile group relative grid min-h-36 grid-cols-[minmax(0,1fr)_auto] items-start overflow-hidden rounded-md border border-company-rule bg-company-card p-5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company-accent motion-reduce:transform-none sm:min-h-48 sm:p-7">
              <span className="flex size-11 items-center justify-center rounded-md bg-company-icon-surface text-company-accent"><Icon className="size-5" strokeWidth={1.7} /></span>
              <ArrowUpRight className="size-6 shrink-0 self-center text-company-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
              <span className="col-span-2 mt-5 text-xl font-semibold sm:mt-8 sm:text-2xl">{name}</span>
              <span className="col-span-2 mt-1 text-sm text-company-muted">{description}</span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-company-muted">Profiles listed on zamzam-capital.com.</p>
      </div>
    </section>
  );
}