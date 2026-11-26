import type { Metadata } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Chanakya Philosophy — Arthashastra & Ancient Wisdom',
  description:
    'Explore the timeless philosophy of Chanakya — Arthashastra statecraft, Chanakya Niti, and Upanishadic wisdom. AI-powered counsel rooted in ancient Indian strategic thought.',
  keywords: [
    'Chanakya philosophy',
    'Arthashastra',
    'Chanakya Niti',
    'Kautilya',
    'Indian philosophy AI',
    'strategic wisdom',
    'Upanishad wisdom',
    'ancient Indian statecraft',
    'Chanakya teachings',
    'Indian philosophy',
  ],
  alternates: { canonical: `${SITE_URL}/philosophy` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/philosophy`,
    title: 'Chanakya Philosophy — Arthashastra & Ancient Wisdom — Vedhh AI',
    description:
      'AI counsel grounded in Chanakya\'s Arthashastra, Chanakya Niti, and Upanishadic Viveka. Ancient wisdom for modern decisions.',
    siteName: 'Vedhh AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chanakya Philosophy — Arthashastra & Ancient Wisdom',
    description:
      'AI counsel grounded in Chanakya\'s Arthashastra and Upanishadic wisdom.',
  },
}

export default function PhilosophyLayout({ children }: { children: React.ReactNode }) {
  return children
}
