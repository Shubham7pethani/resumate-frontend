"use client";
import Link from "next/link";

/*
  FloatingLegalButtons
  - Simple floating legal links (Privacy, Terms, Contact)
  - Always visible, no expandable menu
  - Position can be right or left; default right
*/

type Position = "right" | "left";

export default function FloatingLegalButtons({ position = "right" }: { position?: Position }) {
  const sideClass = position === "right" ? "right-6" : "left-6";
  const orbitSide = position === "right" ? "items-end" : "items-start";

  return (
    <div className={`fixed ${sideClass} bottom-6 z-50 select-none`}>
      {/* Legal buttons container */}
      <div className={`relative flex flex-col ${orbitSide} space-y-3`}>
        {/* Privacy */}
        <Link
          href="/privacy"
          className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          className="group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          title="Contact"
        >
          {/* phone icon */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a1 1 0 01-1 1H7a1 1 0 00-1 1v2a12 12 0 0012 12h2a1 1 0 001-1v-2a2 2 0 00-2-2h-1a1 1 0 01-1-1v-2a2 2 0 00-2-2h-2" />
          </svg>
        </Link>
      </div>
    </div>
  );
}