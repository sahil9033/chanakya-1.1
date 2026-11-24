'use client'

import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UPAYAS = [
  {
    name: 'Sāma (साम)',
    subtitle: 'Conciliation & Persuasion',
    color: 'from-amber-500/10 to-orange-500/5',
    desc: 'The art of peaceful negotiation, aligning shared interests, honorific praise, and establishing moral rapport before tension escalates.',
    application: 'Deploy first against honorable counterparts, equals, and when mutual preservation serves both parties.',
    prompt: 'How do I execute Sāma (conciliation) with a hostile partner who still values reputation?',
  },
  {
    name: 'Dāma (दाम)',
    subtitle: 'Concession & Material Value',
    color: 'from-emerald-500/10 to-teal-500/5',
    desc: 'Offering tangible concessions, strategic gifts, treasury allocations, equity, or revenue share to satisfy the adversary’s appetite.',
    application: 'Deploy when the counterpart is driven by economic interest, avarice, or when buying critical time costs less than conflict.',
    prompt: 'How to use Dāma (economic concessions) strategically without appearing desperate or weak?',
  },
  {
    name: 'Bheda (भेद)',
    subtitle: 'Division & Dissension',
    color: 'from-indigo-500/10 to-blue-500/5',
    desc: 'Creating fissures in the opposition’s alliances, exploiting internal jealousies, and breaking unified fronts before direct encounter.',
    application: 'Deploy when facing an alliance stronger than yourself. Never fight a united coalition; divide their counsels first.',
    prompt: 'Explain the tactical deployment of Bheda (dissension) against a monopolistic coalition.',
  },
  {
    name: 'Daṇḍa (दण्ड)',
    subtitle: 'Decisive Force & Enforcement',
    color: 'from-rose-500/10 to-red-500/5',
    desc: 'The swift, overwhelming application of law, physical enforcement, economic embargo, or decisive strike. The final resort.',
    application: 'Deploy only when all other Upayas fail, with absolute surprise, total conviction, and zero moral hesitation.',
    prompt: 'When should Daṇḍa (punitive enforcement) be unleashed to maximize deterrence with minimal blowback?',
  },
]

const SAPTANGA = [
  { organ: 'Svāmin (स्वामी)', role: 'The Sovereign / Leader', meaning: 'The visionary head who provides moral direction, unyielding discipline, and strategic clarity.' },
  { organ: 'Amātya (अमात्य)', role: 'The Ministers / Advisors', meaning: 'The administrative intellect, executive council, and operational executors of strategy.' },
  { organ: 'Janapada (जनपद)', role: 'The Territory & Population', meaning: 'The fertile economic base, loyal workforce, and community that sustains state vigor.' },
  { organ: 'Durga (दुर्ग)', role: 'The Fort / Infrastructure', meaning: 'Defensive moats, secure systems, digital architectures, and protected reserves.' },
  { organ: 'Kośa (कोश)', role: 'The Treasury / Capital', meaning: 'Liquid reserves acquired ethically that allow survival during famine or war.' },
  { organ: 'Daṇḍa (दण्ड)', role: 'The Army / Enforcement', meaning: 'Disciplined executive power capable of protecting sovereignty and enforcing law.' },
  { organ: 'Mitra (मित्र)', role: 'The Allies / Ecosystem', meaning: 'Dependable, enduring friends who stand in solidarity during catastrophe.' },
]

export default function CodexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E2033]">
      <Navbar />

      {/* Hero Section */}
      <section className="sarvam-hero-mesh py-16 sm:py-20 px-4 text-center border-b border-[#E6E6E6]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F1F5] text-xs font-medium text-[#D5650F] border border-[rgba(30,32,51,0.08)]">
            <span>✦</span>
            <span>The Arthashastra Frameworks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#1E2033] tracking-tight">
            The Kautilyan Strategic Codex
          </h1>

          <p className="text-base sm:text-lg text-[#585C7B] leading-relaxed">
            Written by Acharya Chanakya over 2,300 years ago, the Arthashastra remains the world&apos;s most sophisticated treatise on realpolitik, statecraft, economics, and warfare.
          </p>

          <div className="pt-2">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-6 py-2.5 text-sm font-medium shadow-sm transition-all"
            >
              <span>Ask Chanakya to Apply These Frameworks</span>
              <span className="text-[#D5650F]">✦</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Upayas Section */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#D5650F]">
            Section I · Tactical Expedients
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1E2033] mt-1">
            The 4 Upāyas of Influence & Conquest
          </h2>
          <p className="text-xs sm:text-sm text-[#585C7B] mt-2">
            The fourfold methodology used to resolve every dispute, negotiation, and conflict in human affairs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {UPAYAS.map((u, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-[#E6E6E6] bg-white shadow-xs hover:border-[#D5650F]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold uppercase text-[#D5650F] bg-[#FFF8F3] px-2.5 py-1 rounded-full border border-[#D5650F]/20">
                    Step {i + 1}
                  </span>
                  <span className="text-xs text-[#8F92A9]">Arthashastra Book VII</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1E2033]">
                  {u.name}
                </h3>
                <p className="text-xs font-medium text-[#585C7B] mb-3">
                  {u.subtitle}
                </p>

                <p className="text-sm text-[#2C3048] leading-relaxed mb-4">
                  {u.desc}
                </p>

                <div className="p-3 rounded-xl bg-[#F7F7F8] border border-[#E6E6E6] text-xs text-[#585C7B] mb-4">
                  <strong className="text-[#1E2033] block mb-1">When to Deploy:</strong>
                  {u.application}
                </div>
              </div>

              <Link
                href={`/chat?prompt=${encodeURIComponent(u.prompt)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D5650F] hover:text-[#B35209] transition-colors"
              >
                <span>Consult Chanakya on this Upaya</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Saptanga Statecraft Section */}
      <section className="py-16 px-4 sm:px-8 bg-[#F7F7F8] border-t border-[#E6E6E6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#D5650F]">
              Section II · Organizational Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1E2033] mt-1">
              Saptāṅga: The 7 Pillars of Sovereignty
            </h2>
            <p className="text-xs sm:text-sm text-[#585C7B] mt-2">
              Just as the human body requires seven limbs to thrive, every resilient enterprise or nation depends on seven indispensable pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAPTANGA.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E6E6E6] shadow-xs"
              >
                <div className="text-xs font-mono text-[#D5650F] font-semibold mb-1">
                  Pillar {idx + 1}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1E2033]">
                  {s.organ}
                </h3>
                <div className="text-xs font-medium text-[#585C7B] mb-2">
                  {s.role}
                </div>
                <p className="text-xs text-[#585C7B] leading-relaxed">
                  {s.meaning}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-6 py-3 text-sm font-medium shadow-sm transition-all"
            >
              <span>Ask Chanakya to Audit Your Saptāṅga Pillars</span>
              <span className="text-[#D5650F]">✦</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
