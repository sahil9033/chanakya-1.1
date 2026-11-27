import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { IconArrowRight, IconBolt, IconBook, IconCompass } from '../components/Icons'
import { LEARN_ARTICLES } from '../../lib/learn'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'
).replace(/\/$/, '')

const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Vedhh AI — Arthashastra-grounded strategy and precise Vedic Kundali',
}

export const metadata: Metadata = {
  title: 'Learn — Arthashastra Strategy & Vedic Astrology',
  description:
    'Plain-English guides to the Arthashastra and Vedic astrology: the four upāyas (sama, dama, bheda, danda), Chanakya Niti for negotiation, Lahiri ayanamsa, Vimshottari dasha and how to read a Kundali.',
  alternates: { canonical: '/learn' },
  openGraph: {
    type: 'website',
    title: 'Learn — Arthashastra Strategy & Vedic Astrology',
    description:
      'Plain-English guides to the Arthashastra, Chanakya Niti and Vedic astrology — written to answer real questions.',
    url: `${SITE_URL}/learn`,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn — Arthashastra Strategy & Vedic Astrology',
    description:
      'Plain-English guides to the Arthashastra, Chanakya Niti and Vedic astrology.',
    images: [OG_IMAGE.url],
  },
}

const COLLECTION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Learn — Arthashastra Strategy & Vedic Astrology',
  url: `${SITE_URL}/learn`,
  isPartOf: { '@type': 'WebSite', name: 'Vedhh AI', url: SITE_URL },
  hasPart: LEARN_ARTICLES.map((a) => ({
    '@type': 'Article',
    headline: a.title,
    url: `${SITE_URL}/learn/${a.slug}`,
    description: a.description,
  })),
}

const TRACKS = [
  {
    Icon: IconBolt,
    title: 'Strategy & statecraft',
    desc: 'The Arthashastra as a working manual — influence, negotiation, alliances and leadership.',
    href: '/chat',
    cta: 'Ask Chanakya',
  },
  {
    Icon: IconCompass,
    title: 'Vedic astrology',
    desc: 'Sidereal charts made legible: the ayanamsa, the dasha system and how a Kundali is read.',
    href: '/astrology',
    cta: 'Calculate a Kundali',
  },
]

export default function LearnIndexPage() {
  return (
    <div className="relative flex flex-1 flex-col bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_JSON_LD) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-ink-line">
        <div className="mesh" aria-hidden="true">
          <span className="mesh-layer mesh-c" />
          <span className="mesh-layer mesh-b" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-24">
          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
              <IconBook width={13} height={13} className="text-accent" />
              Learn
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-balance font-serif text-5xl leading-[1.04] tracking-tightest text-ink sm:text-6xl">
              Arthashastra &amp; Vedic astrology, explained
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              Short, plain-English guides to the ideas behind Vedhh AI — the four upāyas of the
              Arthashastra, Chanakya Niti for negotiation, the Lahiri ayanamsa, Vimshottari dasha and
              how to read a Kundali. No jargon, no filler.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Article grid */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LEARN_ARTICLES.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 70} className="h-full">
              <Link
                href={`/learn/${a.slug}`}
                className="spot group flex h-full flex-col rounded-3xl border border-ink-line bg-canvas p-6 transition-all duration-500 ease-expo hover:border-accent/25 hover:shadow-soft"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow">{a.kicker}</span>
                  <span className="text-[11px] text-ink-faint">{a.readMinutes} min read</span>
                </div>
                <h2 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-ink">
                  {a.title}
                </h2>
                <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-ink-soft">
                  {a.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-deep">
                  Read the guide
                  <IconArrowRight
                    width={15}
                    height={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bridges to the product */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {TRACKS.map((t, i) => (
            <Reveal key={t.title} delay={i * 70} className="h-full">
              <Link
                href={t.href}
                className="spot group flex h-full flex-col rounded-3xl border border-ink-line bg-cream p-7 transition-all duration-500 ease-expo hover:border-accent/25 hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line bg-canvas text-ink transition-colors duration-500 group-hover:border-accent/30 group-hover:text-accent-deep">
                  <t.Icon width={20} height={20} />
                </span>
                <h2 className="mt-5 font-serif text-2xl leading-tight tracking-tight text-ink">
                  {t.title}
                </h2>
                <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-ink-soft">
                  {t.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-deep">
                  {t.cta}
                  <IconArrowRight
                    width={15}
                    height={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
