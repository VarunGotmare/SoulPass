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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <section className="mx-auto max-w-6xl p-6">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl font-bold">🎟️ SoulPass Admin</h1>
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link href="/events/new" className="hover:text-blue-600">
                Create Event
              </Link>
            </nav>
          </header>

          {/* Page Content */}
          <main>{children}</main>
        </section>
      </body>
    </html>
  );
}
