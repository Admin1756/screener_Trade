import { useEffect, useRef } from "react";

/** A fading light follower; the browser cursor and all controls remain unchanged. */
export function CursorAccent() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    const motion = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let fadeTimer = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let ready = false;

    const animate = () => {
      x += (targetX - x) * 0.28;
      y += (targetY - y) * 0.28;
      light.style.translate = `${x}px ${y}px`;
      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!ready) {
        x = targetX;
        y = targetY;
        ready = true;
      }
      if (!frame) frame = requestAnimationFrame(animate);
      light.classList.add("cursor-accent-visible");
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(hide, 550);
    };

    const hide = () => light.classList.remove("cursor-accent-visible");
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
      window.clearTimeout(fadeTimer);
    };
  }, []);

  return <div ref={lightRef} className="cursor-accent" aria-hidden="true" />;
}