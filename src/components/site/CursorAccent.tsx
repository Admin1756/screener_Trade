import { useEffect, useRef } from "react";

/** A decorative pointer follower; the browser cursor and all controls remain unchanged. */
export function CursorAccent() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const motion = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let ready = false;

    const animate = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      ring.style.translate = `${x}px ${y}px`;
      frame = requestAnimationFrame(animate);
    };

    const onMove = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!ready) {
        x = targetX;
        y = targetY;
        ready = true;
        frame = requestAnimationFrame(animate);
      }
      ring.classList.add("cursor-accent-visible");
      ring.classList.toggle("cursor-accent-link", Boolean((event.target as Element | null)?.closest("a, button, input, textarea, select, [role='button'], [role='tab']")));
    };

    const hide = () => ring.classList.remove("cursor-accent-visible");
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) hide();
    };
    const onPreferenceChange = () => {
      if (!motion.matches) hide();
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", hide);
    motion.addEventListener("change", onPreferenceChange);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", hide);
      motion.removeEventListener("change", onPreferenceChange);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ringRef} className="cursor-accent" aria-hidden="true" />;
}