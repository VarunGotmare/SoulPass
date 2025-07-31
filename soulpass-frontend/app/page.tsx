'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/home');
    }
  }, [ready, authenticated, router]);

  if (!ready) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-100 min-h-screen text-gray-800 scroll-smooth">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-purple-700 tracking-wider drop-shadow">🎓 SoulPass</h1>
          <button
            onClick={login}
            className="px-5 py-2 rounded-full text-purple-700 font-bold border-4 border-purple-700 bg-yellow-200 hover:bg-yellow-300 shadow-[4px_4px_0px_#000] transition-all duration-300"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <motion.img
          src="/soulpass.png"
          alt="Campus NFT Scene"
          className="w-80 object-cover"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-purple-700 mt-6 drop-shadow"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Make Every Event Count 🎟️
        </motion.h2>
        <p className="text-lg text-gray-700 max-w-2xl mt-4">
          Earn fun, secure, and permanent proof of attendance through soulbound NFTs. SoulPass makes college life collectible!
        </p>
        <motion.button
          onClick={login}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-3 rounded-full text-pink-600 font-bold text-lg border-4 border-pink-600 bg-white hover:bg-pink-100 shadow-[5px_5px_0px_#000] transition-all duration-300"
        >
          Claim Your Pass
        </motion.button>
      </section>

      {/* About Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-14">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-purple-600 mb-4">What is SoulPass?</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              SoulPass is a fun and secure platform that helps students track and show off their campus journey! Every time
              you attend an event, you earn a cool NFT badge that’s tied to your wallet and can’t be faked or transferred.
            </p>
            <ul className="mt-6 text-purple-600 space-y-2 list-disc list-inside font-medium">
              <li>✅ Fake-proof certificates</li>
              <li>📱 QR code-based NFT claims</li>
              <li>🎓 Owned by students, not organizers</li>
              <li>🖼️ Unique visuals for every event</li>
            </ul>
          </motion.div>
          <motion.img
            src="/verify.png"
            alt="NFT preview"
            className="rounded-2xl shadow-xl w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-purple-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-purple-600 mb-12">🌟 Platform Highlights</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: 'Soulbound NFTs', desc: 'Non-transferable badges prove real participation.' },
              { title: 'Secure Attendance', desc: 'On-chain data makes verification effortless.' },
              { title: 'Custom Event QR Codes', desc: 'Each event gets its own unique claiming code.' },
              { title: 'Built on Ethereum', desc: 'Transparent, immutable & decentralized.' },
              { title: 'Student-first Design', desc: 'Built for college clubs, fests, and seminars.' },
              { title: 'One-click Login', desc: 'Connect your wallet instantly with Privy.' },
            ].map(({ title, desc }) => (
              <motion.div
                key={title}
                className="bg-white p-6 rounded-xl border-4 border-purple-200 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] transition text-left"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-xl font-semibold text-purple-700 mb-2">{title}</h4>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 text-center text-sm text-gray-600 border-t mt-8">
        © {new Date().getFullYear()} SoulPass — Empowering Student Credentials 🚀
      </footer>
    </div>
  );
}
