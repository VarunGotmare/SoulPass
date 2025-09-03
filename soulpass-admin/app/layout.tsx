import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "SoulPass Admin",
  description: "Admin panel for events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-neutral-950 text-gray-200 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            {/* Logo / Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
              🎟️ SoulPass Admin
            </h1>

            {/* Navigation */}
            <nav className="flex gap-6 text-sm font-medium">
              <Link
                href="/"
                className="hover:text-white transition-colors text-gray-400"
              >
                Home
              </Link>
              <Link
                href="/create-event"
                className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition text-gray-100"
              >
                + Create Event
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
