import type { Dictionary } from "@/i18n/dictionaries/en";
import { destinations } from "@/config/content";

/**
 * Two tilted bands of destination names that slide in opposite
 * directions as you scroll (CSS scroll-driven; continuous drift fallback).
 */
export function Marquee({ t }: { t: Dictionary }) {
  const names = destinations.map((d) => t.destinations.items[d.id].name);
  const half = Math.ceil(names.length / 2);
  const rowA = names.slice(0, half);
  const rowB = names.slice(half);

  const Row = ({ items, className }: { items: string[]; className: string }) => (
    <div className={`marquee-track flex w-max shrink-0 ${className}`}>
      {[0, 1].map((k) => (
        <span key={k} className="flex shrink-0 items-center" aria-hidden={k === 1 || undefined}>
          {items.map((n) => (
            <span key={n} className="flex items-center">
              <span className="px-4 sm:px-6">{n}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 opacity-80 sm:h-5 sm:w-5" aria-hidden>
                <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <section aria-label={t.hero.marqueeLabel} className="relative z-10 -mt-6 overflow-hidden py-6 sm:-mt-8 sm:py-8">
      <div className="-mx-[10%] -rotate-2 bg-saffron py-3 font-display text-2xl font-extrabold whitespace-nowrap text-navy-900 shadow-[0_10px_30px_-10px_rgb(243_164_59/0.7)] sm:py-4 sm:text-4xl">
        <Row items={rowA} className="" />
      </div>
      <div className="-mx-[10%] mt-2 rotate-1 bg-navy py-3 font-display text-2xl font-extrabold whitespace-nowrap text-white sm:py-4 sm:text-4xl">
        <Row items={rowB} className="reverse text-white/90" />
      </div>
      <p className="sr-only">{names.join(", ")}</p>
    </section>
  );
}

/** A giant sentence that slides sideways with scroll – pure CSS. */
export function KineticBand({ text, sub }: { text: string; sub?: string }) {
  return (
    <section aria-hidden className="relative overflow-hidden bg-cream py-10 sm:py-16">
      <div className="sd-kinetic font-display text-[18vw] leading-none font-extrabold whitespace-nowrap text-navy/90 sm:text-[11vw]">
        <span className="text-gradient-navy">{text}</span>
      </div>
      {sub && (
        <div className="sd-kinetic reverse mt-2 font-display text-[12vw] leading-none font-extrabold whitespace-nowrap text-saffron sm:text-[7vw]">
          <span className="text-outline">{sub}</span>
        </div>
      )}
    </section>
  );
}
