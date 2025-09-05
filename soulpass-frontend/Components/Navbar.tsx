'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const { ready, authenticated, logout, login } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  if (!ready) return null;

  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          href={authenticated ? '/home' : '/'}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text hover:opacity-90 transition"
        >
          🎓 SoulPass
        </Link>

        {/* Buttons */}
        {authenticated ? (
          <div className="flex gap-4 items-center">
            {/* Claim NFT Button */}
            <Link
              href="/claim"
              className="relative bg-gradient-to-r from-green-400 to-green-600 text-white text-sm px-4 py-2 rounded-md font-medium shadow-md overflow-hidden group"
            >
              <span className="relative z-10">🎟️ Claim NFT</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition" />
            </Link>

            {/* Profile Link */}
            {pathname !== '/profile' && (
              <Link
                href="/profile"
                className="text-purple-300 hover:text-purple-200 font-semibold text-sm transition"
              >
                My Profile
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="relative bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 text-sm rounded-md font-medium shadow-md overflow-hidden group"
            >
              <span className="relative z-10">Logout</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="relative bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md border border-purple-700/60 overflow-hidden group"
          >
            <span className="relative z-10">Login</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 opacity-0 group-hover:opacity-100 transition" />
          </button>
        )}
      </div>
    </nav>
  );
}
