import { site } from "@/config/site";

/**
 * A ~1.3 second brand intro on the first visit of a browsing session:
 * the name draws in, then navy and saffron curtains lift to reveal the hero.
 * Pure CSS, pointer-events: none (taps go straight through), skipped on
 * repeat visits and for reduced-motion users.
 */
export function IntroCurtain() {
  return (
    <div className="intro" aria-hidden>
      <div className="c1" />
      <div className="c2">
        <div className="logo text-center">
          <p className="font-display text-4xl font-extrabold text-white sm:text-6xl">{site.shortName}</p>
          <div className="line mx-auto mt-3 h-1 w-40 rounded-full bg-[linear-gradient(90deg,#e2552b,#f3a43b,#ffc65c)] sm:w-56" />
          <p className="mt-3 text-xs font-bold tracking-[0.35em] text-saffron uppercase sm:text-sm">Tours &amp; Travels</p>
        </div>
      </div>
    </div>
  );
}
