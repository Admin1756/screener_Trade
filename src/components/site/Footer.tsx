import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/lib/stocks";
import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";

type Social = { instagram?: string; youtube?: string; linkedin?: string; telegram?: string };

export function Footer() {
  const { data: social } = useQuery({
    queryKey: ["settings", "social"],
    queryFn: () => getSetting<Social>("social"),
    staleTime: 5 * 60_000,
  });

  const socials = (
    [
       ["Instagram", social?.instagram || "https://www.instagram.com/zamzamcapitalindia"],
       ["YouTube", social?.youtube || "https://www.youtube.com/@zamzamcapital"],
       ["LinkedIn", social?.linkedin || "https://www.linkedin.com/company/zamzam-capital"],
       ["Telegram", social?.telegram || "https://t.me/zamzamcapital"],
    ] as const
  ).filter(([, url]) => Boolean(url));

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
               <img src={zamzamLogo.url} alt="" className="size-10 object-contain" />
              <span className="text-sm font-semibold tracking-tight">Zamzam Capital</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="label-mono">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                   <Link to="/" className="transition-colors hover:text-foreground">
                     Screener
                  </Link>
                </li>
                 <li><Link to="/how-it-works" className="transition-colors hover:text-foreground">Product</Link></li>
                <li>
                  <Link to="/methodology" className="transition-colors hover:text-foreground">
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="transition-colors hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/connect" className="transition-colors hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="label-mono">Connect</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {socials.length > 0 ? (
                  socials.map(([label, url]) => (
                    <li key={label}>
                      <a
                        href={url as string}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="transition-colors hover:text-foreground"
                      >
                        {label}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link to="/connect" className="transition-colors hover:text-foreground">
                      Social channels
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="label-mono">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="transition-colors hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-colors hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="transition-colors hover:text-foreground">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="label-mono">Risk &amp; Information Disclaimer</p>
          <p className="mt-3 max-w-4xl text-xs leading-relaxed text-muted-foreground">
            Zamzam Capital provides informational tools for Shariah-compliance screening. The
            information provided by this platform should not be considered a guarantee of investment
            performance, financial return or personalized investment advice. Users should conduct
            their own research and make decisions according to their individual circumstances.
            Shariah classifications may change as company activities, financial information or
            screening criteria change.
          </p>
          <p className="mt-6 font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Zamzam Capital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
