"use client";
import { useEffect, useRef } from "react";

/**
 * A thin "road" across the very top of the screen: it fills with saffron
 * and a little car drives along it as you read down the page.
 * Uses CSS scroll-driven animation where supported (zero JS per frame);
 * falls back to a passive scroll listener elsewhere.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        el.style.setProperty("--p", String(max > 0 ? Math.min(1, scrollY / max) : 0));
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[5px]">
      <div className="absolute inset-0 bg-navy-900/25" />
      <div className="progress-fill absolute inset-0 bg-[linear-gradient(90deg,#e2552b,#f3a43b,#ffc65c)]" />
      <div className="progress-car absolute -top-[3px] left-0 h-[11px] w-[24px]">
        <svg viewBox="0 0 24 11" className="h-full w-full drop-shadow">
          <rect x="0.5" y="1" width="22" height="7" rx="2.5" fill="#173D5B" />
          <rect x="15" y="2.3" width="5" height="3" rx="1" fill="#DDEBF5" />
          <circle cx="6" cy="8.5" r="2" fill="#242A30" />
          <circle cx="17" cy="8.5" r="2" fill="#242A30" />
        </svg>
      </div>
    </div>
  );
}
