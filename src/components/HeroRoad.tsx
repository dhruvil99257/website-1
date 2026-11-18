"use client";
import { useEffect, useRef } from "react";

/**
 * Illustrated Indian highway strip along the bottom of the hero:
 * layered hills, a road with moving lane markings, and a bus + car driving.
 * Pure CSS/SVG animation (GPU-friendly transforms) – paused when off-screen.
 */
export function HeroRoad() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("anim-paused", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] overflow-hidden sm:h-[150px]">
      {/* hills */}
      <svg className="absolute inset-x-0 bottom-[46px] h-[70px] w-full sm:bottom-[56px] sm:h-[90px]" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <path d="M0 90V55c90-30 170-40 260-18s160 30 250 4 190-46 300-20 170 34 240 18 110-20 150-10v61z" fill="#4D8865" opacity=".55" />
        <path d="M0 90V70c120-22 220-26 330-8s210 18 320-4 230-20 330 0 160 14 220 6v26z" fill="#3A6B4E" opacity=".8" />
      </svg>
      {/* road */}
      <svg className="absolute inset-x-0 bottom-0 h-[50px] w-full sm:h-[60px]" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <rect y="0" width="1200" height="60" fill="#242A30" />
        <rect y="0" width="1200" height="4" fill="#F3A43B" />
        <rect y="56" width="1200" height="4" fill="#F7F5EF" opacity=".5" />
        <line x1="0" y1="30" x2="1200" y2="30" stroke="#F7F5EF" strokeWidth="3" strokeDasharray="34 30" className="animate-lane" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* vehicles */}
      <div className="absolute bottom-[22px] left-0 w-full sm:bottom-[27px]">
        <div className="animate-drive will-change-transform" style={{ animationDuration: "16s" }}>
          <Bus />
        </div>
      </div>
      <div className="absolute bottom-[4px] left-0 w-full sm:bottom-[6px]">
        <div className="animate-drive will-change-transform" style={{ animationDuration: "9s", animationDelay: "-4s" }}>
          <Car />
        </div>
      </div>
    </div>
  );
}

function Bus() {
  return (
    <svg width="92" height="34" viewBox="0 0 92 34" className="h-[26px] w-auto sm:h-[34px]">
      <rect x="2" y="2" width="86" height="24" rx="5" fill="#F3A43B" />
      <rect x="2" y="17" width="86" height="4" fill="#173D5B" />
      {[8, 22, 36, 50, 64].map((x) => (
        <rect key={x} x={x} y="6" width="11" height="8" rx="1.5" fill="#DDEBF5" />
      ))}
      <rect x="77" y="6" width="9" height="12" rx="2" fill="#DDEBF5" />
      <circle cx="20" cy="27" r="5" fill="#242A30" stroke="#F7F5EF" strokeWidth="2" />
      <circle cx="70" cy="27" r="5" fill="#242A30" stroke="#F7F5EF" strokeWidth="2" />
    </svg>
  );
}

function Car() {
  return (
    <svg width="54" height="24" viewBox="0 0 54 24" className="h-[18px] w-auto sm:h-[24px]">
      <path d="M4 16c0-4 2-6 6-6l7-6h16l9 6h6c3 0 4 2 4 5v3H4z" fill="#F7F5EF" />
      <path d="M19 6h6v5h-11zM28 6h5l6 5H28z" fill="#173D5B" opacity=".75" />
      <circle cx="14" cy="18" r="4" fill="#242A30" stroke="#F3A43B" strokeWidth="1.5" />
      <circle cx="42" cy="18" r="4" fill="#242A30" stroke="#F3A43B" strokeWidth="1.5" />
    </svg>
  );
}
