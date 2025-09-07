"use client";

import React, { useEffect, useRef, useState } from "react";

export type Slide = {
  id: string | number;
  content: React.ReactNode;
};

type Props = {
  slides: Slide[];
  auto?: boolean;
  interval?: number; // ms
  className?: string;
};

export default function Carousel({ slides, auto = true, interval = 3500, className = "" }: Props) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!auto || slides.length <= 1) return;
    const run = () => setIdx((i) => (i + 1) % slides.length);
    timer.current = window.setInterval(run, interval);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [auto, interval, slides.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="whitespace-nowrap transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((s) => (
          <div key={s.id} className="inline-block align-top w-full">
            {s.content}
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === idx ? "bg-[var(--brand)]" : "bg-gray-300"}`}
            aria-label={`Go to slide ${i + 1}`}
          />)
        )}
      </div>
    </div>
  );
}