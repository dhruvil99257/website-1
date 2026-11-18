import type { Dictionary } from "@/i18n/dictionaries/en";
import { reviews } from "@/config/content";
import { site, whatsappHref } from "@/config/site";
import { SectionHeading } from "./SectionHeading";
import { ChatIcon, StarIcon, WhatsAppIcon } from "./Icons";

/**
 * Shows genuine reviews from src/config/content.ts.
 * While the list is empty, a friendly "coming soon" state invites real feedback.
 */
export function Reviews({ t }: { t: Dictionary }) {
  const r = t.reviews;
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-sand/60 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="reviews-title" eyebrow={r.eyebrow} title={r.title} />

        {reviews.length > 0 ? (
          <ul className="h-scroll -mx-4 mt-8 gap-4 px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
            {reviews.map((rev, i) => (
              <li key={i} data-reveal className="w-[85vw] max-w-[360px] shrink-0 md:w-auto md:max-w-none">
                <figure className="flex h-full flex-col rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
                  {rev.rating && (
                    <div className="flex gap-0.5 text-saffron" aria-label={`${rev.rating} / 5`}>
                      {Array.from({ length: rev.rating }).map((_, s) => (
                        <StarIcon key={s} size={18} />
                      ))}
                    </div>
                  )}
                  <blockquote className="mt-3 flex-1 text-charcoal">“{rev.text}”</blockquote>
                  <figcaption className="mt-4 font-semibold text-navy">
                    {rev.name}
                    {rev.place && <span className="font-normal text-muted"> · {rev.place}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div data-reveal className="mt-8 flex flex-col items-start gap-5 rounded-[var(--radius-card)] border-2 border-dashed border-navy/15 bg-white/70 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700">
              <ChatIcon size={30} />
            </span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-navy">{r.emptyTitle}</h3>
              <p className="mt-1 max-w-2xl text-muted">{r.emptyText}</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <a
                href={whatsappHref(r.shareMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 font-bold text-white"
              >
                <WhatsAppIcon /> {r.shareCta}
              </a>
              {site.reviewLink && (
                <a href={site.reviewLink} target="_blank" rel="noopener noreferrer" className="press inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold text-navy ring-1 ring-navy/20">
                  {r.googleCta}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
