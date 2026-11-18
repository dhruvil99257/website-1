import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Baloo_2, Baloo_Bhai_2, Mukta, Hind_Vadodara } from "next/font/google";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { site } from "@/config/site";
import { photos } from "@/config/photos";

/* Fonts: each script gets a font designed for it. Browsers only download
   the unicode subsets actually used on the page. */
const baloo = Baloo_2({ subsets: ["latin", "devanagari"], variable: "--font-baloo", display: "swap", preload: false });
const balooBhai = Baloo_Bhai_2({ subsets: ["latin", "gujarati"], variable: "--font-baloobhai", display: "swap", preload: false });
const mukta = Mukta({ subsets: ["latin", "devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-mukta", display: "swap", preload: false });
const hindVadodara = Hind_Vadodara({ subsets: ["latin", "gujarati"], weight: ["400", "500", "600", "700"], variable: "--font-hindvad", display: "swap", preload: false });

const fontsFor = (l: Locale) =>
  l === "gu"
    ? { cls: `${balooBhai.variable} ${hindVadodara.variable}`, display: "var(--font-baloobhai)", body: "var(--font-hindvad)" }
    : { cls: `${baloo.variable} ${mukta.variable}`, display: "var(--font-baloo)", body: "var(--font-mukta)" };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#173D5B",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: { en: "en_IN", gu: "gu_IN", hi: "hi_IN" }[lang],
      images: [{ url: photos.hero.src, width: photos.hero.width, height: photos.hero.height }],
    },
    formatDetection: { telephone: true },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const f = fontsFor(lang);

  return (
    <html
      lang={lang}
      className={f.cls}
      style={{ ["--font-display-l" as string]: f.display, ["--font-body-l" as string]: f.body }}
      suppressHydrationWarning
    >
      <head>
        {/* Hide reveal-on-scroll elements only when JS + motion are available; un-hide if GSAP never boots. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var ss=sessionStorage;if(ss.getItem('jn_intro'))document.documentElement.classList.add('seen-intro');else ss.setItem('jn_intro','1')}catch(e){document.documentElement.classList.add('seen-intro')}try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('js-anim');setTimeout(function(){if(!window.__jnAnim)d.classList.remove('js-anim')},3500)}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <DictionaryProvider dict={dict} locale={lang}>
          {children}
        </DictionaryProvider>
      </body>
    </html>
  );
}
