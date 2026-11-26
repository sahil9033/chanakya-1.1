'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import {
  Chakra,
  IconArrowRight,
  IconBolt,
  IconBook,
  IconCoins,
  IconCompass,
  IconLotus,
  IconNetwork,
  IconScale,
  IconShield,
  IconSplit,
  IconTarget,
} from './components/Icons'

const COUNSELS = [
  {
    tag: 'Negotiation',
    Icon: IconScale,
    title: 'The Asymmetric Underdog',
    prompt:
      'How to negotiate and prevail when the adversary commands vastly superior capital and leverage?',
  },
  {
    tag: 'Leadership',
    Icon: IconTarget,
    title: 'Commanding Absolute Loyalty',
    prompt:
      'What are the essential qualities of a leader who commands unwavering respect during internal crisis?',
  },
  {
    tag: 'Alliances',
    Icon: IconNetwork,
    title: 'Discerning True Deceit',
    prompt:
      'How does the Arthashastra recommend testing the hidden motives and loyalty of associates?',
  },
  {
    tag: 'Viveka',
    Icon: IconLotus,
    title: 'Detached, Decisive Execution',
    prompt:
      'How to apply Upaniṣadic discernment and Niṣkāma Karma to high-stakes conflict?',
  },
]

const PROTOCOL = [
  {
    sanskrit: 'सूत्रम्',
    label: 'The Root Sutra',
    desc: 'A razor-sharp aphorism, with translation, that names the universal strategic law governing your situation.',
  },
  {
    sanskrit: 'प्रज्ञा विमर्श',
    label: 'Diagnosis & Psychology',
    desc: 'A cold dissection of the counterpart\u2019s hidden motives, the true balance of leverage, and the soft points of advantage.',
  },
  {
    sanskrit: 'उपाय योजना',
    label: 'Strategic Manoeuvre',
    desc: 'Precise deployment of Sāma, Dāma, Bheda or Daṇḍa \u2014 and the asymmetric move that wins without brute force.',
  },
  {
    sanskrit: 'उपनिषद् विवेक',
    label: 'Inner Mastery',
    desc: 'The discipline of acting from unwavering stillness \u2014 free of anger, fear, sentimentality or desperation.',
  },
  {
    sanskrit: 'राजशासन',
    label: 'The Direct Decrees',
    desc: 'Three uncompromising, immediately executable directives \u2014 no platitudes, no hedging.',
  },
]

const DOCTRINE = [
  'Arthashastra',
  'Chāṇakya Nīti',
  'The 4 Upāyas',
  'Saptāṅga',
  'Ṣāḍguṇya',
  'Maṇḍala Theory',
  'Upaniṣadic Viveka',
  'Vedic Astrology',
  'Sidereal Kundali',
  'Nakshatra & Pada',
  'Vimshottari Dasha',
  'NVIDIA NIM',
]

const FRAMEWORKS = [
  {
    Icon: IconBolt,
    stat: '<2s',
    title: 'Flash deliberations',
    desc: 'Frontier inference on sovereign compute returns deep strategic counsel in under two seconds.',
  },
  {
    Icon: IconBook,
    stat: '15',
    title: 'Adhikaraṇas, zero platitudes',
    desc: 'Every answer is filtered against the full Arthashastra and stripped of modern corporate clichés.',
  },
  {
    Icon: IconLotus,
    stat: '∞',
    title: 'Inner sovereignty',
    desc: 'Power fused with Upaniṣadic detachment \u2014 decisive action, untouched by fear of the outcome.',
  },
]

const QUICK = [
  'How do I break a united coalition against me?',
  'My partner is negotiating behind my back.',
  'How to win when the odds are 90:10 against me?',
]

function ProtocolSection() {
  const [active, setActive] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.idx))
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <section className="relative border-y border-ink-line bg-cream py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-accent" />
              The Consultation Protocol
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Every counsel follows five decisive movements
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-pretty text-ink-soft">
              No stream-of-consciousness. Each reply is structured like a royal dispatch from the
              court of Pāṭaliputra.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-[240px_1fr]">
          {/* Sticky index */}
          <div className="hidden md:block">
            <div className="sticky top-24 space-y-1">
              {PROTOCOL.map((s, i) => (
                <button
                  key={s.sanskrit}
                  type="button"
                  onClick={() =>
                    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 ease-expo ${
                    active === i ? 'bg-canvas shadow-soft' : 'hover:bg-canvas/60'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular-nums transition-colors ${
                      active === i ? 'text-accent-deep' : 'text-ink-faint'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      active === i ? 'text-ink' : 'text-ink-soft'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-5">
            {PROTOCOL.map((s, i) => (
              <Reveal key={s.sanskrit}>
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  data-idx={i}
                  className={`spot group relative overflow-hidden rounded-3xl border bg-canvas p-7 transition-all duration-500 ease-expo sm:p-9 ${
                    active === i
                      ? 'border-accent/35 shadow-lift'
                      : 'border-ink-line shadow-xs hover:border-ink-line'
                  }`}
                >
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <div
                        className={`font-serif text-3xl leading-none transition-colors duration-500 ${
                          active === i ? 'text-accent' : 'text-ink-faint'
                        }`}
                      >
                        {s.sanskrit}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {s.label}
                      </h3>
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                      {String(i + 1).padStart(2, '0')} / 05
                    </span>
                  </div>
                  <p className="relative mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>

                  <span
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent to-transparent transition-transform duration-700 ease-expo ${
                      active === i ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [quickInput, setQuickInput] = useState('')

  function submit(text: string) {
    const q = text.trim()
    if (q) router.push(`/chat?prompt=${encodeURIComponent(q)}`)
  }

  return (
    <div className="relative flex flex-1 flex-col bg-canvas text-ink">
      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="mesh" aria-hidden="true">
          <span className="mesh-layer mesh-a" />
          <span className="mesh-layer mesh-b" />
          <span className="mesh-layer mesh-c" />
          <span className="mesh-layer mesh-d" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:pt-24">
          {/* Logo flower — forms behind the text */}
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10 sm:pt-16" aria-hidden="true">
            <div className="relative flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
              {/* Soft bloom halo */}
              <span
                className="absolute inset-0 rounded-full opacity-60 animate-aurora-breathe"
                style={{
                  background:
                    'radial-gradient(circle, rgba(167,139,250,0.28) 0%, rgba(253,186,116,0.18) 40%, rgba(94,234,212,0.12) 65%, transparent 75%)',
                  filter: 'blur(24px)',
                }}
              />
              {/* The logo — scales & blooms like a flower opening */}
              <span
                className="block h-full w-full animate-logo-bloom"
                style={{
                  backgroundImage: 'url(/logo.svg)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  maskImage: 'radial-gradient(circle, black 55%, transparent 72%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 55%, transparent 72%)',
                  opacity: 0.85,
                }}
              />
            </div>
          </div>

          {/* Content sits above the logo */}
          <div className="relative z-10">
            <Reveal className="flex justify-center" delay={60}>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Vedhh AI · Ask Chanakya
              </span>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="mt-7 text-balance font-serif text-5xl leading-[1.02] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
                Strategic counsel,{' '}
                <em className="italic text-accent-deep">grounded</em> in the Arthashastra
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                Vedhh AI answers your hardest calls — negotiation, leadership, crisis and alliances —
                from Kautilya&apos;s Arthashastra and Chāṇakya Nīti. It also computes your precise
                sidereal Kundali, Lagna to Vimshottari dasha, and interprets only the calculated chart.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas shadow-sm transition-all duration-300 hover:shadow-lift"
                >
                  <IconBolt width={16} height={16} className="text-accent" />
                  Ask Chanakya
                  <IconArrowRight
                    width={16}
                    height={16}
                    className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/astrology"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/60 px-6 py-3 text-sm font-medium text-ink backdrop-blur transition-all duration-300 hover:bg-cream hover:shadow-soft"
                >
                  <IconCompass width={16} height={16} className="text-accent" />
                  Generate your Kundali
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Ask bar */}
          <Reveal delay={300}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(quickInput)
              }}
              className="mx-auto mt-12 max-w-2xl"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-ink-line bg-canvas/80 p-1.5 pl-5 shadow-soft backdrop-blur-xl transition-all duration-300 focus-within:border-accent/45 focus-within:shadow-glow">
                <Chakra width={18} height={18} className="shrink-0 text-ink-faint" />
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Ask for counsel on statecraft, negotiation, or leadership…"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none sm:text-base"
                />
                <button
                  type="submit"
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 text-xs font-medium text-canvas transition-all duration-300 hover:shadow-lift sm:text-sm"
                >
                  Consult
                  <IconArrowRight
                    width={15}
                    height={15}
                    className="transition-transform duration-300 ease-expo group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  className="rounded-full border border-ink-line bg-canvas/60 px-3.5 py-1.5 text-xs text-ink-soft transition-all duration-300 hover:border-accent/35 hover:text-ink"
                >
                  {q}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- DOCTRINE MARQUEE ---------------- */}
      <section className="border-y border-ink-line bg-canvas py-6">
        <div className="marquee">
          <div className="marquee-track gap-3">
            {[...DOCTRINE, ...DOCTRINE].map((item, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-3 whitespace-nowrap px-3 text-sm font-medium text-ink-faint"
              >
                <span className="h-1 w-1 rounded-full bg-ink-line" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BENTO: FOUR COUNSELS ---------------- */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <Reveal>
                <span className="eyebrow">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  The Fourfold Doctrine
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
                  Choose your strategic inquiry
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <Link
                href="/chat"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Browse all tracks
                <IconArrowRight
                  width={16}
                  height={16}
                  className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COUNSELS.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <Link
                  href={`/chat?prompt=${encodeURIComponent(c.prompt)}`}
                  className="spot group flex h-full flex-col justify-between rounded-3xl border border-ink-line bg-canvas p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift"
                >
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line bg-cream text-ink transition-colors duration-500 group-hover:border-accent/30 group-hover:text-accent-deep">
                        <c.Icon width={20} height={20} />
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-pretty text-[15px] leading-relaxed text-ink-soft">
                      {c.prompt}
                    </p>
                  </div>
                  <span className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep">
                    Seek counsel
                    <IconArrowRight
                      width={16}
                      height={16}
                      className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROTOCOL (scroll-linked) ---------------- */}
      <ProtocolSection />

      {/* ---------------- FRAMEWORKS ---------------- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 max-w-xl">
            <Reveal>
              <span className="eyebrow">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Why it holds
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
                Ancient doctrine, frontier infrastructure
              </h2>
            </Reveal>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {FRAMEWORKS.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="spot group h-full rounded-3xl border border-ink-line bg-canvas p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-deep">
                      <f.Icon width={20} height={20} />
                    </span>
                    <span className="font-serif text-3xl leading-none text-ink">{f.stat}</span>
                  </div>
                  <h3 className="relative mt-6 text-lg font-semibold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="relative mt-2 text-pretty text-[15px] leading-relaxed text-ink-soft">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Split highlight */}
          <Reveal delay={120}>
            <div className="mt-4 grid overflow-hidden rounded-3xl border border-ink-line bg-cream md:grid-cols-2">
              <div className="p-8 sm:p-10">
                <h3 className="font-serif text-3xl leading-tight tracking-tight text-ink">
                  The 4 Upāyas, always in order
                </h3>
                <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-ink-soft">
                  Conciliation first. Concession second. Division third. Force last — and only with
                  total conviction. Chanakya never opens with the sword.
                </p>
                <Link
                  href="/chat?filter=arthashastra"
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-all duration-300 hover:shadow-lift"
                >
                  Ask Chanakya about the Upāyas
                  <IconArrowRight
                    width={16}
                    height={16}
                    className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-px bg-ink-line">
                {[
                  { Icon: IconScale, name: 'Sāma', sub: 'Conciliation' },
                  { Icon: IconCoins, name: 'Dāma', sub: 'Concession' },
                  { Icon: IconSplit, name: 'Bheda', sub: 'Division' },
                  { Icon: IconShield, name: 'Daṇḍa', sub: 'Force' },
                ].map((u) => (
                  <div
                    key={u.name}
                    className="group flex flex-col justify-between bg-canvas p-6 transition-colors duration-500 hover:bg-cream"
                  >
                    <u.Icon
                      width={22}
                      height={22}
                      className="text-ink-faint transition-colors duration-500 group-hover:text-accent-deep"
                    />
                    <div className="mt-8">
                      <div className="font-serif text-xl text-ink">{u.name}</div>
                      <div className="text-xs uppercase tracking-[0.12em] text-ink-faint">
                        {u.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-20 text-center">
          <div className="mesh" aria-hidden="true">
            <span className="mesh-layer mesh-c opacity-60" />
            <span className="mesh-layer mesh-b opacity-40" />
          </div>
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-canvas/20 bg-canvas/5 text-accent">
              <span className="animate-float-slow">
                <Chakra width={28} height={28} />
              </span>
            </span>
            <h2 className="mx-auto mt-7 max-w-2xl font-serif text-4xl leading-[1.06] tracking-tight text-canvas sm:text-5xl">
              Take counsel from history&apos;s greatest chancellor
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-canvas/60 sm:text-base">
              Negotiation, leadership, crisis and alliances — answered with the full weight of the
              Arthashastra.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-full bg-canvas px-6 py-3 text-sm font-medium text-ink transition-all duration-300 hover:shadow-glow"
              >
                <IconBolt width={16} height={16} className="text-accent" />
                Begin your consultation
                <IconArrowRight
                  width={16}
                  height={16}
                  className="transition-transform duration-300 ease-expo group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-canvas/25 px-6 py-3 text-sm font-medium text-canvas/85 transition-colors duration-300 hover:border-canvas/50 hover:text-canvas"
              >
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
