import { useEffect, useRef } from "react";
import candleVideo from "@/assets/candlestick-loop.mp4.asset.json";
import candleWebm from "@/assets/candlestick-loop.webm.asset.json";
import traderVideo from "@/assets/trader-background.webm.asset.json";

/** Decorative, illustrative price chart; never presented as live market data. */
export function MarketBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (preference.matches) {
        videoRef.current?.pause();
        secondVideoRef.current?.pause();
      } else {
        videoRef.current?.play().catch(() => {});
        secondVideoRef.current?.play().catch(() => {});
      }
    };
    syncPlayback();
    preference.addEventListener("change", syncPlayback);
    return () => preference.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="market-video market-video-candles absolute inset-x-0 top-0 w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
      >
        <source src={candleWebm.url} type="video/webm" />
        <source src={candleVideo.url} type="video/mp4" />
      </video>
      <video
        ref={secondVideoRef}
        className="market-video market-video-trader absolute inset-x-0 top-0 w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
      >
        <source src={traderVideo.url} type="video/webm" />
      </video>
      <div className="market-video-wash absolute inset-x-0 top-0" />
      <div className="absolute inset-0 grid-backdrop opacity-40" />
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
