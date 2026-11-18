"use client";
import { useEffect, useRef, useState } from "react";
import { destinationPhotos, destinations, seasonFor, seasons, type Season } from "@/config/content";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { prefillInquiry } from "@/lib/prefill";
import { SectionHeading } from "./SectionHeading";
import { PhotoCarousel } from "./PhotoCarousel";
import { ArrowRight, PinIcon } from "./Icons";

const ORDER: Season[] = ["winter", "summer", "monsoon"];

const THEME: Record<Season, { bg: string; accent: string; chip: string }> = {
  winter: { bg: "bg-[linear-gradient(160deg,#0f2a40_0%,#1f4d72_55%,#6c8fb0_100%)]", accent: "text-[#cfe6ff]", chip: "bg-[#cfe6ff] text-navy-900" },
  summer: { bg: "bg-[linear-gradient(160deg,#7a2e12_0%,#d9861a_55%,#ffc65c_100%)]", accent: "text-marigold", chip: "bg-marigold text-navy-900" },
  monsoon: { bg: "bg-[linear-gradient(160deg,#0d2b25_0%,#2f6a4d_55%,#4d8865_100%)]", accent: "text-[#b9f0cf]", chip: "bg-[#b9f0cf] text-navy-900" },
};

/** Weather particles drawn with CSS only (transform/opacity) */
function Weather({ season }: { season: Season }) {
  if (season === "summer") {
    return (
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 sm:h-96 sm:w-96">
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full bg-[repeating-conic-gradient(rgb(255_198_92/0.35)_0deg_6deg,transparent_6deg_18deg)] [mask-image:radial-gradient(circle,#000_30%,transparent_70%)]" />
        <div className="absolute inset-[30%] rounded-full bg-marigold shadow-[0_0_80px_30px_rgb(255_198_92/0.6)]" />
      </div>
    );
  }
  const n = 26;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: n }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i * 0.53) % 6;
        const dur = season === "winter" ? 7 + (i % 5) : 0.9 + (i % 4) * 0.15;
        return season === "winter" ? (
          <span
            key={i}
            className="absolute -top-4 block rounded-full bg-white/80"
            style={{ left: `${left}%`, width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2, animation: `snow ${dur}s ${delay}s linear infinite` }}
          />
        ) : (
          <span
            key={i}
            className="absolute -top-10 block w-px rounded-full bg-gradient-to-b from-transparent to-white/70"
            style={{ left: `${left}%`, height: 26 + (i % 3) * 10, animation: `rain ${dur}s ${delay}s linear infinite` }}
          />
        );
      })}
    </div>
  );
}

function SeasonIcon({ s }: { s: Season }) {
  if (s === "winter")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7M9 4l3 2 3-2M9 20l3-2 3 2" />
      </svg>
    );
  if (s === "summer")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M7 15a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 8 4 4 0 0 1 18 15.5H7z" />
      <path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
    </svg>
  );
}

export function Seasons() {
  const { dict } = useDictionary();
  const t = dict.seasons;
  const [season, setSeason] = useState<Season>("winter");
  const [current, setCurrent] = useState<Season | null>(null);
  const track = useRef<HTMLUListElement>(null);

  // Pick the real current season on the visitor's device.
  useEffect(() => {
    const s = seasonFor(new Date());
    setCurrent(s);
    setSeason(s);
  }, []);

  const choose = (s: Season) => {
    setSeason(s);
    track.current?.scrollTo({ left: 0 });
  };

  const theme = THEME[season];
  const ids = seasons[season];

  return (
    <section id="seasons" aria-labelledby="seasons-title" className="relative isolate overflow-hidden py-16 text-white sm:py-24">
      {/* Cross-fading season backgrounds */}
      {ORDER.map((s) => (
        <div key={s} aria-hidden className={`absolute inset-0 -z-20 transition-opacity duration-700 ${THEME[s].bg} ${s === season ? "opacity-100" : "opacity-0"}`} />
      ))}
      <div aria-hidden className="bg-jaali-light absolute inset-0 -z-10 opacity-40" />
      <Weather key={season} season={season} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="seasons-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} light />

        {/* Tabs */}
        <div role="tablist" aria-label={t.eyebrow} className="mt-7 grid grid-cols-3 gap-2 rounded-2xl bg-black/20 p-1.5 ring-1 ring-white/15 sm:inline-grid sm:min-w-[480px]">
          {ORDER.map((s) => {
            const on = s === season;
            return (
              <button
                key={s}
                role="tab"
                id={`tab-${s}`}
                aria-selected={on}
                aria-controls="season-panel"
                onClick={() => choose(s)}
                className={`press relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center ${
                  on ? "bg-white text-navy-900 shadow-lg" : "text-white/85 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-1.5 font-display text-base font-extrabold sm:text-lg">
                  <SeasonIcon s={s} /> {t.tabs[s].name}
                </span>
                <span className={`text-[0.7rem] font-semibold ${on ? "text-muted" : "text-white/60"}`}>{t.tabs[s].months}</span>
                {current === s && (
                  <span className="absolute -top-2 right-1 rounded-full bg-sindoor px-1.5 py-0.5 text-[0.6rem] font-bold text-white shadow">{t.now}</span>
                )}
              </button>
            );
          })}
        </div>

        <p key={`line-${season}`} className={`hero-in mt-5 max-w-xl text-lg font-semibold ${theme.accent}`}>
          {t.tabs[season].line}
        </p>
      </div>

      {/* Picks */}
      <ul
        id="season-panel"
        role="tabpanel"
        aria-labelledby={`tab-${season}`}
        ref={track}
        key={season}
        className="h-scroll relative mx-auto mt-6 max-w-7xl gap-3 px-4 pb-2 sm:gap-4 sm:px-6 lg:px-8"
      >
        {ids.map((id, i) => {
          const d = destinations.find((x) => x.id === id)!;
          const text = dict.destinations.items[id];
          return (
            <li key={id} className="w-[62vw] max-w-[250px] shrink-0 sm:w-[250px]" style={{ animation: `hero-in .55s ${i * 0.06}s both` }}>
              <article className="group relative isolate flex h-[320px] flex-col justify-end overflow-hidden rounded-[24px] bg-black/30 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/20">
                <div className="absolute inset-0 -z-20">
                  <PhotoCarousel
                    keys={destinationPhotos(id)}
                    alt={`${text.name}, ${text.region}`}
                    sizes="250px"
                    offset={i * 450}
                    interval={3200}
                    dotLabel={dict.common.photo}
                    focus={"focus" in d ? d.focus : undefined}
                  />
                </div>
                <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_35%,rgb(0_0_0/0.85)_100%)]" />
                <div className="p-4">
                  <p className="flex items-center gap-1 text-[0.7rem] font-bold tracking-wider text-white/80 uppercase">
                    <PinIcon size={12} /> {text.region}
                  </p>
                  <h3 className="text-xl leading-tight font-extrabold">{text.name}</h3>
                  <button
                    type="button"
                    onClick={() => prefillInquiry({ destination: text.name })}
                    className={`press mt-2.5 inline-flex min-h-10 items-center gap-1 rounded-full px-3.5 text-xs font-bold ${theme.chip}`}
                  >
                    {dict.common.planTrip} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            </li>
          );
        })}
        <li aria-hidden className="w-1 shrink-0" />
      </ul>
    </section>
  );
}
