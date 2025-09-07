import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ToastProvider } from '@/context/ToastContext'
import "./globals.css";
import Header from "@/components/Header";
import './page-transitions.css'
import RouteTransition from '@/components/RouteTransition'

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
              <Header />
              {/* Smooth route transition handler */}
              <RouteTransition />
              <main>
                {children}
              </main>
              <footer className="mt-16 border-t py-6 text-center text-sm text-gray-600" style={{ borderColor: '#FBD0D0' }}>
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
