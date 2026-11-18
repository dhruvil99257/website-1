"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { site, telHref, whatsappHiHref } from "@/config/site";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

import { NAV_ITEMS } from "@/config/nav";

export function Header() {
  const { dict, locale } = useDictionary();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) menuBtn.current?.focus();
  }, []);

  // Lock background scroll, close on Escape, keep keyboard focus inside the menu.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close the menu if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-navy"
      >
        {dict.nav.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          solid
            ? "bg-cream/95 shadow-[0_1px_0_rgb(23_61_91/0.08),0_8px_24px_-12px_rgb(23_61_91/0.25)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          <a href={`/${locale}`} className="press -m-1 flex min-h-11 items-center rounded-lg p-1" aria-label={site.name}>
            <Logo light={!solid} compact />
          </a>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={`press rounded-full px-3 py-2.5 text-[0.95rem] font-semibold whitespace-nowrap ${
                      solid ? "text-navy hover:bg-navy/5" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {dict.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageSwitcher tone={solid ? "light" : "dark"} />
            </div>
            <a
              href={telHref}
              className="press hidden min-h-11 items-center gap-2 rounded-full bg-saffron px-4 font-semibold text-navy-900 hover:bg-saffron-600 lg:inline-flex"
            >
              <PhoneIcon size={18} /> {dict.common.callNow}
            </a>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`press inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 font-semibold xl:hidden ${
                solid ? "bg-navy text-white" : "bg-white/15 text-white ring-1 ring-white/30"
              }`}
            >
              {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              <span className="sr-only sm:not-sr-only">{open ? dict.common.close : dict.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menu}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto overscroll-contain bg-cream sm:top-[72px] xl:hidden"
      >
        <div className="mx-auto flex min-h-full max-w-xl flex-col px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <ul className="divide-y divide-navy/10">
            {NAV_ITEMS.map((id, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => close(false)}
                  className="press flex min-h-14 items-center justify-between py-3 text-lg font-semibold text-navy"
                  style={{ animation: open ? `hero-in .4s ${i * 0.035}s both` : undefined }}
                >
                  {dict.nav[id]}
                  <span aria-hidden className="text-saffron-600">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-muted">{dict.nav.language}</p>
            <LanguageSwitcher size="lg" />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
            <a href={telHref} className="press flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-saffron font-bold text-navy-900">
              <PhoneIcon /> {dict.common.callNow}
            </a>
            <a
              href={whatsappHiHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="press flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-whatsapp font-bold text-white"
            >
              <WhatsAppIcon /> {dict.common.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
