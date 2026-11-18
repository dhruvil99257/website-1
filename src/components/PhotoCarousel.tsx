"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { photos, type PhotoKey } from "@/config/photos";
import { prefersReducedMotion } from "@/lib/prefill";

/**
 * Auto-sliding photos (Ken-Burns crossfade). Only ticks while on screen,
 * pauses on hover/touch, and the dots are real buttons.
 */
export function PhotoCarousel({
  keys,
  alt,
  sizes,
  interval = 3600,
  offset = 0,
  focus,
  className = "",
  dots = true,
  dotLabel = "Photo",
  imgProps,
}: {
  keys: readonly PhotoKey[];
  alt: string;
  sizes: string;
  interval?: number;
  offset?: number;
  focus?: string;
  className?: string;
  dots?: boolean;
  dotLabel?: string;
  imgProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const n = keys.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (n < 2 || !visible || held || prefersReducedMotion()) return;
    let timer = window.setTimeout(function tick() {
      setI((x) => (x + 1) % n);
      timer = window.setTimeout(tick, interval);
    }, interval + offset);
    return () => window.clearTimeout(timer);
  }, [n, visible, held, interval, offset]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden ${className}`}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <div className="absolute inset-0" {...imgProps}>
        {keys.map((k, idx) => {
          const active = idx === i;
          // Only mount images that are current, next, or already shown once (lazy, light on data).
          return (
            <div
              key={k}
              className="absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-out"
              style={{ opacity: active ? 1 : 0, transform: active ? "scale(1.06)" : "scale(1.14)" }}
              aria-hidden={!active}
            >
              <Image
                src={photos[k].src}
                alt={active ? alt : ""}
                fill
                sizes={sizes}
                className="object-cover"
                style={idx === 0 && focus ? { objectPosition: focus } : undefined}
              />
            </div>
          );
        })}
      </div>
      {dots && n > 1 && (
        <div className="absolute inset-x-0 bottom-auto top-3 z-10 flex justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {keys.map((k, idx) => (
            <button
              key={k}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`${dotLabel} ${idx + 1} / ${n}`}
              aria-current={idx === i || undefined}
              className="group/dot grid h-6 min-w-6 place-items-center"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/55 group-hover/dot:bg-white/80"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
