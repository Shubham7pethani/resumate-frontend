import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ToastProvider } from '@/context/ToastContext'
import FloatingLegalButtons from '@/components/FloatingLegalButtons'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resumate - AI Resume Generator",
  description: "Generate professional resumes using AI with your GitHub and LinkedIn data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ErrorBoundary>
            <ToastProvider>
              {children}
              {/* Floating legal buttons - visible on all pages */}
              {/* Position can be switched to left by passing position="left" */}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore - dynamic import path via alias if configured */}
              <div>
                {/* We import via relative path to ensure bundling */}
              </div>
              <div className="pointer-events-none">
                <div className="pointer-events-auto">
                  {/* Use dynamic import at top-level is not needed; direct component import */}
                </div>
              </div>
              <FloatingLegalButtons />
              <footer className="mt-16 border-t py-6 text-center text-sm text-gray-600">
                <div className="space-x-6">
                  <a className="hover:underline" href="/privacy">Privacy Policy</a>
                  <a className="hover:underline" href="/terms">Terms of Service</a>
                  <a className="hover:underline" href="/contact">Contact</a>
                </div>
              </footer>
            </ToastProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
