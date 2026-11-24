import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import {
  Chakra,
  IconArrowRight,
  IconBolt,
  IconBook,
  IconCompass,
  IconLinkedIn,
} from '../components/Icons'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'

export const metadata: Metadata = {
  title: 'About — Sahil Dadaso Patil & Vedhh AI',
  description:
    'Vedhh AI is a Vedic astrology and Kundali AI founded by Sahil Dadaso Patil. Learn how Vedhh AI calculates precise sidereal charts and interprets them with grounded AI.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    title: 'About — Sahil Dadaso Patil & Vedhh AI',
    description:
      'Vedhh AI is a Vedic astrology and Kundali AI founded by Sahil Dadaso Patil.',
  },
}

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sahil Dadaso Patil',
  url: 'https://www.linkedin.com/in/sahil-dadaso-patil/',
  sameAs: ['https://www.linkedin.com/in/sahil-dadaso-patil/'],
  jobTitle: 'Founder',
  worksFor: { '@type': 'Organization', name: 'Vedhh AI', url: SITE_URL },
}

const BUILDS = [
  {
    Icon: IconCompass,
    title: 'Kundali AI',
    desc: 'A precise sidereal Vedic birth chart — Lagna, grahas, nakshatra and pada, houses, dignity, Vimshottari dasha and transits — calculated deterministically, then interpreted.',
    href: '/astrology',
  },
  {
    Icon: IconBook,
    title: 'Nadi Astrology',
    desc: 'Traditional Vedic techniques applied to your exact chart: drishti, house lordship, yogas and dasha timing — never generic horoscope text.',
    href: '/astrology',
  },
  {
    Icon: IconBolt,
    title: 'Ask Chanakya',
    desc: 'Strategic counsel grounded in Kautilya’s Arthashastra, Chanakya Niti and the Upaniṣadic discipline of discernment.',
    href: '/chat',
  },
]

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
      />
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
              About us
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-balance font-serif text-5xl leading-[1.04] tracking-tightest text-ink sm:text-6xl">
              Vedhh AI — Vedic astrology, calculated honestly
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              Vedhh AI is a Vedic astrology and Kundali AI. It never guesses planetary positions — it
              computes a precise sidereal chart from your exact birth time and place, then interprets
              only what the chart actually contains.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="spot grid gap-8 rounded-3xl border border-ink-line bg-canvas p-8 shadow-soft sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex justify-center md:justify-start">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-ink-line bg-cream text-ink">
                  <Chakra width={36} height={36} />
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-deep">
                  Founder
                </span>
                <h2 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-ink">
                  Sahil Dadaso Patil
                </h2>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-soft">
                  Sahil Dadaso Patil is the founder and builder of Vedhh AI. He works at the
                  intersection of astronomy, classical Jyotish and applied AI — designing a system
                  where the chart is calculated deterministically and the language model only
                  interprets, never invents. Vedhh AI is his attempt to make Vedic astrology precise,
                  transparent and honest about what a chart can and cannot say.
                </p>
                <Link
                  href="https://www.linkedin.com/in/sahil-dadaso-patil/"
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lift"
                >
                  <IconLinkedIn width={16} height={16} />
                  Connect on LinkedIn
                  <IconArrowRight
                    width={16}
                    height={16}
                    className="text-accent transition-transform duration-300 ease-expo group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we build */}
      <section className="border-t border-ink-line bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <span className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-accent" />
              What we build
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
              One engine, honest answers
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {BUILDS.map((b, i) => (
              <Reveal key={b.title} delay={i * 70}>
                <Link
                  href={b.href}
                  className="spot group flex h-full flex-col justify-between rounded-3xl border border-ink-line bg-canvas p-7 transition-all duration-500 ease-expo hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift"
                >
                  <div className="relative">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line bg-cream text-ink transition-colors duration-500 group-hover:border-accent/30 group-hover:text-accent-deep">
                      <b.Icon width={20} height={20} />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">{b.title}</h3>
                    <p className="mt-2 text-pretty text-[15px] leading-relaxed text-ink-soft">
                      {b.desc}
                    </p>
                  </div>
                  <span className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep">
                    Explore
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

          <Reveal delay={120}>
            <p className="mt-10 max-w-3xl text-pretty text-sm leading-relaxed text-ink-soft">
              Birth details are personal data. Vedhh AI calculates on the server, keeps model API keys
              off the client, and never fabricates a planetary position. Where the chart does not
              strongly support a reading, Vedhh AI says so.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
