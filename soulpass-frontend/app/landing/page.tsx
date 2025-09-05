'use client';

import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, QrCode, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800 backdrop-blur-md bg-black/30 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-wider text-cyan-400">SoulPass</h1>
        <nav className="space-x-6 hidden md:flex text-gray-300">
          <a href="#about" className="hover:text-cyan-400 transition">About</a>
          <a href="#features" className="hover:text-cyan-400 transition">Features</a>
          <a href="#cta" className="hover:text-cyan-400 transition">Get Started</a>
        </nav>
        <button className="px-6 py-2 rounded-xl bg-cyan-400 text-black font-semibold shadow-lg hover:bg-cyan-300 transition">Login</button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center flex-grow px-8 py-24 gap-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            The Future of Digital Certificates
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            SoulPass redefines trust in education with <span className="text-cyan-400">soulbound NFTs</span>. Your credentials are permanent, verifiable, and impossible to fake.
          </p>
          <div className="mt-8 space-x-4">
            <button className="bg-cyan-400 text-black font-semibold rounded-xl px-6 py-3 shadow-xl hover:bg-cyan-300 transition">Get Started</button>
            <button className="border border-cyan-400 text-cyan-400 px-6 py-3 rounded-xl hover:bg-cyan-400 hover:text-black transition">Learn More</button>
          </div>
        </motion.div>

        {/* Decorative UI shapes */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-gradient-to-b from-gray-900 to-black relative">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400">Why SoulPass?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-gray-800 rounded-2xl shadow-lg text-center border border-cyan-400/30">
            <GraduationCap className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
            <h4 className="text-xl font-bold mb-2 text-white">Instant Certificates</h4>
            <p className="text-gray-400">Receive your proof of achievement instantly as a verifiable NFT.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-gray-800 rounded-2xl shadow-lg text-center border border-purple-400/30">
            <ShieldCheck className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            <h4 className="text-xl font-bold mb-2 text-white">Tamper-Proof</h4>
            <p className="text-gray-400">Soulbound NFTs can’t be forged, lost, or transferred. They stay with you forever.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-gray-800 rounded-2xl shadow-lg text-center border border-pink-400/30">
            <QrCode className="w-12 h-12 mx-auto text-pink-400 mb-4" />
            <h4 className="text-xl font-bold mb-2 text-white">Seamless Verification</h4>
            <p className="text-gray-400">Scan and verify credentials instantly, no third-party trust required.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-8 text-center relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[25rem] h-[25rem] bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <h3 className="text-4xl font-extrabold mb-6 text-cyan-400">Start Your SoulPass Journey</h3>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-300">
            Step into the future of academic verification. SoulPass is your permanent digital identity for education & events.
          </p>
          <button className="bg-cyan-400 text-black font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-cyan-300 transition flex items-center justify-center gap-2 mx-auto">
            <Sparkles className="w-5 h-5" /> Get SoulPass
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-6 text-center border-t border-gray-800">
        <p>© {new Date().getFullYear()} SoulPass · Futuristic NFT Credentials</p>
      </footer>
    </div>
  );
}
