"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/i18n/config";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { GlobeIcon } from "./Icons";

function rememberLocale(l: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

/** Segmented EN / ગુ / हि control. Keeps the current page and section (#hash). */
export function LanguageSwitcher({ tone = "light", size = "md" }: { tone?: "light" | "dark"; size?: "md" | "lg" }) {
  const { locale, dict } = useDictionary();
  const pathname = usePathname() || `/${locale}`;
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const rest = pathname.replace(/^\/(en|gu|hi)(?=\/|$)/, "");
  const dark = tone === "dark";
  const h = size === "lg" ? "min-h-12 px-4 text-base" : "min-h-11 px-3 text-sm";

  return (
    <nav aria-label={dict.nav.language} className="flex items-center gap-1.5">
      <GlobeIcon size={18} className={dark ? "text-white/70" : "text-navy/60"} />
      <ul className={`flex rounded-full p-1 ${dark ? "bg-white/10" : "bg-navy/5"}`}>
        {locales.map((l) => {
          const active = l === locale;
          return (
            <li key={l}>
              <Link
                href={`/${l}${rest}${hash}`}
                hrefLang={l}
                lang={l}
                scroll={false}
                aria-current={active ? "true" : undefined}
                title={localeNames[l].native}
                onClick={() => rememberLocale(l)}
                className={`press flex min-w-11 items-center justify-center rounded-full font-semibold ${h} ${
                  active
                    ? "bg-saffron text-navy-900 shadow-sm"
                    : dark
                      ? "text-white hover:bg-white/10"
                      : "text-navy hover:bg-navy/10"
                }`}
              >
                <span aria-hidden>{localeNames[l].short}</span>
                <span className="sr-only">{localeNames[l].native}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
