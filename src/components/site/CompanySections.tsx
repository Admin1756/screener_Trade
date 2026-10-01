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
    <section id="about" className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
        <div>
          <p className="label-mono text-primary">Who we are</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">About Zamzam Capital</h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">Zamzam Capital is a SEBI-registered Research Analyst firm focused on market research and Shariah-conscious investing in Indian equities.</p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Founded by Saif Ahmed, the firm brings together fundamental and technical analysis with a published three-stage Shariah screening framework.</p>
          <div className="mt-9 inline-flex max-w-full items-center gap-4 border border-border bg-surface px-5 py-4">
            <span className="grid size-12 shrink-0 place-items-center bg-primary text-primary-foreground"><ShieldCheck className="size-5" /></span>
            <span className="min-w-0"><span className="label-mono block text-gold">SEBI registered</span><strong className="mt-1 block text-base">Research Analyst</strong><span className="mt-1 block text-xs text-muted-foreground">License No: INH000016199 · BSE Enlistment No: 6158</span></span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {strengths.map(({ title, description, Icon }) => (
            <div key={title} className="border border-border bg-surface p-7">
              <span className="grid size-12 place-items-center bg-primary/10 text-primary"><Icon className="size-5" /></span>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConnectSection() {
  return (
    <section id="connect" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <p className="label-mono text-primary">Stay connected</p>
        <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">Connect with Zamzam Capital</h2>
        <p className="mt-4 text-base text-muted-foreground">Find the official profiles for research, updates, and education.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map(({ name, href, Icon, description }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="group border border-border bg-background p-6 transition-colors hover:border-primary/50">
              <span className="grid size-11 place-items-center bg-primary/10 text-primary"><Icon className="size-5" /></span>
              <h3 className="mt-6 text-xl font-semibold">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">Open profile <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Profiles listed on zamzam-capital.com.</p>
      </div>
    </section>
  );
}