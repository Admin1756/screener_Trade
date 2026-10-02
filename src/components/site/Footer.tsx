import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";
import zamzamDarkLogo from "@/assets/zamzam-logo-dark.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-8 sm:px-6">
        <a
          href="https://zamzam-capital.com/"
          className="flex items-center gap-3"
          aria-label="Zamzam Capital — official website"
        >
          <span className="flex h-11 items-center overflow-hidden rounded-sm border border-border px-2">
            <img src={zamzamDarkLogo.url} alt="" className="h-full w-auto object-contain light:hidden" />
            <img src={zamzamLogo.url} alt="" className="hidden h-full w-auto object-contain light:block" />
          </span>
          <span className="text-sm font-semibold">Zamzam Capital</span>
        </a>
      </div>
    </footer>
  );
}