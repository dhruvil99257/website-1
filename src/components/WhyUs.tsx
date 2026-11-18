import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeading } from "./SectionHeading";

/**
 * Verified strengths only – no invented numbers.
 * Compact, colourful 2×2 tiles (also 2×2 on phones).
 */
export function WhyUs({ t }: { t: Dictionary }) {
  const items = [
    { key: "own", art: <KeysArt />, tone: "bg-navy text-white", sub: "text-white/75", icon: "bg-white/10 ring-white/20" },
    { key: "range", art: <SeatsArt />, tone: "bg-saffron text-navy-900", sub: "text-navy-900/75", icon: "bg-white/50 ring-white/60" },
    { key: "india", art: <RouteArt />, tone: "bg-green-700 text-white", sub: "text-white/80", icon: "bg-white/15 ring-white/25" },
    { key: "pricing", art: <MeterArt />, tone: "card-premium text-navy", sub: "text-muted", icon: "bg-saffron-100 ring-saffron/30" },
  ] as const;

  return (
    <section id="why" aria-labelledby="why-title" className="relative overflow-hidden bg-cream py-16 sm:py-24">
      <div className="bg-jaali absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-8">
        <SectionHeading id="why-title" eyebrow={t.why.eyebrow} title={t.why.title} intro={t.why.intro} />

        <ul className="grid grid-cols-2 gap-3 [perspective:1200px] sm:gap-4">
          {items.map(({ key, art, tone, sub, icon }, i) => (
            <li
              key={key}
              data-tilt-in
              className={`shine group relative flex min-h-[188px] flex-col overflow-hidden rounded-[22px] p-4 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:min-h-[220px] sm:rounded-[26px] sm:p-6 ${tone}`}
            >
              <span aria-hidden className="absolute -right-1 -bottom-4 font-display text-[4.5rem] leading-none font-extrabold opacity-[0.12] sm:text-[6rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl ring-1 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:h-16 sm:w-16 ${icon}`}>
                <div className="scale-[0.72] sm:scale-90">{art}</div>
              </div>
              <h3 className="relative text-[1.02rem] leading-snug font-extrabold sm:text-xl">{t.why.items[key].title}</h3>
              <p className={`relative mt-1 text-[0.8rem] leading-snug sm:text-[0.95rem] ${sub}`}>{t.why.items[key].desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Small animated illustrations (CSS only). `currentColor` follows each tile's text colour. */
function KeysArt() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
      <g className="origin-[20px_20px] transition-transform duration-500 group-hover:rotate-[-18deg]">
        <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M28 28l18 18M38 38l4-4M43 43l4-4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="20" cy="20" r="4" fill="#F3A43B" />
    </svg>
  );
}
function SeatsArt() {
  return (
    <svg width="60" height="56" viewBox="0 0 60 56" aria-hidden>
      <rect x="4" y="30" width="16" height="16" rx="4" fill="#4D8865" className="animate-float" />
      <rect x="22" y="22" width="16" height="24" rx="4" fill="#fff" className="animate-float [animation-delay:.3s]" />
      <rect x="40" y="12" width="16" height="34" rx="4" fill="#173D5B" className="animate-float [animation-delay:.6s]" />
      <path d="M2 50h56" stroke="#173D5B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function RouteArt() {
  return (
    <svg width="58" height="56" viewBox="0 0 58 56" aria-hidden>
      <path d="M8 46C20 46 14 26 28 26S40 8 50 8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray="5 6" strokeLinecap="round" className="animate-lane" />
      <circle cx="8" cy="46" r="5" fill="#E2552B" />
      <path d="M50 18s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" fill="#FFC65C" stroke="#173D5B" strokeWidth="2" />
    </svg>
  );
}
function MeterArt() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
      <path d="M8 40a20 20 0 1 1 40 0" fill="none" stroke="#173D5B" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 40a14 14 0 0 1 4-10" fill="none" stroke="#4D8865" strokeWidth="4" strokeLinecap="round" />
      <g className="origin-[28px_40px] transition-transform duration-700 group-hover:rotate-[60deg]">
        <path d="M28 40L18 26" stroke="#F3A43B" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="28" cy="40" r="4" fill="#173D5B" />
      <text x="28" y="54" textAnchor="middle" fontSize="9" fontWeight="700" fill="#173D5B">₹/km</text>
    </svg>
  );
}
