import type { Metadata } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Free Vedic Kundali & Birth Chart AI — Vedhh AI',
  description:
    'Generate your free Vedic Kundali instantly. Precise sidereal Lahiri birth chart — Lagna, planets, Nakshatra, Vimshottari Dasha, houses — with grounded AI interpretation. No signup needed.',
  keywords: [
    'free kundali online',
    'janam kundli',
    'Vedic birth chart',
    'Kundali AI',
    'Nadi astrology',
    'sidereal astrology',
    'Lahiri ayanamsa',
    'Vimshottari dasha calculator',
    'nakshatra finder',
    'lagna chart',
    'planetary positions today',
    'vedic astrology AI',
    'jyotish chart',
    'online kundali maker free',
  ],
  alternates: { canonical: `${SITE_URL}/astrology` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/astrology`,
    title: 'Free Vedic Kundali & Birth Chart AI — Vedhh AI',
    description:
      'Enter your birth details — get a precise sidereal Kundali with AI interpretation. Free, instant, grounded in real Jyotish technique.',
    siteName: 'Vedhh AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Vedic Kundali & Birth Chart AI — Vedhh AI',
    description:
      'Free Vedic Kundali with sidereal calculation and AI-powered interpretation.',
  },
}

export default function AstrologyLayout({ children }: { children: React.ReactNode }) {
  return children
}
