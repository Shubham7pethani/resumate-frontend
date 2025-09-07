"use client";

import React, { useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";

type ParallaxImageProps = Omit<ImageProps, "ref"> & {
  strength?: number; // px shift between -strength..+strength
};

export default function ParallaxImage({ strength = 20, ...props }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rm.matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
      const dy = (e.clientY - cy) / rect.height; // -0.5..0.5
      const tx = -dx * strength;
      const ty = -dy * strength;
      container.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength]);

  return (
    <div className="will-change-transform transition-transform duration-150 ease-out" ref={ref}>
      <Image {...props} />
    </div>
  );
}