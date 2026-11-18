"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { indiaMap } from "@/config/indiaMap";
import { destinationPhotos, destinations, homeBase, kmFromSurat, type DestinationId } from "@/config/content";
import { fmt, useDictionary } from "@/i18n/DictionaryProvider";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion, prefillInquiry } from "@/lib/prefill";
import { SectionHeading } from "./SectionHeading";
import { PhotoCarousel } from "./PhotoCarousel";
import { ArrowRight, MapIcon, PinIcon } from "./Icons";

const [hx, hy] = homeBase.map;
const TOUR_MS = 3800;

/** Curved route from Surat to a destination (bows outward for a nicer arc). */
function routePath(x: number, y: number) {
  const mx = (hx + x) / 2;
  const my = (hy + y) / 2;
  const dx = x - hx;
  const dy = y - hy;
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(60, len * 0.28);
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M${hx} ${hy} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x} ${y}`;
}

function DestinationCard({ id }: { id: DestinationId }) {
  const { dict } = useDictionary();
  const t = dict.discover;
  const d = destinations.find((x) => x.id === id)!;
  const text = dict.destinations.items[id];
  return (
    <article className="hero-in flex gap-4 overflow-hidden rounded-[26px] bg-white/[0.07] p-3 ring-1 ring-white/15">
      <div className="relative aspect-[4/5] w-32 shrink-0 overflow-hidden rounded-[20px] bg-navy-700 sm:w-40">
        <PhotoCarousel
          keys={destinationPhotos(id)}
          alt={`${text.name}, ${text.region}`}
          sizes="160px"
          interval={1700}
          dots={false}
          focus={"focus" in d ? d.focus : undefined}
        />
      </div>
      <div className="flex min-w-0 flex-col py-1 pr-1">
        <p className="flex items-center gap-1 text-xs font-bold tracking-wider text-marigold uppercase">
          <PinIcon size={13} /> {text.region}
        </p>
        <h3 className="text-2xl leading-tight font-extrabold">{text.name}</h3>
        <p className="mt-1 text-sm text-white/75">{text.desc}</p>
        <p
          className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-saffron/15 px-2.5 py-1 text-xs font-bold text-marigold ring-1 ring-saffron/30"
          title={t.distanceNote}
        >
          {fmt(t.distance, kmFromSurat(d.map))}
        </p>
        <button
          type="button"
          onClick={() => prefillInquiry({ destination: text.name })}
          className="press mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-2 font-bold text-saffron hover:text-white"
        >
          {dict.common.planTrip} <ArrowRight size={18} />
        </button>
      </div>
    </article>
  );
}

/**
 * "Discover India" – a night-time map of India with glowing routes from Surat.
 * When nobody is touching it, it gives itself an auto-tour: each stop lights
 * up, a little bus drives the route and the card shows that place's photos.
 */
export function IndiaMap() {
  const { dict } = useDictionary();
  const t = dict.discover;
  const [selected, setSelected] = useState<DestinationId>(destinations[0].id);
  const [touring, setTouring] = useState(true);
  const [inView, setInView] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const states = useMemo(() => new Set(destinations.map((d) => dict.destinations.items[d.id].region)).size, [dict]);

  // Only tour while the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!touring || !inView || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setSelected((cur) => {
        const i = destinations.findIndex((d) => d.id === cur);
        return destinations[(i + 1) % destinations.length].id;
      });
    }, TOUR_MS);
    return () => window.clearInterval(id);
  }, [touring, inView]);

  // Keep the active chip visible inside its own row (never scrolls the page).
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-id="${selected}"]`);
    if (!row || !chip) return;
    const target = chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2;
    row.scrollTo({ left: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [selected]);

  // One-time "routes fan out from Surat" animation.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 80%", once: true }, defaults: { ease: "power2.out" } });
      tl.from("[data-land]", { opacity: 0, scale: 0.94, transformOrigin: "50% 50%", duration: 0.9 })
        .from("[data-home]", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2)" }, "-=0.3")
        .fromTo("[data-route]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.03 }, "-=0.1")
        .from("[data-pin]", { scale: 0, transformOrigin: "50% 50%", duration: 0.35, stagger: 0.025, ease: "back.out(2.2)" }, "<0.2");
    }, svg);
    return () => ctx.revert();
  }, []);

  const pick = (id: DestinationId) => {
    setTouring(false);
    setSelected(id);
  };

  const sel = destinations.find((d) => d.id === selected)!;
  const selText = dict.destinations.items[selected];
  const selPath = routePath(sel.map[0], sel.map[1]);

  const stats = [
    { value: String(destinations.length), label: t.statPlaces },
    { value: String(states), label: t.statStates },
    { value: "4–56", label: t.statSeats },
  ];

  return (
    <section ref={sectionRef} id="discover" aria-labelledby="discover-title" className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
      {/* night sky */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(31_77_114/0.55),transparent_60%),radial-gradient(ellipse_at_10%_90%,rgb(243_164_59/0.14),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:linear-gradient(180deg,#000,transparent_70%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:px-8">
        <div className="min-w-0">
          <SectionHeading id="discover-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} light />

          {/* Stats (counted from our own data, nothing invented) */}
          <dl className="mt-7 grid grid-cols-3 gap-2 sm:gap-3" data-reveal>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-white/[0.06] px-3 py-3 ring-1 ring-white/10 sm:px-4">
                <dt className="mt-1.5 text-[0.72rem] leading-tight text-white/65 sm:text-xs">{s.label}</dt>
                <dd className="text-gradient font-display text-2xl leading-none font-extrabold sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* Destination picker */}
          <div className="mt-6" data-reveal>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <MapIcon size={16} /> {t.tapHint}
              </p>
              <button
                type="button"
                onClick={() => setTouring((v) => !v)}
                aria-pressed={touring}
                className="press inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 text-xs font-bold ring-1 ring-white/20 hover:bg-white/20"
              >
                <span className={`h-2 w-2 rounded-full ${touring ? "animate-pulse bg-saffron" : "bg-white/50"}`} />
                {touring ? t.pauseTour : t.autoTour}
              </button>
            </div>
            <div ref={chipsRef} className="h-scroll fade-x -mx-4 gap-2 px-4 py-1 lg:mx-0 lg:px-0" role="group" aria-label={t.tapHint}>
              {destinations.map((d) => (
                <button
                  key={d.id}
                  data-id={d.id}
                  type="button"
                  aria-pressed={selected === d.id}
                  onClick={() => pick(d.id)}
                  className={`press shrink-0 rounded-full px-4 py-2.5 text-sm font-bold ring-1 transition-colors ${
                    selected === d.id ? "bg-saffron text-navy-900 ring-saffron" : "bg-white/5 text-white/90 ring-white/15 hover:bg-white/15"
                  }`}
                >
                  {dict.destinations.items[d.id].name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected destination card (desktop position) */}
          <div className="mt-6 hidden lg:block" aria-live="polite">
            <DestinationCard key={selected} id={selected} />
          </div>
        </div>

        {/* Map */}
        <div className="relative mx-auto w-full max-w-[560px] min-w-0">
          <div aria-hidden className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(243_164_59/0.22),transparent_65%)]" />
          <svg ref={svgRef} viewBox={indiaMap.viewBox} className="relative h-auto w-full" role="img" aria-label={`${t.coverage} – ${t.homeBase}`}>
            <defs>
              <pattern id="map-dots" width="9" height="9" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="#F3A43B" opacity=".28" />
              </pattern>
              <linearGradient id="map-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1F4D72" />
                <stop offset="1" stopColor="#173D5B" />
              </linearGradient>
            </defs>
            <g data-land>
              <path d={indiaMap.path} fill="none" stroke="#F3A43B" strokeOpacity=".18" strokeWidth="9" strokeLinejoin="round" />
              <path d={indiaMap.path} fill="url(#map-fill)" stroke="#F3A43B" strokeOpacity=".7" strokeWidth="1.4" strokeLinejoin="round" />
              <path d={indiaMap.path} fill="url(#map-dots)" />
            </g>

            {destinations.map((d) => (
              <path
                key={d.id}
                data-route
                d={routePath(d.map[0], d.map[1])}
                pathLength={1}
                strokeDasharray="1 1"
                fill="none"
                stroke="#FFC65C"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={d.id === selected ? 0 : 0.35}
                style={{ transition: "opacity .4s" }}
              />
            ))}

            {/* Active route: glow + marching dashes + a bus driving it */}
            <g key={selected} aria-hidden>
              <path d={selPath} fill="none" stroke="#F3A43B" strokeOpacity=".35" strokeWidth="8" strokeLinecap="round" />
              <path d={selPath} fill="none" stroke="#FFC65C" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 7" className="animate-lane" />
              <g>
                <g transform="translate(-10 -6)">
                  <rect width="20" height="11" rx="3" fill="#F3A43B" stroke="#0A1E2F" strokeWidth="1.3" />
                  <rect x="13" y="2.2" width="4.5" height="4" rx="1" fill="#DDEBF5" />
                  <rect x="3" y="2.2" width="8" height="4" rx="1" fill="#DDEBF5" />
                </g>
                <animateMotion dur="2.6s" fill="freeze" rotate="auto" path={selPath} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .2 1" />
              </g>
            </g>

            {destinations.map((d) => {
              const active = selected === d.id;
              const [x, y] = d.map;
              return (
                <g key={d.id} data-pin onClick={() => pick(d.id)} className="cursor-pointer" aria-hidden>
                  <circle cx={x} cy={y} r="18" fill="transparent" />
                  {active && <circle cx={x} cy={y} r="9" fill="#FFC65C" opacity=".35" className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px` }} />}
                  <circle cx={x} cy={y} r={active ? 8 : 5} fill={active ? "#FFC65C" : "#F3A43B"} stroke="#0A1E2F" strokeWidth="2" style={{ transition: "r .25s" }} />
                </g>
              );
            })}

            {/* Home base: Surat */}
            <g data-home aria-hidden>
              <circle cx={hx} cy={hy} r="10" fill="#E2552B" opacity=".45" className="animate-pulse-ring" style={{ transformOrigin: `${hx}px ${hy}px` }} />
              <circle cx={hx} cy={hy} r="8.5" fill="#E2552B" stroke="#fff" strokeWidth="2.5" />
            </g>

            {/* Labels on top */}
            <g aria-hidden style={{ pointerEvents: "none" }}>
              <path d={`M${hx - 4} ${hy + 6} L${hx - 22} ${hy + 18}`} stroke="#E2552B" strokeWidth="2" />
              <rect x={hx - 88} y={hy + 16} rx="8" height="26" width="70" fill="#E2552B" />
              <text x={hx - 53} y={hy + 34} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="var(--font-display)">
                {dict.contact.locationValue.split(",")[0]}
              </text>
              <g key={`l-${selected}`} style={{ animation: "hero-in .4s both" }}>
                <rect x={sel.map[0] + 13} y={sel.map[1] - 15} rx="8" height="30" width={selText.name.length * 9.6 + 24} fill="#FFC65C" />
                <text x={sel.map[0] + 25} y={sel.map[1] + 6} fontSize="16" fontWeight="800" fill="#0A1E2F" fontFamily="var(--font-display)">
                  {selText.name}
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Selected destination card (mobile position: under the map) */}
        <div className="lg:hidden" aria-live="polite">
          <DestinationCard key={selected} id={selected} />
        </div>
      </div>
    </section>
  );
}
