"use client";
import Link from "next/link";
import { useState } from "react";

/*
  FloatingLegalButtons
  - Circular FAB with three satellite buttons (Privacy, Terms, Contact)
  - White icons, subtle bounce animation, appears on all pages
  - Position can be right or left; default right
  - Uses theme brand colors from CSS variables: --brand, --brand-hover, --brand-ring
*/

type Position = "right" | "left";

export default function FloatingLegalButtons({ position = "right" }: { position?: Position }) {
  const [open, setOpen] = useState(false);

  const sideClass = position === "right" ? "right-6" : "left-6";
  const orbitSide = position === "right" ? "items-end" : "items-start";
  const translateSign = position === "right" ? "" : "-"; // for left side, mirror X translation

  return (
    <div className={`fixed ${sideClass} bottom-6 z-50 select-none`}>
      {/* Satellite buttons container */}
      <div className={`relative flex flex-col ${orbitSide} mb-3 space-y-3`}
        aria-hidden={!open}
      >
        {/* Privacy */}
        <Link
          href="/privacy"
          className={`group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"}`}
          style={{
            transform: open ? `translate(${translateSign}0px, 0px)` : undefined,
          }}
          title="Privacy Policy"
        >
          {/* shield icon */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6l7 3v5a7 7 0 11-14 0V9l7-3z" />
          </svg>
        </Link>

        {/* Terms */}
        <Link
          href="/terms"
          className={`group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${open ? "opacity-100 translate-y-0 delay-75" : "opacity-0 pointer-events-none translate-y-3"}`}
          style={{
            transform: open ? `translate(${translateSign}0px, 0px)` : undefined,
          }}
          title="Terms of Service"
        >
          {/* document icon */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10M7 17h6" />
          </svg>
        </Link>

        {/* Contact */}
        <Link
          href="/contact"
          className={`group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${open ? "opacity-100 translate-y-0 delay-150" : "opacity-0 pointer-events-none translate-y-3"}`}
          style={{
            transform: open ? `translate(${translateSign}0px, 0px)` : undefined,
          }}
          title="Contact"
        >
          {/* phone icon */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a1 1 0 01-1 1H7a1 1 0 00-1 1v2a12 12 0 0012 12h2a1 1 0 001-1v-2a2 2 0 00-2-2h-1a1 1 0 01-1-1v-2a2 2 0 00-2-2h-2" />
          </svg>
        </Link>
      </div>

      {/* Main FAB */}
      <button
        type="button"
        aria-label="Open legal menu"
        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 animate-fab-bounce`}
        onClick={() => setOpen((v) => !v)}
      >
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />
        {/* plus / close icon */}
        <svg
          className={`h-7 w-7 transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" d="M12 5v14" />
          <path strokeLinecap="round" d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}