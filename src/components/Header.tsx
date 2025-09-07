"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  // progress: 0 (top, large full-width), 1 (scrolled, compact centered)
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const tick = () => {
      // Smoothly approach target (lerp)
      const t = 0.12; // smoothing factor; lower = smoother
      currentRef.current = currentRef.current + (targetRef.current - currentRef.current) * t;
      const next = currentRef.current;
      setProgress(next);

      if (Math.abs(targetRef.current - next) > 0.001) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        // Snap to target to avoid micro-drift and stop loop
        currentRef.current = targetRef.current;
        setProgress(currentRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onScroll = () => {
      const y = window.scrollY || 0;
      // Map scroll to 0..1 over first ~140px for a gentle curve
      targetRef.current = clamp01(y / 140);
      if (rafRef.current == null) rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize from current scroll

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  // Derived styles from progress
  const h = 64 - 16 * progress; // 64px -> 48px
  const radius = 12 * progress; // 0 -> 12px
  const maxWidthPx = 9999 - (9999 - 1024) * progress; // full -> 1024px
  const bgAlpha = 0.0 + 0.7 * progress; // transparent -> dark blur
  const borderAlpha = 0.08 + 0.12 * progress; // subtle at top -> stronger when compact
  const shadowAlpha = 0.0 + 0.18 * progress; // shadow grows when compact
  const brandFontSize = 20 - 2 * progress; // 20px -> 18px

  const barStyle: CSSProperties = {
    height: `${h}px`,
    maxWidth: `min(100%, ${Math.round(maxWidthPx)}px)`,
    borderRadius: `${radius}px`,
    backgroundColor: `rgba(0,0,0,${bgAlpha})`,
    border: `1px solid rgba(255,255,255,${borderAlpha})`,
    boxShadow: `0 10px 24px rgba(0,0,0,${shadowAlpha})`,
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Constant wrapper height prevents layout jumps */}
      <div className="h-16 sm:h-20 flex items-center bg-transparent pointer-events-none">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", justifyContent: "center" }}>
          <div style={barStyle} className="w-full mx-auto flex items-center justify-between backdrop-blur-md pointer-events-auto">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 pl-4 sm:pl-6">
              <Image
                src="/logo.png"
                alt="Resumate Logo"
                width={40}
                height={40}
                className="object-contain"
                style={{ 
                  width: `${32 + 8 * (1 - progress)}px`, 
                  height: `${32 + 8 * (1 - progress)}px` 
                }}
              />
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-[var(--brand)] transition-colors">Dashboard</Link>
              <Link href="/contact" className="text-gray-300 hover:text-[var(--brand)] transition-colors">Contact</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-[var(--brand)] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-[var(--brand)] transition-colors">Terms</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 pr-4 sm:pr-6">
              <SignedOut>
                <Link href="/sign-in" className="btn-outline-brand px-3 py-2 rounded-md text-sm font-medium magnetic">Sign In</Link>
                <Link href="/sign-up" className="btn-brand px-3 py-2 rounded-md text-sm font-semibold shadow shimmer magnetic">Get Started</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="btn-outline-brand px-3 py-2 rounded-md text-sm font-medium magnetic">Dashboard</Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
