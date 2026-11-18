/**
 * Section title with:
 *  - an eyebrow label,
 *  - words that rise from a mask one by one (GSAP, see ScrollAnimations),
 *  - the last word painted in the saffron gradient.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  center = false,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
  center?: boolean;
  id?: string;
}) {
  const words = title.split(" ");
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p
        data-reveal
        className={`mb-3 inline-flex items-center gap-2.5 rounded-full px-3 py-1 text-sm font-bold tracking-wide ${
          light ? "bg-white/10 text-marigold ring-1 ring-white/15" : "bg-saffron-100 text-navy ring-1 ring-saffron/30"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-saffron-600" aria-hidden>
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
        </svg>
        {eyebrow}
      </p>
      <h2
        id={id}
        data-split
        className={`text-[2rem] leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-[3.4rem] ${light ? "text-white" : "text-navy"}`}
      >
        {words.map((w, i) => (
          <span key={i} className="word-mask mr-[0.22em] last:mr-0">
            <span className={`word ${i === words.length - 1 ? (light ? "text-gradient" : "text-gradient-navy") : ""}`}>{w}</span>
          </span>
        ))}
      </h2>
      {intro && (
        <p data-reveal className={`mt-4 text-base sm:text-lg ${light ? "text-white/75" : "text-muted"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
