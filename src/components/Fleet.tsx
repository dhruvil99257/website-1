"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fleet, type Seats } from "@/config/content";
import { photos } from "@/config/photos";
import { telHref } from "@/config/site";
import { fmt, useDictionary } from "@/i18n/DictionaryProvider";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { prefillInquiry } from "@/lib/prefill";
import { SectionHeading } from "./SectionHeading";
import { ArrowRight, CloseIcon, PhoneIcon, SeatIcon } from "./Icons";

type FleetItem = (typeof fleet)[number];

export function seatsLabel(s: Seats, t: Dictionary["fleet"]) {
  if (!s) return t.seatsOnRequest;
  return "exact" in s ? fmt(t.seats, s.exact) : fmt(t.upTo, s.upTo);
}

/** Subtle 3D tilt that follows the mouse (desktop pointers only). */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

function FleetCard({ item, onDetails }: { item: FleetItem; onDetails: () => void }) {
  const { dict } = useDictionary();
  const t = dict.fleet;
  const text = t.items[item.id];
  const ref = useTilt<HTMLElement>();
  const photo = photos[item.photo];

  return (
    <article
      ref={ref}
      data-tilt-in
      className="card-premium shine group flex w-[80vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[var(--shadow-lift)] md:w-auto md:max-w-none"
    >
      <div className="relative m-2 mb-0 aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-6px)] bg-sand">
        <div className="sd-parallax absolute inset-0">
          <Image
            src={photo.src}
            alt={`${text.name} – ${dict.common.representative}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 80vw"
            className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.08]"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_30_47/0.45),transparent_40%)]" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-navy shadow">
          <SeatIcon size={16} className="text-saffron-600" /> {seatsLabel(item.seats, t)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.35rem] font-extrabold text-navy">{text.name}</h3>
        <p className="mt-1.5 flex-1 text-[0.95rem] text-muted">{text.desc}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
          <button
            type="button"
            onClick={onDetails}
            className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-navy ring-1 ring-navy/20 hover:bg-navy/5"
          >
            {dict.common.viewDetails}
          </button>
          <button
            type="button"
            onClick={() => prefillInquiry({ seating: item.id })}
            className="press inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-saffron px-3 text-sm font-bold text-navy-900 hover:bg-saffron-600"
          >
            {dict.common.enquire} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Fleet() {
  const { dict } = useDictionary();
  const t = dict.fleet;
  const [active, setActive] = useState<FleetItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (active && !d.open) d.showModal();
    if (!active && d.open) d.close();
  }, [active]);

  const text = active ? t.items[active.id] : null;

  return (
    <section id="fleet" aria-labelledby="fleet-title" className="relative overflow-hidden bg-sand/60 py-16 sm:py-24">
      <div className="bg-jaali absolute inset-0" aria-hidden />
      <div aria-hidden className="absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-saffron/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="fleet-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <div className="h-scroll -mx-4 mt-10 gap-4 px-4 pt-2 pb-6 [perspective:1200px] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3 xl:grid-cols-5">
          {fleet.map((item) => (
            <FleetCard key={item.id} item={item} onDetails={() => setActive(item)} />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted" data-reveal>
          ⓘ {t.note}
        </p>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === e.currentTarget && setActive(null)}
        aria-labelledby="fleet-dialog-title"
        className="m-auto w-[min(92vw,560px)] overflow-hidden rounded-3xl bg-white p-0 text-charcoal shadow-2xl backdrop:bg-navy-900/70"
      >
        {active && text && (
          <div className="max-h-[88svh] overflow-y-auto">
            <div className="relative aspect-[16/10] bg-sand">
              <Image src={photos[active.photo].src} alt={`${text.name} – ${dict.common.representative}`} fill sizes="560px" className="object-cover" />
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label={dict.common.close}
                className="press absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-navy shadow"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-saffron-100 px-3 py-1 text-sm font-bold text-navy">
                <SeatIcon size={16} /> {seatsLabel(active.seats, t)}
              </p>
              <h3 id="fleet-dialog-title" className="mt-3 text-2xl font-extrabold text-navy">
                {text.name}
              </h3>
              <p className="mt-2 text-muted">{text.desc}</p>
              <p className="mt-4 text-sm font-semibold text-green-700">{t.idealFor}</p>
              <p className="text-charcoal">{text.ideal}</p>
              <p className="mt-4 rounded-xl bg-cream px-3 py-2 text-sm text-muted">ⓘ {dict.common.representative}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href={telHref} className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl font-semibold text-navy ring-1 ring-navy/20">
                  <PhoneIcon size={18} /> {dict.common.callNow}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const id = active.id;
                    setActive(null);
                    requestAnimationFrame(() => prefillInquiry({ seating: id }));
                  }}
                  className="press min-h-12 rounded-xl bg-saffron font-bold text-navy-900"
                >
                  {dict.common.enquire}
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
