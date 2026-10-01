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
    <section id="about" className="company-editorial scroll-mt-16 border-b border-border bg-company-ink py-20 text-company-copy sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-10 border-b border-company-rule pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:pb-20">
          <div>
            <p className="label-mono text-company-accent">Who we are / Zamzam Capital</p>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Research with conviction. Investing with conscience.</h2>
          </div>
          <div className="lg:self-end">
            <p className="text-lg leading-relaxed sm:text-xl">Zamzam Capital is a SEBI-registered Research Analyst firm focused on market research and Shariah-conscious investing in Indian equities.</p>
            <p className="mt-6 text-base leading-relaxed text-company-muted">Founded by Saif Ahmed, the firm brings together fundamental and technical analysis with a published three-stage Shariah screening framework.</p>
          </div>
        </div>

        <div className="grid gap-4 border-b border-company-rule py-7 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
          <div className="flex items-center gap-3 text-company-accent"><ShieldCheck className="size-6" /><span className="label-mono text-company-accent">SEBI registered</span></div>
          <p className="text-sm leading-relaxed sm:text-right"><strong className="font-semibold">Research Analyst</strong><span className="mx-3 text-company-muted">/</span><span className="text-company-muted">License No: INH000016199 · BSE Enlistment No: 6158</span></p>
        </div>

        <div className="grid gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {strengths.map(({ title, description, Icon }, index) => (
            <div key={title} className="border-t border-company-rule pt-5">
              <div className="flex items-center justify-between text-company-accent"><span className="label-mono text-company-accent">0{index + 1}</span><Icon className="size-5" strokeWidth={1.5} /></div>
              <h3 className="mt-9 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-company-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConnectSection() {
  return (
    <section id="connect" className="company-editorial scroll-mt-16 bg-company-ink py-20 text-company-copy sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <p className="label-mono text-company-accent">Stay connected / Official channels</p>
          <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">The conversation continues.</h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-company-muted">Find Zamzam Capital&apos;s official profiles for research, updates, and education.</p>
          <p className="mt-12 text-xs text-company-muted">Profiles listed on zamzam-capital.com.</p>
        </div>
        <div className="border-t border-company-rule">
          {profiles.map(({ name, href, Icon, description }, index) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} profile`} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-company-rule py-5 transition-colors hover:text-company-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company-accent sm:grid-cols-[3rem_1fr_auto] sm:gap-6 sm:py-6">
              <span className="label-mono text-company-muted">0{index + 1}</span>
              <span className="min-w-0"><span className="flex items-center gap-3 text-xl font-semibold sm:text-2xl"><Icon className="size-5 shrink-0 text-company-accent" strokeWidth={1.5} />{name}</span><span className="mt-1 block text-xs text-company-muted sm:text-sm">{description}</span></span>
              <ArrowUpRight className="size-5 text-company-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}