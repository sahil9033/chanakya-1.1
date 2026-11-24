import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PHILOSOPHICAL_PILLARS = [
  {
    sanskrit: 'विवेक (Viveka)',
    concept: 'Discernment: Sifting Gold from Dross',
    source: 'Katha & Mandukya Upanishads',
    desc: 'The faculty of piercing through surface deception (Maya) to see the unvarnished reality. A strategist without Viveka reacts to illusions; a master with Viveka strikes at the root.',
    maxim: '“The wise choose the good (Shreya), while the undisciplined choose only the pleasant (Preya).”',
  },
  {
    sanskrit: 'निःकाम कर्म (Nishkama Karma)',
    concept: 'Action Without Emotional Fever',
    source: 'Isha Upanishad & Bhagavad Gita',
    desc: 'Executing duty with supreme precision while remaining detached from anxiety regarding the outcome. Fear of defeat paralyzes execution; detachment breeds effortless mastery.',
    maxim: '“Perform your duty with an even mind, unattached to victory or defeat. Equanimity is true yoga.”',
  },
  {
    sanskrit: 'सत्य & धर्म (Satya & Dharma)',
    concept: 'The Cosmic Axis of Sustainable Power',
    source: 'Brihadaranyaka Upanishad',
    desc: 'In Chanakya’s synthesis, power devoid of Dharma collapses under its own rot. The ruler uses harsh expedients only to preserve the righteous order of the cosmos and the welfare of the people.',
    maxim: '“Dharma protects those who protect it. An unjust empire falls from within before external foes arrive.”',
  },
  {
    sanskrit: 'चाणक्य नीति (Chanakya Niti)',
    concept: 'Cold Realism in Human Dynamics',
    source: 'Chanakya Niti Darpana',
    desc: 'Human beings are driven by fear, greed, pride, and loyalty. Test men in calamity, servants in duty, and friends in adversity. Never trust an unverified oath.',
    maxim: '“A snake is dangerous even if not venomous; it must raise its hood. A leader must maintain unshakeable deterrence.”',
  },
]

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E2033]">
      <Navbar />

      <section className="sarvam-hero-mesh py-16 sm:py-20 px-4 text-center border-b border-[#E6E6E6]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F1F5] text-xs font-medium text-[#D5650F] border border-[rgba(30,32,51,0.08)]">
            <span>✦</span>
            <span>The Vedic Bedrock</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#1E2033] tracking-tight">
            The Philosophy of Chanakya & The Upanishads
          </h1>

          <p className="text-base sm:text-lg text-[#585C7B] leading-relaxed">
            Where Machiavellian realism meets the transcendental detachment of the Upanishads. True sovereignty is not brute force—it is internal mastery translated into external statecraft.
          </p>

          <div className="pt-2">
            <Link
              href="/chat?filter=upanishad"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-6 py-2.5 text-sm font-medium shadow-sm transition-all"
            >
              <span>Consult with Upanishadic Filter</span>
              <span className="text-[#D5650F]">✦</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Philosophical Exposition */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="space-y-8">
          {PHILOSOPHICAL_PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-[#E6E6E6] bg-white shadow-xs hover:border-[#D5650F]/30 hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-semibold uppercase text-[#D5650F] bg-[#FFF8F3] px-3 py-1 rounded-full border border-[#D5650F]/20">
                  {p.source}
                </span>
                <span className="text-xs text-[#8F92A9]">Principle 0{idx + 1}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#1E2033]">
                {p.sanskrit}
              </h2>
              <h3 className="text-sm font-semibold text-[#585C7B] mt-0.5 mb-3">
                {p.concept}
              </h3>

              <p className="text-sm text-[#2C3048] leading-relaxed mb-4">
                {p.desc}
              </p>

              <blockquote className="border-l-2 border-[#D5650F] pl-4 py-2 italic text-sm text-[#585C7B] bg-[#F7F7F8] rounded-r-lg font-serif">
                {p.maxim}
              </blockquote>
            </div>
          ))}
        </div>

        {/* Closing Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-[#1E2033] text-white text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#D5650F] mx-auto flex items-center justify-center text-xl font-serif font-bold">
            चा
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal">
            Master Yourself Before You Rule
          </h2>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
            “He who has not overcome his own senses cannot govern his counselors; he who cannot govern his counselors cannot protect his empire.” — Arthashastra Book I
          </p>
          <div className="pt-2">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#F7F7F8] text-[#1E2033] px-6 py-3 text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <span>Ask Chanakya Everything Now</span>
              <span className="text-[#D5650F]">✦</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
