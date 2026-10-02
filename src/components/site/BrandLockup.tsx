import zamzamLogo from "@/assets/zamzam-logo.png.asset.json";
import chartinkLogo from "@/assets/chartink-logo.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Zamzam Capital shown alongside Chartink — scanner-link support only,
 * this is not a claim of partnership or endorsement.
 */
export function BrandLockup({
  className,
  size = "md",
  caption = true,
}: {
  className?: string;
  size?: "sm" | "md";
  caption?: boolean;
}) {
  const box = size === "sm" ? "size-8" : "size-11";
  const zamzamBox = size === "sm" ? "h-8" : "h-11";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center overflow-hidden rounded-lg bg-panel px-2 ring-1 ring-border",
          zamzamBox,
        )}
      >
        <img
          src={zamzamLogo.url}
          alt="Zamzam Capital logo"
          className="h-full w-auto object-contain"
          loading="lazy"
        />
      </span>
      <span className="font-mono text-xs text-muted-foreground">×</span>
      <span
        className={cn(
          "flex shrink-0 items-center overflow-hidden rounded-lg bg-panel ring-1 ring-border",
          box,
        )}
      >
        <img
          src={chartinkLogo.url}
          alt="Chartink logo"
          className="size-full object-contain p-0.5"
          loading="lazy"
        />
      </span>
      {caption ? (
        <span className="label-mono leading-tight">
          Scanner-link support
          <span className="block">by Zamzam Capital</span>
        </span>
      ) : null}
    </div>
  );
}
