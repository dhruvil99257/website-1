"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefill";

type Landmark = "temple" | "palm" | "mountain" | "city" | "camel" | "boat";

/**
 * The signature road. A winding highway between two sections that is
 * "laid" as you scroll (scrubbed to scroll position – never hijacks it),
 * with a vehicle driving along and landmarks popping up beside it.
 * Works backwards too: scroll up and the road rolls back.
 */
export function RoadConnector({
  direction = "ltr",
  landmarks = [],
  vehicle = "car",
  finish = false,
  label,
  className = "",
}: {
  direction?: "ltr" | "rtl";
  landmarks?: { at: number; icon: Landmark }[];
  vehicle?: "car" | "bus";
  finish?: boolean;
  label?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const roadPath = useRef<SVGPathElement>(null);
  const maskPath = useRef<SVGPathElement>(null);
  const car = useRef<SVGGElement>(null);
  const marks = useRef<(SVGGElement | null)[]>([]);
  const flag = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ w: 400, h: 120 });
  const id = `road${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Keep the SVG coordinate system equal to real pixels (no distortion).
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      const h = Math.round(e.contentRect.height);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const pad = Math.max(18, h * 0.2);
  const y1 = pad;
  const y2 = h - pad;
  const endX = finish ? w * 0.5 : w + 30;
  const endY = finish ? h - 18 : y2;
  const d =
    direction === "ltr"
      ? `M -30 ${y1} C ${w * 0.35} ${y1}, ${w * 0.3} ${y2}, ${w * 0.55} ${(y1 + y2) / 2 + (y2 - y1) * 0.25} S ${finish ? w * 0.5 : w * 0.8} ${endY}, ${endX} ${endY}`
      : `M ${w + 30} ${y1} C ${w * 0.65} ${y1}, ${w * 0.7} ${y2}, ${w * 0.45} ${(y1 + y2) / 2 + (y2 - y1) * 0.25} S ${finish ? w * 0.5 : w * 0.2} ${endY}, ${finish ? w * 0.5 : -30} ${endY}`;
  const roadW = w < 640 ? 18 : 26;
  const landmarkKey = landmarks.map((m) => `${m.icon}@${m.at}`).join(",");

  useEffect(() => {
    const path = roadPath.current;
    const mask = maskPath.current;
    const vehicleEl = car.current;
    if (!path || !mask || !vehicleEl || !wrap.current) return;
    const L = path.getTotalLength();
    mask.style.strokeDasharray = `${L}`;

    // Pre-compute landmark positions.
    const placed = landmarks.map((m) => path.getPointAtLength(L * m.at));
    marks.current.forEach((g, i) => {
      if (!g) return;
      const p = placed[i];
      g.setAttribute("transform", `translate(${p.x} ${p.y - roadW / 2 - 4})`);
    });

    const render = (p: number) => {
      mask.style.strokeDashoffset = `${L * (1 - p)}`;
      const at = Math.min(L - 1, Math.max(1, L * p));
      const a = path.getPointAtLength(at);
      const b = path.getPointAtLength(Math.min(L, at + 2));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      // Vehicle art faces right; when heading left, mirror it so it stays upright.
      const upright = Math.abs(angle) > 90 ? " scale(1 -1)" : "";
      vehicleEl.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})${upright}`);
      vehicleEl.style.opacity = p > 0.02 ? "1" : "0";
      marks.current.forEach((g, i) => {
        if (!g) return;
        const on = p >= landmarks[i].at - 0.04;
        const inner = g.firstElementChild as SVGGElement | null;
        if (inner) {
          inner.style.transform = on ? "scale(1)" : "scale(0)";
          inner.style.opacity = on ? "1" : "0";
        }
      });
      if (flag.current) {
        const on = p > 0.9;
        flag.current.style.transform = on ? "scale(1)" : "scale(0)";
        flag.current.style.opacity = on ? "1" : "0";
      }
    };

    if (prefersReducedMotion()) {
      render(1);
      return;
    }
    const { ScrollTrigger } = getGsap();
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top 92%",
      end: "bottom 40%",
      scrub: 0.5,
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });
    render(st.progress);
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, landmarkKey, roadW]);

  return (
    <div
      ref={wrap}
      className={`relative h-[110px] w-full overflow-hidden sm:h-[150px] lg:h-[180px] ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x="-50" y="-50" width={w + 100} height={h + 100}>
            <path ref={maskPath} d={d} fill="none" stroke="#fff" strokeWidth={roadW + 14} strokeLinecap="round" />
          </mask>
        </defs>
        {/* faint ghost of the route still to be travelled */}
        <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth={2} strokeDasharray="4 8" className="text-navy" />
        <g mask={`url(#${id})`}>
          <path d={d} fill="none" stroke="#E7DCC4" strokeWidth={roadW + 8} strokeLinecap="round" />
          <path ref={roadPath} d={d} fill="none" stroke="#2B333B" strokeWidth={roadW} strokeLinecap="round" />
          <path d={d} fill="none" stroke="#F3A43B" strokeWidth={2} strokeDasharray="12 12" />
        </g>

        {landmarks.map((m, i) => (
          <g key={i} ref={(el) => { marks.current[i] = el; }}>
            <g style={{ transform: "scale(0)", opacity: 0, transformOrigin: "0px 0px", transformBox: "view-box", transition: "transform .45s cubic-bezier(.3,1.6,.5,1), opacity .3s" }}>
              <LandmarkIcon icon={m.icon} />
            </g>
          </g>
        ))}

        {finish && (
          <g transform={`translate(${endX} ${endY})`}>
            <g ref={flag} style={{ transform: "scale(0)", opacity: 0, transformBox: "fill-box", transformOrigin: "50% 100%", transition: "transform .5s cubic-bezier(.3,1.6,.5,1), opacity .3s" }}>
              <circle r="16" fill="#F3A43B" opacity=".25" />
              <path d="M0 2c0 0-12-11-12-20a12 12 0 0 1 24 0c0 9-12 20-12 20z" fill="#F3A43B" stroke="#173D5B" strokeWidth="2" />
              <circle cy="-18" r="4.5" fill="#173D5B" />
            </g>
          </g>
        )}

        <g ref={car} style={{ opacity: 0 }}>{vehicle === "bus" ? <TopBus /> : <TopCar />}</g>
      </svg>
    </div>
  );
}

/* Side-view vehicles sized to sit on the road */
function TopCar() {
  return (
    <g transform="translate(-17 -15)">
      <path d="M2 18c0-3 1.5-5 5-5l5-5h11l7 5h3c2.5 0 3.5 1.5 3.5 4v3H2z" fill="#F7F5EF" stroke="#173D5B" strokeWidth="1.2" />
      <path d="M13 9.5h4.5v3.5h-8zM19.5 9.5h3l4.5 3.5h-7.5z" fill="#173D5B" opacity=".8" />
      <circle cx="9" cy="20" r="3.2" fill="#242A30" />
      <circle cx="28" cy="20" r="3.2" fill="#242A30" />
    </g>
  );
}
function TopBus() {
  return (
    <g transform="translate(-26 -20)">
      <rect x="1" y="2" width="50" height="16" rx="3.5" fill="#F3A43B" stroke="#173D5B" strokeWidth="1.2" />
      {[5, 14, 23, 32].map((x) => (<rect key={x} x={x} y="5" width="7" height="5" rx="1" fill="#DDEBF5" />))}
      <rect x="42" y="5" width="6" height="8" rx="1.2" fill="#DDEBF5" />
      <rect x="1" y="12" width="50" height="2.5" fill="#173D5B" />
      <circle cx="11" cy="19" r="3.2" fill="#242A30" />
      <circle cx="41" cy="19" r="3.2" fill="#242A30" />
    </g>
  );
}

function LandmarkIcon({ icon }: { icon: Landmark }) {
  // Each icon is drawn standing on (0,0), rising upward.
  switch (icon) {
    case "temple":
      return (
        <g>
          <path d="M-10 0V-12h20V0z" fill="#F3A43B" />
          <path d="M-7 -12L0 -30 7 -12z" fill="#D9861A" />
          <path d="M0 -30v-7l6 2.5-6 2.5" fill="#E2552B" stroke="#E2552B" strokeWidth="1" />
          <rect x="-3" y="-8" width="6" height="8" rx="3" fill="#173D5B" />
        </g>
      );
    case "palm":
      return (
        <g>
          <path d="M0 0c1-10 2-18 0-26" stroke="#7A5A3A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M0 -26c-6-6-12-5-16-1 5-2 10-1 16 1zM0 -26c6-6 12-5 16-1-5-2-10-1-16 1zM0 -26c-3-7-1-12 3-14-2 4-3 9-3 14zM0 -26c-9 0-13 4-13 9 3-5 8-8 13-9zM0 -26c9 0 13 4 13 9-3-5-8-8-13-9z" fill="#4D8865" />
        </g>
      );
    case "mountain":
      return (
        <g>
          <path d="M-20 0L-6 -26 4 -10 9 -17 22 0z" fill="#4D8865" />
          <path d="M-6 -26l-4.5 8.5 3-1.5 2 2 2.5-3z" fill="#F7F5EF" />
        </g>
      );
    case "city":
      return (
        <g fill="#173D5B">
          <rect x="-16" y="-16" width="8" height="16" rx="1" />
          <rect x="-7" y="-28" width="9" height="28" rx="1" />
          <rect x="3" y="-20" width="7" height="20" rx="1" />
          <rect x="11" y="-12" width="6" height="12" rx="1" />
          <g fill="#F3A43B">
            <rect x="-5" y="-24" width="2" height="2" /><rect x="-1" y="-24" width="2" height="2" />
            <rect x="-5" y="-18" width="2" height="2" /><rect x="-1" y="-12" width="2" height="2" />
          </g>
        </g>
      );
    case "camel":
      return (
        <g fill="#B07A3E">
          <path d="M-14 -10c0-6 4-9 8-9 2-6 7-6 9 0 3-1 5 1 6 3l4-6c2-2 5-1 5 1l-3 4-4 8H-14z" />
          <path d="M-12 -10v10M-8 -10v10M6 -10v10M10 -10v10" stroke="#B07A3E" strokeWidth="2.2" />
        </g>
      );
    case "boat":
      return (
        <g>
          <path d="M-18 -6h36l-6 6h-24z" fill="#7A5A3A" />
          <path d="M-12 -6c3-8 9-12 12-12s9 4 12 12z" fill="#F3A43B" />
          <path d="M-20 0c4 2 8 2 12 0s8-2 12 0 8 2 12 0" stroke="#5B8DB8" strokeWidth="1.6" fill="none" />
        </g>
      );
  }
}
