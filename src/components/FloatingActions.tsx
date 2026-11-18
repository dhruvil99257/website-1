"use client";
import { useEffect, useState } from "react";
import { telHref, whatsappHiHref } from "@/config/site";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

/**
 * Phones: a slim bottom bar (Call | WhatsApp) that appears after the hero
 * and hides while the inquiry form or footer (which have their own buttons)
 * are on screen, so it never covers important content.
 * Desktop: two round floating buttons.
 */
export function FloatingActions() {
  const { dict } = useDictionary();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const blockers = ["plan", "contact"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const state = { pastHero: false, blocked: new Set<Element>() };
    const sync = () => setVisible(state.pastHero && state.blocked.size === 0);

    const heroIO = new IntersectionObserver(([e]) => {
      state.pastHero = !e.isIntersecting;
      sync();
    }, { rootMargin: "-40% 0px 0px 0px" });
    if (hero) heroIO.observe(hero);

    const blockIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? state.blocked.add(e.target) : state.blocked.delete(e.target)));
      sync();
    }, { rootMargin: "0px 0px -15% 0px" });
    blockers.forEach((b) => blockIO.observe(b));

    return () => {
      heroIO.disconnect();
      blockIO.disconnect();
    };
  }, []);

  return (
    <>
      {/* Mobile bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] transition-transform duration-300 md:hidden ${
          visible ? "translate-y-0" : "pointer-events-none translate-y-[120%]"
        }`}
        aria-hidden={!visible}
      >
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-2xl bg-white/95 p-1.5 shadow-[0_-4px_30px_rgb(15_42_64/0.25)] ring-1 ring-navy/10">
          <a href={telHref} tabIndex={visible ? 0 : -1} className="press flex min-h-12 items-center justify-center gap-2 rounded-xl bg-saffron font-bold text-navy-900">
            <PhoneIcon size={18} /> {dict.mobileBar.call}
          </a>
          <a href={whatsappHiHref()} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1} className="press flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-bold text-white">
            <WhatsAppIcon size={18} /> {dict.mobileBar.whatsapp}
          </a>
        </div>
      </div>

      {/* Desktop floating buttons */}
      <div
        className={`fixed right-5 bottom-5 z-40 hidden flex-col gap-3 transition-[opacity,transform] duration-300 md:flex ${
          visible ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-hidden={!visible}
      >
        <a href={whatsappHiHref()} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1} aria-label={dict.common.whatsappInquiry}
          className="press grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/25 hover:scale-105">
          <WhatsAppIcon size={26} />
        </a>
        <a href={telHref} tabIndex={visible ? 0 : -1} aria-label={dict.common.callNow}
          className="press grid h-14 w-14 place-items-center rounded-full bg-saffron text-navy-900 shadow-lg shadow-black/25 hover:scale-105">
          <PhoneIcon size={24} />
        </a>
      </div>
    </>
  );
}
