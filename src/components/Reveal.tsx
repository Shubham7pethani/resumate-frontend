"use client";

import React, { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
  variant?: "fade-up" | "slide-left" | "slide-right" | "zoom";
};

// IntersectionObserver-based scroll reveal wrapper
// Adds .reveal and variant classes, toggles .is-visible when in viewport
export default function Reveal({
  children,
  className = "",
  as = "div",
  once = true,
  variant = "fade-up",
}: RevealProps) {
  const Comp = as as any;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animations for users who prefer reduced motion
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rm.matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.16 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Comp
      ref={ref}
      className={`reveal reveal-${variant} ${className}`.trim()}
    >
      {children}
    </Comp>
  );
}