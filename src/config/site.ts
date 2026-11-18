/**
 * ─────────────────────────────────────────────────────────────
 *  BUSINESS DETAILS — single source of truth.
 *  Edit this file to change contact info, social links, etc.
 *  Never put unverified facts here: leave a field null/empty and
 *  the website will simply hide that piece of UI.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  name: "Jay Nejadhari Tours and Travels",
  shortName: "Jay Nejadhari",

  /** Public URL of the deployed site (used for SEO, sitemap, canonical links).
   *  TODO: set NEXT_PUBLIC_SITE_URL in .env (or replace the fallback) once the domain is live. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com",

  /** Phone shown to visitors and used for tel: links. 10-digit Indian mobile, no spaces. */
  phone: "7567717570",
  /** WhatsApp number (same as phone). Country code is added automatically. */
  whatsapp: "7567717570",
  countryCode: "91",
  /** Text pre-typed in WhatsApp when someone taps a general WhatsApp button.
   *  (WhatsApp never lets a website auto-send – the visitor taps Send.) */
  whatsappGreeting: "Hii",

  location: {
    city: "Surat",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    /** TODO: add the full street address only when the owner confirms it. Leave null to hide. */
    streetAddress: null as string | null,
    postalCode: null as string | null,
  },

  /** Brand logo. Drop the real logo file into /public/brand/ and set its path + size here.
   *  While `src` is null, a neutral text badge is shown instead. */
  logo: {
    src: null as string | null, // e.g. "/brand/logo.png"
    width: 160,
    height: 160,
  },

  /** Social media — leave "" to hide. Add only real, owned accounts. */
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    googleBusiness: "",
  },

  /** Link where customers can leave a Google review. "" hides the button. */
  reviewLink: "",
} as const;

export const telHref = `tel:+${site.countryCode}${site.phone}`;
export const displayPhone = `+${site.countryCode} ${site.phone.slice(0, 5)} ${site.phone.slice(5)}`;

/** Opens the WhatsApp app (or WhatsApp Web on desktop) with "Hii" ready to send. */
export const whatsappHiHref = () => whatsappHref(site.whatsappGreeting);

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.countryCode}${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
