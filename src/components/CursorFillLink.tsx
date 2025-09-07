"use client"

import Link, { LinkProps } from 'next/link'
import React from 'react'

// Reusable link that applies the cursor-origin fill effect (pairs with .btn-fill in globals.css)
export default function CursorFillLink({ className = '', children, ...props }: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <Link
      {...props}
      className={className}
      onMouseMove={(e) => {
        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        target.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        target.style.setProperty('--my', `${e.clientY - rect.top}px`)
      }}
    >
      {children}
    </Link>
  )
}