'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, QrCode, Trophy } from 'lucide-react';
import Navbar from '../Components/Navbar'; // ✅ Reusable Navbar component

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
    <div className="bg-[#0a0a0f] min-h-screen font-[Poppins] text-gray-100 scroll-smooth">
      {/* ✅ Navbar */}
      <Navbar />

      {/* Hero Section */}
<section className="relative min-h-[100vh] flex flex-col justify-center items-center px-6 overflow-hidden">
  {/* 🔥 Futuristic background image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-40"
    style={{ backgroundImage: "url('/bg.png')" }}
  />
  {/* Glow overlays */}
  <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
  <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-ping" />

  {/* ✅ Content side-by-side */}
  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start md:justify-between max-w-6xl w-full">
    {/* Left: Text */}
    <div className="text-center md:text-left md:w-1/2">
      <motion.h1
        className="text-[2.5rem] sm:text-[4.5rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Own Your Campus Journey
      </motion.h1>

      <p className="mt-6 max-w-xl text-lg text-gray-300">
        Collect soulbound NFT certificates for attending college events. SoulPass is futuristic, secure, and made for students like you.
      </p>

      <motion.button
        onClick={login}
        className="mt-10 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Your SoulPass Journey
      </motion.button>
    </div>

    {/* Right: Card image */}
    <motion.div
      className="mt-10 md:mt-0 md:w-1/2 flex justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <img
        src="/cardimg.png"
        alt="SoulPass Card"
        className="w-[350px] md:w-[450px] drop-shadow-2xl"
      />
    </motion.div>
  </div>
</section>


      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-[#0f0f17]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-12">
            Why SoulPass?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[{
              icon: <ShieldCheck className="w-10 h-10 text-purple-400" />, title: "Verified Credentials", desc: "NFTs tied to your wallet, non-transferable and secure."
            }, {
              icon: <QrCode className="w-10 h-10 text-purple-400" />, title: "Seamless Claiming", desc: "Get your NFT instantly by scanning event QR codes."
            }, {
              icon: <Sparkles className="w-10 h-10 text-purple-400" />, title: "Student First", desc: "Designed for resumes, portfolios, and LinkedIn visibility."
            }, {
              icon: <Trophy className="w-10 h-10 text-purple-400" />, title: "Future Proof", desc: "Tamper-proof, decentralized and backed by blockchain."
            }].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                className="bg-[#1a1a25] p-8 rounded-2xl shadow-lg hover:shadow-purple-500/30 transition"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex justify-center">{icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-[#1a1a25] to-[#0a0a0f] text-center">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-purple-300 mb-12">SoulPass in Numbers</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[{ label: 'Passes Minted', value: '7,500+' }, { label: 'Students Participated', value: '2,100+' }, { label: 'Colleges & Chapters', value: '50+' }, { label: 'Authenticity Guaranteed', value: '100%' }].map(({ label, value }) => (
              <motion.div
                key={label}
                className="bg-[#11111a] rounded-2xl py-8 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-bold text-purple-400">{value}</p>
                <p className="text-gray-400 mt-2">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-8 bg-[#0f0f17]">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-purple-300 mb-12">Student Reactions</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[{ name: 'Aarav, 3rd Year', quote: 'SoulPass made collecting event certs actually fun. Love the glowing designs!' }, { name: 'Sneha, 2nd Year', quote: 'It feels like building a futuristic digital yearbook of my journey.' }, { name: 'Ritika, 4th Year', quote: 'The NFT claim process is smooth and futuristic. Perfect for students.' }].map(({ name, quote }) => (
              <div key={name} className="bg-[#1a1a25] p-6 rounded-xl shadow-lg">
                <p className="text-gray-300 mb-4 italic">"{quote}"</p>
                <p className="font-semibold text-purple-400">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-8 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-purple-300 mb-10 text-center">FAQs</h3>
          <div className="space-y-8 text-left">
            <div>
              <p className="font-semibold text-purple-400">🎓 Is SoulPass free to use?</p>
              <p className="text-gray-400">Yes, it's completely free for students. Institutions may be onboarded for event management.</p>
            </div>
            <div>
              <p className="font-semibold text-purple-400">🔐 What if I lose access to my wallet?</p>
              <p className="text-gray-400">SoulPass uses Privy for secure social logins, so your account is recoverable.</p>
            </div>
            <div>
              <p className="font-semibold text-purple-400">🎉 How do I get my SoulPass NFT?</p>
              <p className="text-gray-400">Attend a partnered event, scan the claim QR, and your NFT certificate is instantly yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f17] text-center py-8 text-sm text-gray-500 border-t border-purple-900">
        Made with 💜 for students — SoulPass © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
