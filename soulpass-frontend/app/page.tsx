'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/home');
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!ready) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-blue-100 to-emerald-100 text-gray-800">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-200 opacity-30 rounded-full blur-3xl animate-ping" />

      {/* Conditional Navbar */}
      {showNavbar && (
        <div className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-blue-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h2 className="font-bold text-blue-600 text-xl">SoulPass</h2>
            <button
              onClick={login}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:brightness-110 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen px-4 text-center relative z-10">
        <motion.img
          src="/soulpass.png"
          alt="SoulPass Logo"
          className="w-80 h-80 object-contain drop-shadow-xl animate-float"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.h1
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 mt-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Welcome to SoulPass
        </motion.h1>
        <p className="mt-4 max-w-xl text-lg text-gray-700">
          Claim your Proof of Attendance as a Soulbound NFT and build your verified academic identity.
        </p>
        <motion.button
          onClick={login}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:brightness-110 transition duration-300"
        >
          Login to Get Started
        </motion.button>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center bg-gradient-to-br from-white to-emerald-50" id="about">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-emerald-700 mb-4">What is SoulPass?</h2>
          <p className="text-gray-700 leading-relaxed">
            SoulPass leverages blockchain to securely issue non-transferable certificates (SBTs) for real academic events. It eliminates forgery and validates attendance immutably.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <img src="/verify.png" alt="Verification" className="rounded-xl shadow-lg" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-sky-50 to-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold text-blue-700">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: 'Soulbound NFTs',
                desc: 'Certificates are non-transferable and tied to your academic wallet identity.',
              },
              {
                title: 'Blockchain Security',
                desc: 'Attendance is recorded immutably on the Ethereum blockchain.',
              },
              {
                title: 'One-Click Claiming',
                desc: 'Use QR or unique claim codes to easily receive your attendance NFT after any event.',
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl shadow-md bg-gradient-to-br from-white via-blue-50 to-sky-50 border border-blue-100"
              >
                <h3 className="font-semibold text-xl text-blue-600 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500 py-6 border-t bg-gradient-to-r from-white to-sky-50">
        © {new Date().getFullYear()} SoulPass · Built with 💙 on Blockchain · Final Year Project
      </footer>
    </div>
  );
}
