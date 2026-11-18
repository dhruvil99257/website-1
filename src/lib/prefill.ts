/** Fill parts of the inquiry form from anywhere on the page, then scroll to it. */
export type PrefillData = { tripType?: string; seating?: string; destination?: string };
export const PREFILL_EVENT = "jn:prefill";

export function prefillInquiry(data: PrefillData) {
  window.dispatchEvent(new CustomEvent<PrefillData>(PREFILL_EVENT, { detail: data }));
  document.getElementById("plan")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
