import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-8 sm:px-6">
        <img src={zamzamLogo.url} alt="" className="size-10 object-contain" />
        <span className="text-sm font-semibold">Zamzam Capital</span>
      </div>
    </footer>
  );
}