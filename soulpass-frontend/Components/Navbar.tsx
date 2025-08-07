'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  if (!ready) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-100 to-blue-100 shadow-md px-6 py-4 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href={authenticated ? '/home' : '/'}
          className="text-3xl font-extrabold text-purple-700 tracking-tight hover:opacity-90 transition"
        >
          🎓 SoulPass
        </Link>

        {/* Buttons */}
        {authenticated ? (
          <div className="flex gap-4 items-center">
            {/* Claim NFT Button */}
            <Link
              href="/claim"
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md transition font-medium shadow"
            >
              🎟️ Claim NFT
            </Link>

            {/* Profile Link (hidden on profile page) */}
            {pathname !== '/profile' && (
              <Link
                href="/profile"
                className="text-purple-800 hover:underline font-semibold text-sm"
              >
                My Profile
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-md font-medium shadow"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold shadow-md border border-purple-800 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
