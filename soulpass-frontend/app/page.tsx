'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    <div className="bg-[#fefcff] min-h-screen font-[Poppins] text-gray-800 scroll-smooth">
      {/* ✅ Reusable Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center px-10 py-24 bg-[#f6f4ff] overflow-hidden">
        <div className="absolute top-10 left-[-100px] w-[300px] h-[300px] bg-yellow-100 rounded-full opacity-50 blur-2xl z-0" />
        <div className="absolute bottom-[-80px] right-[-120px] w-[400px] h-[400px] bg-purple-200 rounded-full opacity-40 blur-2xl z-0" />
        <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full border-[10px] border-purple-300 overflow-hidden shadow-xl z-10">
          <img src="/soulpass.png" alt="SoulPass badge" className="object-cover w-full h-full" />
        </div>

        <div className="max-w-2xl z-10 mr-auto">
          <motion.h1
            className="text-[3.5rem] sm:text-[4.5rem] font-extrabold text-purple-700 drop-shadow mb-6 leading-[1.15]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Own Your <br /> Campus Journey
          </motion.h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
            Collect NFT-based certificates for attending college events. SoulPass is fun, futuristic, and made for students like you.
          </p>
          <button
            onClick={login}
            className="bg-white hover:bg-purple-100 text-purple-700 font-bold py-3 px-8 border-2 border-purple-500 rounded-full shadow-lg transition"
          >
            Claim Your First SoulPass
          </button>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white px-8 py-24" id="features">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-purple-600 mb-4">What is SoulPass?</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              SoulPass transforms the way students earn, store, and showcase achievements. Every time you attend a seminar, workshop, or fest, a unique NFT is minted to your name.
            </p>
            <ul className="mt-6 text-purple-700 space-y-2 list-disc list-inside font-medium">
              <li>Verified NFT credentials tied to your wallet</li>
              <li>QR code-based seamless claiming</li>
              <li>Perfect for resumes, portfolios & LinkedIn</li>
              <li>Truly yours — non-transferable and secure</li>
            </ul>
          </motion.div>
          <motion.img
            src="/verify.png"
            alt="SoulPass verification"
            className="rounded-2xl shadow-xl w-full"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-50 py-20 px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-purple-700 mb-8">SoulPass in Numbers</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-purple-800 text-lg font-semibold">
            {[
              { label: 'Passes Minted', value: '7,500+' },
              { label: 'Students Participated', value: '2,100+' },
              { label: 'Colleges & Chapters', value: '50+' },
              { label: 'Authenticity Guaranteed', value: '100%' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white shadow-lg rounded-2xl py-8 px-4">
                <p className="text-4xl font-bold text-purple-600">{value}</p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-purple-700 mb-10">Student Reactions</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { name: 'Aarav, 3rd Year', quote: 'SoulPass made collecting event certs actually fun. Love the designs!' },
              { name: 'Sneha, 2nd Year', quote: 'It feels like building a digital yearbook of all the cool stuff I did.' },
              { name: 'Ritika, 4th Year', quote: 'The NFT claim process is super smooth. A nice touch to college life.' },
            ].map(({ name, quote }) => (
              <div key={name} className="bg-purple-50 p-6 rounded-xl shadow">
                <p className="text-gray-700 mb-4 italic">"{quote}"</p>
                <p className="font-semibold text-purple-800">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-purple-50 py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-purple-700 mb-10 text-center">FAQs</h3>
          <div className="space-y-8 text-left">
            <div>
              <p className="font-semibold text-purple-800">🎓 Is SoulPass free to use?</p>
              <p className="text-gray-700">Yes, it's completely free for students. Institutions may be onboarded for event management.</p>
            </div>
            <div>
              <p className="font-semibold text-purple-800">🔐 What if I lose access to my wallet?</p>
              <p className="text-gray-700">SoulPass uses Privy to securely manage logins using social accounts — it's recoverable!</p>
            </div>
            <div>
              <p className="font-semibold text-purple-800">🎉 How do I get my SoulPass NFT?</p>
              <p className="text-gray-700">Just attend a partnered event, scan the claim QR, and it's yours instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-8 text-sm text-gray-500 border-t">
        Made with 💜 for students — SoulPass © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
