'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const HERO_PROMPTS = [
  {
    tag: 'Negotiation',
    icon: '⚔️',
    title: 'The Asymmetric Underdog',
    prompt: 'How to negotiate and prevail when the adversary commands vastly superior capital and leverage?',
  },
  {
    tag: 'Leadership',
    icon: '👑',
    title: 'Commanding Absolute Loyalty',
    prompt: 'What are the essential qualities of a leader who commands unwavering respect during internal crisis?',
  },
  {
    tag: 'Alliances',
    icon: '🛡️',
    title: 'Discerning True Deceit',
    prompt: 'How does the Arthashastra recommend testing the hidden motives and loyalty of associates?',
  },
  {
    tag: 'Upanishadic Viveka',
    icon: '🕉️',
    title: 'Detached Decisive Execution',
    prompt: 'Explain how to apply Upanishadic Viveka (discernment) and Nishkama Karma to high-stakes conflict.',
  },
]

export default function HomePage() {
  const [quickInput, setQuickInput] = useState('')

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E2033] relative">
      <Navbar />

      {/* Hero Ambient Mesh Gradient */}
      <div className="sarvam-hero-mesh absolute top-0 left-0 right-0 h-[650px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 text-center max-w-4xl mx-auto">
        {/* Cultural Archway SVG Motif */}
        <div className="mb-4 text-[#D5650F] opacity-90 flex justify-center">
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0C24 6.627 18.627 12 12 12C18.627 12 24 17.373 24 24C24 17.373 29.373 12 36 12C29.373 12 24 6.627 24 0Z" fill="currentColor" fillOpacity="0.85"/>
            <circle cx="2" cy="12" r="2" fill="currentColor"/>
            <circle cx="46" cy="12" r="2" fill="currentColor"/>
          </svg>
        </div>

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F1F5] border border-[rgba(30,32,51,0.08)] text-xs font-medium text-[#1E2033] mb-5 shadow-xs">
          <span className="text-[#D5650F]">✦</span>
          <span>Sovereign Intelligence · Arthashastra & Upanishad Synthesis</span>
        </div>

        {/* Editorial Headline (Sarvam style) */}
        <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#1E2033] leading-[1.12]">
          Strategic intelligence for leaders from India
        </h1>

        {/* Sub-tagline */}
        <p className="max-w-2xl mx-auto text-[#585C7B] text-base sm:text-lg mt-4 leading-relaxed font-normal">
          Grounded in Kautilya&apos;s realpolitik, Chanakya Niti, and Upanishadic Viveka. Answered with sub-2s flash inference powered by frontier NVIDIA NIM.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/chat"
            className="rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-7 py-3 text-sm font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <span>Ask Chanakya Everything</span>
            <span className="text-[#D5650F]">✦</span>
          </Link>

          <Link
            href="/codex"
            className="rounded-full bg-white hover:bg-[#F7F7F8] text-[#1E2033] border border-[#E6E6E6] px-6 py-3 text-sm font-medium shadow-sm transition-all"
          >
            Explore The Codex (4 Upāyas)
          </Link>
        </div>

        {/* Quick Launch Search Input */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (quickInput.trim()) {
                window.location.href = `/chat?prompt=${encodeURIComponent(quickInput)}`
              }
            }}
            className="relative rounded-full bg-white border border-[#E6E6E6] shadow-[0_8px_30px_rgba(30,32,51,0.08)] p-2 pl-5 flex items-center gap-2 transition-all focus-within:border-[#D5650F]/50 focus-within:ring-2 focus-within:ring-[#D5650F]/15"
          >
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Ask Chanakya counsel on statecraft, negotiation, or leadership..."
              className="flex-1 bg-transparent border-0 text-sm sm:text-base text-[#1E2033] placeholder-[#8F92A9] focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
            >
              Consult
            </button>
          </form>
          <div className="text-[11px] text-[#8F92A9] mt-2">
            Try: <span className="underline cursor-pointer" onClick={() => setQuickInput('How to break a united coalition against me?')}>&ldquo;How to break a united coalition against me?&rdquo;</span>
          </div>
        </div>
      </section>

      {/* Bento Grid: 4 Core Focus Areas */}
      <section className="relative z-10 py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#D5650F]">
            The Fourfold Doctrine
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1E2033] mt-1">
            Choose Your Strategic Inquiry
          </h2>
          <p className="text-xs sm:text-sm text-[#585C7B] mt-1.5">
            Select a counsel track to formulate your strategy in accordance with ancient treatises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HERO_PROMPTS.map((item, idx) => (
            <Link
              key={idx}
              href={`/chat?prompt=${encodeURIComponent(item.prompt)}`}
              className="group p-6 rounded-2xl border border-[#E6E6E6] bg-white hover:border-[#D5650F]/50 hover:shadow-md transition-all flex flex-col justify-between shadow-[0_2px_8px_rgba(30,32,51,0.03)]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[#F7F7F8] text-[#585C7B] group-hover:text-[#D5650F] group-hover:bg-[#FFF8F3] transition-colors border border-[rgba(30,32,51,0.06)]">
                    {item.tag}
                  </span>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1E2033] group-hover:text-[#D5650F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#585C7B] mt-2 leading-relaxed">
                  {item.prompt}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-[#D5650F]">
                <span>Seek Counsel on this challenge</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sovereign Frameworks Showcase */}
      <section className="py-16 px-4 sm:px-8 bg-[#F7F7F8] border-t border-[#E6E6E6]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-[#E6E6E6] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#D5650F]/20 flex items-center justify-center text-[#D5650F] text-lg font-bold">
              ⚡
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E2033]">
              Flash Response Latency
            </h3>
            <p className="text-xs sm:text-sm text-[#585C7B] leading-relaxed">
              Powered by optimized NVIDIA NIM inference, delivering complex strategic deliberations in under 2 seconds without compromising depth.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E6E6E6] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#D5650F]/20 flex items-center justify-center text-[#D5650F] text-lg font-bold">
              📜
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E2033]">
              100% Arthashastra Fidelity
            </h3>
            <p className="text-xs sm:text-sm text-[#585C7B] leading-relaxed">
              Strictly filtered against modern platitudes and corporate clichés. Rooted in the 4 Upayas (Sama, Dama, Bheda, Danda) and Saptanga statecraft.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E6E6E6] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#D5650F]/20 flex items-center justify-center text-[#D5650F] text-lg font-bold">
              🕉️
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E2033]">
              Upanishadic Viveka
            </h3>
            <p className="text-xs sm:text-sm text-[#585C7B] leading-relaxed">
              Fusing Machiavellian political realism with the spiritual discernment of the Upanishads: flawless action without emotional fear of outcome.
            </p>
          </div>
        </div>
      </section>

      {/* Big Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#1E2033] text-white text-2xl font-serif font-bold mx-auto flex items-center justify-center shadow-lg">
            चा
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1E2033]">
            Ask Chanakya Everything Today
          </h2>
          <p className="text-sm sm:text-base text-[#585C7B] max-w-lg mx-auto">
            Take counsel on negotiation, leadership, crisis management, and strategic alliances from history&apos;s greatest chancellor.
          </p>
          <div className="pt-2">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-8 py-3.5 text-sm sm:text-base font-medium shadow-md transition-all"
            >
              <span>Begin Your Consultation</span>
              <span className="text-[#D5650F]">✦</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
