import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import {
  Chakra,
  IconArrowRight,
  IconBook,
  IconBolt,
  IconCompass,
  IconScale,
  IconTarget,
} from '../components/Icons'

const PILLARS = [
  {
    sanskrit: 'विवेक',
    roman: 'Viveka',
    concept: 'Discernment — sifting gold from dross',
    source: 'Katha & Māṇḍūkya Upaniṣads',
    Icon: IconCompass,
    desc: 'The faculty of piercing through surface deception to see unvarnished reality. A strategist without Viveka reacts to illusions; a master strikes at the root.',
    maxim:
      'The wise choose the good (Śreya), while the undisciplined choose only the pleasant (Preya).',
  },
  {
    sanskrit: 'निःकाम कर्म',
    roman: 'Niṣkāma Karma',
    concept: 'Action without emotional fever',
    source: 'Īśa Upaniṣad & Bhagavad Gītā',
    Icon: IconTarget,
    desc: 'Executing duty with supreme precision while remaining detached from anxiety over the outcome. Fear of defeat paralyses execution; detachment breeds effortless mastery.',
    maxim:
      'Perform your duty with an even mind, unattached to victory or defeat. Equanimity is true yoga.',
  },
  {
    sanskrit: 'सत्य & धर्म',
    roman: 'Satya & Dharma',
    concept: 'The cosmic axis of sustainable power',
    source: 'Bṛhadāraṇyaka Upaniṣad',
    Icon: IconScale,
    desc: 'Power devoid of Dharma collapses under its own rot. The ruler uses harsh expedients only to preserve the righteous order of the cosmos and the welfare of the people.',
    maxim:
      'Dharma protects those who protect it. An unjust empire falls from within before external foes arrive.',
  },
  {
    sanskrit: 'चाणक्य नीति',
    roman: 'Chāṇakya Nīti',
    concept: 'Cold realism in human dynamics',
    source: 'Chāṇakya Nīti Darpaṇa',
    Icon: IconBook,
    desc: 'Human beings are driven by fear, greed, pride and loyalty. Test men in calamity, servants in duty, friends in adversity. Never trust an unverified oath.',
    maxim:
      'A snake is dangerous even if not venomous; it must raise its hood. A leader must maintain unshakeable deterrence.',
  },
]

export default function PhilosophyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-canvas text-ink">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-ink-line">
        <div className="mesh" aria-hidden="true">
          <span className="mesh-layer mesh-a" />
          <span className="mesh-layer mesh-c" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              The Vedic bedrock
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-balance font-serif text-5xl leading-[1.04] tracking-tightest text-ink sm:text-6xl">
              The philosophy of Chanakya &amp; the Upaniṣads
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              Where realpolitik meets the transcendental detachment of the Upaniṣads. True
              sovereignty is not brute force — it is internal mastery translated into external
              statecraft.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-9 flex justify-center">
              <Link
                href="/chat?filter=upanishad"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-lift"
              >
                <IconBolt width={16} height={16} className="text-accent" />
                Consult with the Upaniṣadic filter
                <IconArrowRight
                  width={16}
                  height={16}
                  className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="space-y-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.roman} delay={(i % 2) * 60}>
                <article className="spot group grid gap-8 rounded-3xl border border-ink-line bg-canvas p-7 transition-all duration-500 ease-expo hover:border-accent/25 hover:shadow-lift sm:p-10 md:grid-cols-[1fr_1.4fr]">
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line bg-cream text-ink transition-colors duration-500 group-hover:border-accent/30 group-hover:text-accent-deep">
                        <p.Icon width={20} height={20} />
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                        Principle {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mt-6 font-serif text-3xl leading-none tracking-tight text-ink sm:text-4xl">
                      {p.sanskrit}
                    </div>
                    <div className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-accent-deep">
                      {p.roman}
                    </div>
                    <div className="mt-1 text-xs text-ink-faint">{p.source}</div>
                  </div>

                  <div className="relative">
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{p.concept}</h3>
                    <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-soft">
                      {p.desc}
                    </p>
                    <blockquote className="mt-5 rounded-r-xl border-l-2 border-accent bg-cream py-3 pl-4 pr-3 font-serif text-[15px] italic leading-relaxed text-ink-soft">
                      {p.maxim}
                    </blockquote>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing banner */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-ink px-6 py-20 text-center">
          <div className="mesh" aria-hidden="true">
            <span className="mesh-layer mesh-c opacity-60" />
            <span className="mesh-layer mesh-a opacity-35" />
          </div>
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-accent">
              <span className="animate-float-slow">
                <Chakra width={28} height={28} />
              </span>
            </span>
            <h2 className="mx-auto mt-7 max-w-2xl font-serif text-4xl leading-[1.06] tracking-tight text-white sm:text-5xl">
              Master yourself before you rule
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
              He who has not overcome his own senses cannot govern his counsellors; he who cannot
              govern his counsellors cannot protect his empire.
            </p>
            <div className="mt-9 flex justify-center">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-all duration-300 hover:shadow-glow"
              >
                <IconBolt width={16} height={16} className="text-accent" />
                Ask Chanakya everything
                <IconArrowRight
                  width={16}
                  height={16}
                  className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
