/** Subtle animated market-data backdrop: dark grid, drifting chart lines, glow. */
export function MarketBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-backdrop" />
      <div className="absolute -top-40 left-1/4 size-[520px] rounded-full bg-primary/[0.07] blur-[130px]" />
      <div className="absolute -bottom-32 right-0 size-[420px] rounded-full bg-gold/[0.05] blur-[130px]" />
      <svg
        className="absolute inset-x-0 bottom-0 h-56 w-full opacity-[0.35]"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="zz-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="45%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="text-primary">
          <path
            d="M0 150 L80 132 L160 141 L240 104 L320 118 L400 82 L480 96 L560 63 L640 79 L720 52 L800 68 L880 41 L960 58 L1040 34 L1120 47 L1200 26"
            fill="none"
            stroke="url(#zz-line)"
            strokeWidth="1.5"
          />
        </g>
        <g className="text-muted-foreground">
          <path
            d="M0 178 L80 168 L160 174 L240 158 L320 166 L400 149 L480 160 L560 142 L640 152 L720 133 L800 147 L880 126 L960 138 L1040 118 L1120 130 L1200 110"
            fill="none"
            stroke="url(#zz-line)"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
}

const TICKS = [
  "NSE · SCREENING DATA",
  "BSE · SCREENING DATA",
  "BUSINESS ACTIVITY SCREEN",
  "FINANCIAL SCREEN",
  "COMPLIANCE STATUS",
  "DATASET VERSIONING",
];

export function TickerStrip() {
  return (
    <div className="overflow-hidden border-y border-border bg-surface/40">
      <div className="flex w-max animate-ticker">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-10 pr-10 py-2.5">
            {TICKS.map((tick) => (
              <span key={tick} className="label-mono whitespace-nowrap">
                {tick}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
