import Image from "next/image";
import { site } from "@/config/site";

/**
 * Uses the business logo from site.logo.src when provided.
 * Until the real logo file is added, shows a plain text wordmark
 * (no invented symbol, so the brand identity is not altered).
 */
export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  if (site.logo.src) {
    return (
      <Image src={site.logo.src} alt={site.name} width={site.logo.width} height={site.logo.height}
        className={compact ? "h-10 w-auto" : "h-14 w-auto"} priority />
    );
  }
  return (
    <span className="flex flex-col leading-none" aria-label={site.name}>
      <span className={`font-display text-[1.15rem] font-extrabold tracking-tight sm:text-xl ${light ? "text-white" : "text-navy"}`}>
        Jay Nejadhari
      </span>
      <span className={`mt-0.5 text-[0.62rem] font-semibold tracking-[0.18em] uppercase ${light ? "text-saffron" : "text-saffron-600"}`}>
        Tours &amp; Travels
      </span>
    </span>
  );
}
