import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { services } from "@/config/content";
import { displayPhone, site, telHref, whatsappHiHref } from "@/config/site";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_ITEMS } from "@/config/nav";
import { FacebookIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon, YoutubeIcon, MapIcon } from "./Icons";

export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const c = t.contact;
  const socials = [
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: site.social.googleBusiness, label: "Google", Icon: MapIcon },
  ].filter((s) => s.href);

  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-28 sm:px-6 md:pb-14 lg:px-8">
        {/* Contact band */}
        <div className="grid gap-6 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-saffron">{c.eyebrow}</p>
            <h2 id="contact-title" className="mt-1 text-3xl font-extrabold sm:text-4xl">{c.title}</h2>
            <p className="mt-2 text-white/75">{c.intro}</p>
          </div>
          <div className="grid gap-3 min-[400px]:grid-cols-2">
            <a href={telHref} className="press flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-saffron px-4 font-bold text-navy-900 hover:bg-saffron-600">
              <PhoneIcon /> {t.common.callNow}
            </a>
            <a href={whatsappHiHref()} target="_blank" rel="noopener noreferrer" className="press flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 font-bold text-white hover:brightness-110">
              <WhatsAppIcon /> {t.common.whatsapp}
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <dl className="mt-5 space-y-3 text-white/80">
              <div className="flex gap-2.5">
                <PinIcon size={20} className="mt-0.5 shrink-0 text-saffron" />
                <div>
                  <dt className="sr-only">{c.location}</dt>
                  <dd>{site.location.streetAddress ? `${site.location.streetAddress}, ` : ""}{c.locationValue}</dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <PhoneIcon size={20} className="mt-0.5 shrink-0 text-saffron" />
                <div>
                  <dt className="sr-only">{c.phone}</dt>
                  <dd><a href={telHref} className="hover:text-saffron">{displayPhone}</a></dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <WhatsAppIcon size={20} className="mt-0.5 shrink-0 text-saffron" />
                <div>
                  <dt className="sr-only">{c.whatsapp}</dt>
                  <dd><a href={whatsappHiHref()} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">{displayPhone}</a></dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <MapIcon size={20} className="mt-0.5 shrink-0 text-saffron" />
                <div>
                  <dt className="inline text-white/60">{c.serviceArea}: </dt>
                  <dd className="inline">{c.serviceAreaValue}</dd>
                </div>
              </div>
            </dl>
          </div>

          <nav aria-labelledby="f-links">
            <h3 id="f-links" className="text-sm font-bold tracking-wide text-saffron uppercase">{c.quickLinks}</h3>
            <ul className="mt-3 space-y-0.5">
              {NAV_ITEMS.filter((n) => n !== "contact").map((id) => (
                <li key={id}><a href={`/${locale}#${id}`} className="inline-flex min-h-10 items-center text-white/80 hover:text-white">{t.nav[id]}</a></li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-services">
            <h3 id="f-services" className="text-sm font-bold tracking-wide text-saffron uppercase">{c.servicesTitle}</h3>
            <ul className="mt-3 space-y-0.5">
              {services.map((s) => (
                <li key={s.id}><a href={`/${locale}#service-${s.id}`} className="inline-flex min-h-10 items-center text-white/80 hover:text-white">{t.services.items[s.id].title}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold tracking-wide text-saffron uppercase">{c.language}</h3>
            <div className="mt-3"><LanguageSwitcher tone="dark" /></div>
            {socials.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-bold tracking-wide text-saffron uppercase">{c.follow}</h3>
                <ul className="mt-3 flex gap-2">
                  {socials.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="press grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-saffron hover:text-navy-900">
                        <Icon size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div aria-hidden className="mt-14 overflow-hidden">
          <p className="sd-rise-big text-center font-display text-[15vw] leading-[0.9] font-extrabold tracking-tight whitespace-nowrap text-white/[0.07] select-none lg:text-[11.5rem]">
            Jay Nejadhari
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. {c.rights}</p>
          <Link href={`/${locale}/credits`} className="inline-flex min-h-10 items-center hover:text-white">{c.credits}</Link>
        </div>
      </div>
    </footer>
  );
}
