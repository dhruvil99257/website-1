import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { photos } from "@/config/photos";
import { site } from "@/config/site";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft } from "@/components/Icons";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: `${t.credits.title} | ${site.name}`,
    alternates: { canonical: `/${lang}/credits`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/credits`])) },
  };
}

export default async function Credits({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  // One entry per unique photo file
  const unique = Object.values(
    Object.fromEntries(Object.entries(photos).map(([, p]) => [p.src, p])),
  );

  return (
    <div className="min-h-svh bg-cream">
      <header className="border-b border-navy/10 bg-cream">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href={`/${lang}`} className="press flex min-h-11 items-center" aria-label={site.name}>
            <Logo compact />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link href={`/${lang}`} className="press inline-flex min-h-11 items-center gap-2 font-semibold text-navy hover:text-saffron-600">
          <ArrowLeft size={18} /> {t.credits.back}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-4xl">{t.credits.title}</h1>
        <p className="mt-3 max-w-3xl text-muted">{t.credits.intro}</p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {unique.map((p) => (
            <li key={p.src} className="flex gap-4 rounded-2xl bg-white p-3 shadow-[var(--shadow-card)]">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="font-semibold break-words text-navy">{p.credit.title}</p>
                <p className="text-muted">
                  {t.credits.by}: <span className="text-charcoal">{p.credit.author}</span>
                </p>
                <p className="text-muted">
                  {t.credits.license}: <span className="text-charcoal">{p.credit.license}</span>
                  {" · "}
                  <a href={p.credit.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-700 underline underline-offset-2">
                    {t.credits.source}
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">{t.credits.map}</p>
      </main>
    </div>
  );
}
