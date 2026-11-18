"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { services } from "@/config/content";
import { photos } from "@/config/photos";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { prefersReducedMotion, prefillInquiry } from "@/lib/prefill";
import { SectionHeading } from "./SectionHeading";
import { ArrowLeft, ArrowRight } from "./Icons";

/**
 * Services as a swipeable story-style row (native touch scrolling + snap).
 * Cards gently scale/dim depending on how centred they are, and a progress
 * bar shows how far along the row you are.
 */
export function Services() {
  const { dict } = useDictionary();
  const t = dict.services;
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = el.scrollWidth - el.clientWidth;
        const p = max > 0 ? el.scrollLeft / max : 0;
        if (bar.current) bar.current.style.transform = `scaleX(${0.12 + p * 0.88})`;
        setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft >= max - 8 });
        if (prefersReducedMotion()) return;
        const box = el.getBoundingClientRect();
        el.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
          const r = c.getBoundingClientRect();
          const off = Math.min(1, Math.abs(r.left + r.width / 2 - (box.left + box.width / 2)) / box.width);
          c.style.transform = `scale(${(1 - off * 0.08).toFixed(3)})`;
          c.style.opacity = String((1 - off * 0.35).toFixed(3));
        });
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section id="services" aria-labelledby="services-title" className="relative overflow-hidden bg-cream py-16 sm:py-24">
      <div aria-hidden className="absolute top-20 -right-32 h-96 w-96 rounded-full bg-green/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="services-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => scrollBy(-1)} disabled={edge.start} aria-label={dict.destinations.prev}
              className="press grid h-12 w-12 place-items-center rounded-full bg-white text-navy shadow ring-1 ring-navy/10 hover:bg-sand disabled:opacity-40">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => scrollBy(1)} disabled={edge.end} aria-label={dict.destinations.next}
              className="press grid h-12 w-12 place-items-center rounded-full bg-navy text-white shadow hover:bg-navy-700 disabled:opacity-40">
              <ArrowRight />
            </button>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted md:hidden" aria-hidden>
          <span className="inline-block animate-[float_2.4s_ease-in-out_infinite]">👉</span> {dict.destinations.swipeHint}
        </p>
      </div>

      <ul ref={track} className="h-scroll relative mx-auto mt-6 max-w-7xl gap-4 px-4 pt-2 pb-6 sm:px-6 lg:px-8" aria-label={t.title} tabIndex={0}>
        {services.map((s, i) => {
          const text = t.items[s.id];
          return (
            <li key={s.id} id={`service-${s.id}`} className="w-[78vw] max-w-[300px] shrink-0 scroll-mt-24 sm:w-[300px]">
              <article
                data-card
                className="card-premium shine group flex h-full flex-col overflow-hidden rounded-[28px] shadow-[var(--shadow-card)] transition-[transform,opacity,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[var(--shadow-lift)]"
              >
                <div className="relative m-2 mb-0 h-[230px] overflow-hidden rounded-[22px] bg-sand">
                  <Image
                    src={photos[s.photo].src}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.08]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_30_47/0.55),transparent_45%)]" />
                  <span aria-hidden className="absolute top-3 left-4 font-display text-5xl leading-none font-extrabold text-white drop-shadow-[0_4px_12px_rgb(0_0_0/0.5)]">
                    <span className="text-outline">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[1.35rem] leading-tight font-extrabold text-navy">{text.title}</h3>
                  <p className="mt-1.5 flex-1 text-[0.95rem] text-muted">{text.desc}</p>
                  <button
                    type="button"
                    onClick={() => prefillInquiry({ tripType: s.id })}
                    className="press mt-4 inline-flex min-h-12 items-center justify-between gap-2 rounded-2xl bg-navy pr-1.5 pl-5 text-sm font-bold text-white hover:bg-navy-700"
                  >
                    {dict.common.enquire}
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron text-navy-900 transition-transform group-hover:-rotate-45">
                      <ArrowRight size={18} />
                    </span>
                  </button>
                </div>
              </article>
            </li>
          );
        })}
        <li aria-hidden className="w-1 shrink-0" />
      </ul>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-hidden>
        <div className="h-1 overflow-hidden rounded-full bg-navy/10">
          <div ref={bar} className="h-full origin-left scale-x-[0.12] rounded-full bg-[linear-gradient(90deg,#e2552b,#f3a43b,#ffc65c)] transition-transform duration-200" />
        </div>
      </div>
    </section>
  );
}
