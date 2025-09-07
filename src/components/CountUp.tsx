"use client";

import React, { useEffect, useRef, useState } from "react";

type CountUpProps = {
  end: number;
  duration?: number; // ms
  start?: number;
  className?: string;
};

export default function CountUp({ end, duration = 1500, start = 0, className = "" }: CountUpProps) {
  const [value, setValue] = useState(start);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animate = () => {
      const from = start;
      const to = end;
      const diff = to - from;
      const startTime = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(from + diff * eased));
        if (t < 1) requestAnimationFrame(step);
      };

      if (rm.matches) {
        setValue(end);
      } else {
        requestAnimationFrame(step);
      }
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          animate();
        }
      });
    }, { threshold: 0.3 });

    io.observe(el);
    return () => io.disconnect();
  }, [start, end, duration]);

  return (
    <span ref={ref} className={className}>{value.toLocaleString()}</span>
  );
}