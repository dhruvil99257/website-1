# Jay Nejadhari Tours and Travels — Website

Mobile-first website for a Surat-based tours and travels business (own 4–56 seater vehicles, all-India service), in English, Gujarati and Hindi.

## Quick start

Requires Node.js 18.18+ (tested on Node 24).

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /en, /gu or /hi
```

| Script          | What it does                    |
| --------------- | ------------------------------- |
| `npm run dev`   | Development server              |
| `npm run build` | Production build (static pages) |
| `npm run start` | Serve the production build      |
| `npm run lint`  | ESLint                          |

## Environment variables

| Name                   | Purpose                                         | Example                         |
| ---------------------- | ----------------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Live domain, used for SEO, sitemap and canonical links | `https://www.jaynejadhari.com` |

## Where to edit things (no coding knowledge needed for most)

| What                                        | File                                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| Phone / WhatsApp, address, social links, logo | `src/config/site.ts`                                 |
| Fleet categories & seat counts              | `src/config/content.ts` → `fleet`                      |
| Services, destinations, **customer reviews** | `src/config/content.ts`                               |
| All text, in each language                  | `src/i18n/dictionaries/en.ts`, `gu.ts`, `hi.ts`        |
| Photos + their credits                      | `public/images/` and `src/config/photos.ts`            |

### Still needed from the owner (TODO)

- **Logo:** put the file in `public/brand/` and set `logo.src` (and size) in `src/config/site.ts`. Until then a plain text wordmark is shown.
- **Seat counts** for SUVs, Tempo Travellers and Mini Buses (currently "Seating on request").
- **Real vehicle photos.** The current vehicle images are free-licensed *representative* photos and are labelled as such.
- **Street address**, **Google review link** and **social media links** (hidden until filled in).
- **Genuine customer reviews** (the section shows a "coming soon" state while the list is empty).
- **Domain:** set `NEXT_PUBLIC_SITE_URL`.

## How it works

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**, statically pre-rendered for `/en`, `/gu`, `/hi`.
- **Languages:** the URL carries the language. The middleware sends `/` to the visitor's saved choice (cookie) or browser language. Each script uses its own fonts: Baloo 2 + Mukta for English/Hindi, Baloo Bhai 2 + Hind Vadodara for Gujarati.
- **Inquiry form:** validates the input, then opens WhatsApp (`wa.me/91…`) with a formatted message in the visitor's language. No server or database is involved.
- **Animations:** GSAP ScrollTrigger is scrubbed to native scrolling, with no scroll-jacking. The signature road between sections is drawn as you scroll and ends at the inquiry form. Reveals play once. A reduced-motion mode shows everything fully drawn and static.
- **India map:** official boundary outline (DataMeet, CC0) as a lightweight inline SVG.
- **SEO:** per-language metadata with hreflang alternates, `TravelAgency` JSON-LD (verified details only), `sitemap.xml`, `robots.txt`.

## Photo licences

All photos are from Wikimedia Commons / Flickr under free licences (CC0, CC BY, CC BY-SA, public domain). Attribution is shown on the `/credits` page, which the licences require. Keep that page if you keep the photos.

## Folder structure

```
src/
  app/[lang]/        layout (fonts, metadata), home page, credits page
  app/robots.ts, sitemap.ts
  components/        Header, Hero, HeroRoad, RoadConnector, IndiaMap, Fleet,
                     Services, Destinations, WhyUs, Reviews, InquiryForm,
                     Footer, FloatingActions, LanguageSwitcher, ScrollAnimations
  config/            site, content, photos, indiaMap, nav
  i18n/              locales, dictionaries, provider
  lib/               gsap setup, form prefill helper
  middleware.ts      language redirect
public/images/       optimised WebP photos
```
