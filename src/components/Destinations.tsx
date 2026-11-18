"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { destinationPhotos, destinations, destinationTags, type DestinationTag } from "@/config/content";
import { fmt, useDictionary } from "@/i18n/DictionaryProvider";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion, prefillInquiry } from "@/lib/prefill";
import { SectionHeading } from "./SectionHeading";
import { PhotoCarousel } from "./PhotoCarousel";
import { ArrowLeft, ArrowRight, PinIcon } from "./Icons";

type Filter = "all" | DestinationTag;

/**
 * Destination gallery.
 *  - Phones/tablets: native horizontal swipe (scroll-snap) with in-card parallax.
 *  - Desktop (≥1024px): the section pins and the cards travel sideways as you
 *    scroll down – driven by GSAP ScrollTrigger, scrubbed to native scroll.
 */
export function Destinations() {
  const { dict } = useDictionary();
  const t = dict.destinations;
  const [filter, setFilter] = useState<Filter>("all");
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const list = useMemo(
    () => (filter === "all" ? destinations : destinations.filter((d) => (d.tags as readonly string[]).includes(filter))),
    [filter],
  );

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  // Native-scroll mode: arrow state + in-card parallax.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollLeft = 0;
    update();
    let raf = 0;
    const onScroll = () => {
      update();
      if (prefersReducedMotion()) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const desktop = window.matchMedia("(min-width: 1024px)").matches; // pinned mode handles motion there
        const box = el.getBoundingClientRect();
        el.querySelectorAll<HTMLElement>("[data-px]").forEach((img) => {
          if (desktop) {
            img.style.transform = "scale(1.18)";
            return;
          }
          const r = img.parentElement!.getBoundingClientRect();
          const offset = Math.max(-1, Math.min(1, (r.left + r.width / 2 - (box.left + box.width / 2)) / box.width));
          img.style.transform = `translate3d(${(-offset * 8).toFixed(2)}%,0,0) scale(1.18)`;
        });
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [update, list]);

  // Desktop: pinned horizontal travel.
  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const sec = section.current;
      if (!el || !sec) return;
      el.style.overflowX = "visible";
      el.scrollLeft = 0;
      const dist = () => Math.max(0, el.scrollWidth - el.clientWidth);
      const tween = gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${Math.round(dist() * 0.55)}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => bar.current && (bar.current.style.transform = `scaleX(${self.progress})`),
        },
      });
      // Load every card photo just before the section arrives (they sit off-screen sideways).
      ScrollTrigger.create({
        trigger: sec,
        start: "top 250%",
        once: true,
        onEnter: () => el.querySelectorAll("img").forEach((img) => (img.loading = "eager")),
      });
      // Cards fan in as they travel into view.
      el.querySelectorAll<HTMLElement>("li[data-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { rotateY: -18, scale: 0.92, opacity: 0.5 },
          {
            rotateY: 0, scale: 1, opacity: 1, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 65%", scrub: true },
          },
        );
      });
      return () => {
        el.style.overflowX = "";
        gsap.set(el, { clearProps: "transform" });
      };
    });
    // Positions below this section change when its pin length changes.
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [list]);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section
      ref={section}
      id="destinations"
      aria-labelledby="destinations-title"
      className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-24 lg:pb-10"
    >
      <div aria-hidden className="bg-jaali-light absolute inset-0 opacity-70" />
      <div aria-hidden className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-saffron/15 blur-3xl" />
      <div aria-hidden className="absolute -top-40 right-0 h-[24rem] w-[24rem] rounded-full bg-green/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="destinations-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} light />
          <div className="hidden gap-2 md:flex lg:hidden">
            <button type="button" onClick={() => scrollBy(-1)} disabled={edge.start} aria-label={t.prev}
              className="press grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 disabled:opacity-40">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => scrollBy(1)} disabled={edge.end} aria-label={t.next}
              className="press grid h-12 w-12 place-items-center rounded-full bg-saffron text-navy-900 hover:bg-white disabled:opacity-40">
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-scroll fade-x -mx-4 flex-1 gap-2 px-4 py-1 sm:mx-0 sm:px-0" role="group" aria-label={t.title}>
            {(["all", ...destinationTags] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`press shrink-0 rounded-full px-4 py-2.5 text-sm font-bold ring-1 ${
                  filter === f ? "bg-saffron text-navy-900 ring-saffron" : "bg-white/5 text-white ring-white/20 hover:bg-white/15"
                }`}
              >
                {t.filters[f]}
              </button>
            ))}
          </div>
          <span className="hidden shrink-0 text-sm text-white/60 sm:block" aria-live="polite">
            {fmt(t.count, list.length)}
          </span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-white/60 md:hidden" aria-hidden>
          <span className="inline-block animate-[float_2.4s_ease-in-out_infinite]">👉</span> {t.swipeHint}
        </p>
      </div>

      <ul
        ref={track}
        key={filter}
        className="h-scroll relative mx-auto mt-6 w-full max-w-7xl gap-4 px-4 pb-4 [perspective:1400px] sm:gap-5 sm:px-6 lg:mt-8 lg:px-8"
        aria-label={t.title}
        tabIndex={0}
      >
        {list.map((d, i) => {
          const text = t.items[d.id];
          return (
            <li key={d.id} data-card className="w-[78vw] max-w-[310px] shrink-0 sm:w-[310px] lg:w-[330px] lg:max-w-none">
              <article style={{ animation: `hero-in .6s ${Math.min(i, 6) * 0.06}s both` }} className="shine group relative isolate flex h-[440px] flex-col justify-end overflow-hidden rounded-[28px] bg-navy-900 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.8)] ring-1 ring-white/10 transition-[box-shadow,transform] duration-500 hover:shadow-[var(--shadow-glow)] lg:h-[min(440px,60svh)]">
                <div className="absolute inset-0 -z-20 overflow-hidden">
                  <PhotoCarousel
                    keys={destinationPhotos(d.id)}
                    alt={`${text.name}, ${text.region}`}
                    sizes="(min-width: 1024px) 330px, 310px"
                    offset={(i % 4) * 700}
                    dotLabel={dict.common.photo}
                    focus={"focus" in d ? d.focus : undefined}
                    imgProps={{ "data-px": "", style: { transform: "scale(1.18)" } } as React.HTMLAttributes<HTMLDivElement>}
                  />
                </div>
                <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_30_47/0.35)_0%,transparent_28%,transparent_40%,rgb(10_30_47/0.95)_100%)]" />

                <div className="pointer-events-none absolute inset-x-4 top-10 flex items-start justify-between">
                  <span className="rounded-full bg-black/30 px-2.5 py-1 font-display text-xs font-bold tracking-wider ring-1 ring-white/20 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                  </span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {d.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/90 px-2 py-0.5 text-[0.7rem] font-bold text-navy">{t.filters[tag]}</span>
                    ))}
                  </span>
                </div>

                <div className="p-5">
                  <p className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-marigold uppercase">
                    <PinIcon size={14} /> {text.region}
                  </p>
                  <h3 className="mt-1 text-[1.7rem] leading-tight font-extrabold">{text.name}</h3>
                  <p className="mt-1.5 text-sm text-white/80">{text.desc}</p>
                  <button
                    type="button"
                    onClick={() => prefillInquiry({ destination: text.name })}
                    className="press mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-bold text-navy group-hover:bg-saffron group-hover:text-navy-900"
                  >
                    {dict.common.planTrip} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            </li>
          );
        })}
        <li aria-hidden className="w-1 shrink-0" />
      </ul>

      {/* Desktop travel progress */}
      <div className="relative mx-auto mt-4 hidden w-full max-w-7xl px-8 lg:block" aria-hidden>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div ref={bar} className="h-full origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,#e2552b,#f3a43b,#ffc65c)]" />
        </div>
      </div>
    </section>
  );
}
