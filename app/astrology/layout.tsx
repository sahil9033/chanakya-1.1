import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kundali AI — Free Vedic Birth Chart & Nadi Astrology',
  description:
    'Generate a precise sidereal Vedic Kundali with Vedhh AI. Deterministic Lahiri calculations for Lagna, planets, nakshatra, houses, Vimshottari dasha and transits — interpreted with grounded, chart-referenced AI.',
  keywords: [
    'Kundali AI',
    'free kundali',
    'janam kundli',
    'Vedic birth chart',
    'Nadi astrology',
    'sidereal astrology',
    'Lahiri ayanamsa',
    'Vimshottari dasha',
    'nakshatra',
    'lagna',
    'planetary positions',
    'vedic astrology AI',
  ],
  alternates: { canonical: '/astrology' },
  openGraph: {
    type: 'website',
    title: 'Kundali AI — Free Vedic Birth Chart & Nadi Astrology',
    description:
      'Precise sidereal Vedic Kundali calculation with grounded AI interpretation — Lagna, planets, nakshatra, dasha and transits.',
  },
}

export default function AstrologyLayout({ children }: { children: React.ReactNode }) {
  return children
}
