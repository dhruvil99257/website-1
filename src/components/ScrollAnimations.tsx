"use client";
import { useEffect } from "react";
import { getGsap } from "@/lib/gsap";

/**
 * Page-wide scroll choreography (GSAP + ScrollTrigger), always on top of
 * NATIVE scrolling – nothing here pins on phones or hijacks the wheel.
 *  - [data-split] headings: words rise out of a mask, one after another.
 *  - [data-reveal]: staggered fade-up in batches, played once.
 *  - [data-tilt-in]: cards flip up from a 3D tilt, played once.
 * CSS scroll-driven effects (parallax, unmask, marquee…) live in globals.css.
 */
export function ScrollAnimations() {
  useEffect(() => {
    (window as Window & { __jnAnim?: boolean }).__jnAnim = true;
    const root = document.documentElement;
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Split headings
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((h) => {
        const words = h.querySelectorAll(".word");
        gsap.set(words, { y: 0, yPercent: 115, rotate: 4 });
        ScrollTrigger.create({
          trigger: h,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.07 }),
        });
      });

      // 2. Fade-up reveals
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(items, { opacity: 0, y: 32 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        interval: 0.1,
        batchMax: 6,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true, clearProps: "transform" }),
      });

      // 3. 3D tilt-in cards
      const tilts = gsap.utils.toArray<HTMLElement>("[data-tilt-in]");
      gsap.set(tilts, { opacity: 0, rotateX: 28, y: 60, transformPerspective: 900, transformOrigin: "50% 100%" });
      ScrollTrigger.batch(tilts, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, rotateX: 0, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, clearProps: "transform" }),
      });

      root.classList.remove("js-anim"); // GSAP now owns the hidden states

      // Anything already above the viewport (reload mid-page / anchor jump) shows instantly.
      [...items, ...tilts].forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) gsap.set(el, { opacity: 1, y: 0, rotateX: 0 });
      });
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((h) => {
        if (h.getBoundingClientRect().bottom < 0) gsap.set(h.querySelectorAll(".word"), { y: 0, yPercent: 0, rotate: 0 });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      root.classList.remove("js-anim");
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
