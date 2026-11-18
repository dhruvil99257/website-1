import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { photos, type PhotoKey } from "@/config/photos";
import { telHref, whatsappHiHref } from "@/config/site";
import { HeroRoad } from "./HeroRoad";
import { ArrowRight, CheckIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

const SLIDES: PhotoKey[] = ["hero", "jaipur", "kashmir", "kerala", "ladakh"];

/** Splits "Your Journey, Our Responsibility." into the plain part and the highlighted part. */
function splitTitle(title: string) {
  const i = title.search(/[,،]/);
  if (i === -1) return { a: "", b: title };
  return { a: title.slice(0, i + 1), b: title.slice(i + 1).trim() };
}

export function Hero({ t }: { t: Dictionary }) {
  const { a, b } = splitTitle(t.hero.title);
  let w = 0; // running word index for stagger

  const Words = ({ text, className = "" }: { text: string; className?: string }) => (
    <>
      {text.split(" ").map((word, i) => {
        const delay = 0.15 + w++ * 0.09;
        return (
          <span key={i} className="word-mask mr-[0.22em]">
            <span className={`word ${className}`} style={{ animation: `word-up .9s cubic-bezier(.2,.75,.15,1) calc(var(--intro-delay, 0s) + ${delay}s) both` }}>
              {word}
            </span>
          </span>
        );
      })}
    </>
  );

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 text-white">
      {/* Ken-Burns slideshow of Indian landscapes */}
      <div className="sd-hero-zoom absolute inset-0 -z-20" aria-hidden>
        {SLIDES.map((key, i) => (
          <div key={key} className="kb-slide absolute inset-0" style={{ animationDelay: `${i * 6 - 1.2}s` }}>
            <Image
              src={photos[key].src}
              alt=""
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="100vw"
              quality={65}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Cinematic wash + glows */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_30_47/0.78)_0%,rgb(10_30_47/0.45)_45%,rgb(10_30_47/0.92)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_40%,rgb(10_30_47/0.65),transparent_60%)]" />
      <div aria-hidden className="absolute -top-32 -right-24 -z-10 h-96 w-96 rounded-full bg-saffron/30 blur-3xl" style={{ animation: "glow-pulse 6s ease-in-out infinite" }} />
      <div aria-hidden className="bg-jaali-light absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(180deg,#000,transparent_70%)]" />

      <div className="sd-hero-exit mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pt-24 pb-[150px] sm:px-6 sm:pt-28 sm:pb-[180px] lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
        <div className="max-w-3xl">
          <p className="hero-in mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-marigold ring-1 ring-white/20 backdrop-blur-sm" style={{ animationDelay: "calc(var(--intro-delay, 0s) + 0.05s)" }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-saffron" />
            </span>
            {t.hero.eyebrow}
          </p>

          <h1 id="hero-title" className="text-[2.6rem] leading-[1.02] font-extrabold tracking-tight min-[390px]:text-[2.9rem] sm:text-7xl lg:text-[5.4rem]">
            {a && (
              <span className="block">
                <Words text={a} />
              </span>
            )}
            <span className="relative inline-block">
              <Words text={b} className="text-gradient" />
              <svg className="swash absolute -bottom-3 left-0 h-4 w-full sm:-bottom-4 sm:h-5" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden>
                <path d="M3 14 C 70 4, 150 4, 297 12" pathLength={1} fill="none" stroke="#F3A43B" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="hero-in mt-6 max-w-xl text-lg text-white/85 sm:text-xl" style={{ animationDelay: "calc(var(--intro-delay, 0s) + 0.55s)" }}>
            {t.hero.subtitle}
          </p>

          <div className="hero-in mt-8 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap" style={{ animationDelay: "calc(var(--intro-delay, 0s) + 0.65s)" }}>
            <a
              href={telHref}
              className="press group relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-saffron px-5 text-base font-bold text-navy-900 shadow-[0_12px_30px_-8px_rgb(243_164_59/0.7)] hover:bg-marigold sm:px-8"
            >
              <PhoneIcon /> {t.common.callNow}
            </a>
            <a
              href={whatsappHiHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 text-base font-bold text-white ring-1 ring-white/30 backdrop-blur-sm hover:bg-whatsapp hover:ring-whatsapp sm:px-8"
            >
              <WhatsAppIcon className="text-[#3fd17a]" /> {t.common.whatsappInquiry}
            </a>
          </div>

          <ul className="hero-in mt-7 hidden flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-medium text-white/90 sm:flex" style={{ animationDelay: "calc(var(--intro-delay, 0s) + 0.8s)" }}>
            {t.hero.chips.map((c) => (
              <li key={c} className="flex items-center gap-1.5">
                <CheckIcon size={18} className="text-saffron" /> {c}
              </li>
            ))}
          </ul>
        </div>

        <TravelPass t={t} />
      </div>

      {/* slide indicator */}
      <div aria-hidden className="absolute right-4 bottom-[136px] hidden gap-1.5 sm:bottom-[168px] sm:flex lg:right-8">
        {SLIDES.map((k) => (
          <span key={k} className="h-1 w-6 rounded-full bg-white/30" />
        ))}
      </div>

      <HeroRoad />
    </section>
  );
}

/** Boarding-pass style card summarising the offer. */
function TravelPass({ t }: { t: Dictionary }) {
  const p = t.hero.pass;
  return (
    <div className="hero-in mx-auto w-full max-w-[380px] lg:mx-0 lg:justify-self-end" style={{ animationDelay: "calc(var(--intro-delay, 0s) + 0.9s)" }}>
      <div className="ticket">
        <div className="ticket-notch overflow-hidden rounded-[26px] bg-cream text-charcoal shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]">
          <div className="flex items-center justify-between bg-navy px-5 py-3 text-white">
            <span className="font-display text-sm font-bold tracking-[0.2em] uppercase">{p.label}</span>
            <span className="rounded-full bg-saffron px-2.5 py-0.5 text-xs font-bold text-navy-900">JN · 4–56</span>
          </div>

          <div className="px-5 pt-4 pb-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-semibold tracking-wider text-muted uppercase">{p.from}</p>
                <p className="font-display text-2xl leading-tight font-extrabold text-navy">{p.fromValue}</p>
              </div>
              <div className="text-right">
                <p className="text-[0.7rem] font-semibold tracking-wider text-muted uppercase">{p.to}</p>
                <p className="font-display text-lg leading-tight font-extrabold text-navy">{p.toValue}</p>
              </div>
            </div>
            {/* animated route */}
            <div className="relative mt-2 h-8">
              <svg viewBox="0 0 200 28" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
                <path d="M4 14 C 60 -6, 120 34, 196 14" fill="none" stroke="#173D5B" strokeOpacity=".35" strokeWidth="2" strokeDasharray="4 5" />
                <circle cx="4" cy="14" r="4" fill="#E2552B" />
                <circle cx="196" cy="14" r="4" fill="#4D8865" />
              </svg>
              <svg viewBox="0 0 200 28" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                <g className="route-bus">
                  <g transform="translate(-9 -6)">
                    <rect width="18" height="10" rx="2.5" fill="#F3A43B" stroke="#173D5B" strokeWidth="1.2" />
                    <rect x="12" y="2" width="4" height="3.5" rx=".8" fill="#DDEBF5" />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div className="mx-5 border-t-2 border-dashed border-navy/15" />

          <dl className="grid grid-cols-2 gap-3 px-5 py-4">
            <div>
              <dt className="text-[0.7rem] font-semibold tracking-wider text-muted uppercase">{p.vehicle}</dt>
              <dd className="font-display text-lg font-bold text-navy">{p.vehicleValue}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold tracking-wider text-muted uppercase">{p.fare}</dt>
              <dd className="font-display text-lg font-bold text-navy">{p.fareValue}</dd>
            </div>
          </dl>

          <div className="flex items-center justify-between gap-3 bg-sand/70 px-5 py-3">
            {/* decorative barcode */}
            <svg viewBox="0 0 90 26" className="h-7 w-24 shrink-0" aria-hidden>
              {[0, 3, 5, 9, 11, 14, 18, 20, 23, 27, 29, 33, 35, 38, 42, 45, 47, 51, 54, 56, 60, 63, 66, 68, 72, 75, 78, 81, 84, 87].map((x, i) => (
                <rect key={x} x={x} y="0" width={i % 3 === 0 ? 2 : 1} height="26" fill="#242A30" />
              ))}
            </svg>
            <a href="#plan" className="press inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-navy px-3.5 text-sm font-bold text-white hover:bg-navy-700">
              {p.cta} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
