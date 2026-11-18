import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/config/site";
import { photos } from "@/config/photos";
import { services } from "@/config/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { IndiaMap } from "@/components/IndiaMap";
import { Fleet } from "@/components/Fleet";
import { Services } from "@/components/Services";
import { Destinations } from "@/components/Destinations";
import { WhyUs } from "@/components/WhyUs";
import { Reviews } from "@/components/Reviews";
import { InquiryForm } from "@/components/InquiryForm";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { RoadConnector } from "@/components/RoadConnector";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { ScrollProgress } from "@/components/ScrollProgress";
import { IntroCurtain } from "@/components/IntroCurtain";
import { Seasons } from "@/components/Seasons";
import { Marquee, KineticBand } from "@/components/Marquee";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  // Structured data: verified details only (no ratings, no street address until confirmed).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: `${site.url}/${lang}`,
    telephone: `+${site.countryCode}${site.phone}`,
    image: `${site.url}${photos.hero.src}`,
    description: t.meta.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.state,
      addressCountry: site.location.countryCode,
      ...(site.location.streetAddress ? { streetAddress: site.location.streetAddress } : {}),
      ...(site.location.postalCode ? { postalCode: site.location.postalCode } : {}),
    },
    areaServed: { "@type": "Country", name: "India" },
    availableLanguage: ["English", "Gujarati", "Hindi"],
    priceRange: "Per km",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: t.services.items[s.id].title, description: t.services.items[s.id].desc },
      })),
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${site.countryCode}${site.phone}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Gujarati", "Hindi"],
    },
    sameAs: Object.values(site.social).filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <IntroCurtain />
      <ScrollProgress />
      <Header />
      <main id="main" className="overflow-x-clip">
        <Hero t={t} />
        <Marquee t={t} />

        {/* The signature road: it is laid as you scroll and leads all the way to the inquiry form. */}
        <div className="bg-cream">
          <RoadConnector direction="ltr" vehicle="car" landmarks={[{ at: 0.3, icon: "city" }, { at: 0.72, icon: "camel" }]} />
        </div>
        <IndiaMap />
        <Seasons />
        <div className="bg-[linear-gradient(var(--color-cream),color-mix(in_srgb,var(--color-sand)_60%,var(--color-cream)))]">
          <RoadConnector direction="rtl" vehicle="bus" landmarks={[{ at: 0.28, icon: "mountain" }, { at: 0.7, icon: "temple" }]} />
        </div>
        <Fleet />
        <div className="bg-[linear-gradient(color-mix(in_srgb,var(--color-sand)_60%,var(--color-cream)),var(--color-cream))]">
          <RoadConnector direction="ltr" vehicle="car" landmarks={[{ at: 0.35, icon: "palm" }, { at: 0.75, icon: "boat" }]} />
        </div>
        <Services />
        <Destinations />
        <WhyUs t={t} />
        <KineticBand text={t.hero.title} sub={t.hero.pass.toValue} />
        <Reviews t={t} />
        <div className="bg-[linear-gradient(color-mix(in_srgb,var(--color-sand)_60%,var(--color-cream))_0%,var(--color-navy)_100%)]">
          <RoadConnector direction="rtl" vehicle="bus" finish landmarks={[{ at: 0.3, icon: "temple" }, { at: 0.62, icon: "palm" }]} label={t.plan.title} />
        </div>
        <InquiryForm />
      </main>
      <Footer t={t} locale={lang} />
      <FloatingActions />
      <ScrollAnimations />
    </>
  );
}
