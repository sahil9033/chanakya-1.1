import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '../lib/AuthContext'
import Navbar from './components/Navbar'
import MusicPlayer from './components/MusicPlayer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vedhh AI — Strategic Counsel & Vedic Astrology',
    template: '%s · Vedhh AI',
  },
  description:
    'Vedhh AI is a strategic-intelligence engine — ask Chanakya for Arthashastra-grounded counsel on negotiation, leadership, crisis and alliances. It also computes a precise sidereal (Lahiri) Kundali — Lagna, planets, nakshatra, Vimshottari dasha and transits — then interprets only the calculated chart.',
  applicationName: 'Vedhh AI',
  keywords: [
    'Vedhh AI',
    'Vedhh',
    'vedhh ai',
    'VedhhAI',
    'Vedic astrology',
    'Vedic astrology AI',
    'Kundali',
    'Kundali AI',
    'birth chart',
    'janam kundli',
    'Nadi astrology',
    'sidereal astrology',
    'Lahiri ayanamsa',
    'Vimshottari dasha',
    'nakshatra',
    'lagna',
    'astrology AI',
    'AI astrology',
    'jyotish',
    'online kundali',
    'Arthashastra',
    'Chanakya',
  ],
  authors: [{ name: 'Sahil Dadaso Patil', url: 'https://www.linkedin.com/in/sahil-dadaso-patil/' }],
  creator: 'Sahil Dadaso Patil',
  publisher: 'Vedhh AI',
  category: 'Astrology',
  alternates: { canonical: '/' },
  verification: {
    google: 'LAz9BR_TpVtxTM4Csq_5W2Xn9rpaAFc-iYh8Ca3dMSo',
  },
  openGraph: {
    type: 'website',
    siteName: 'Vedhh AI',
    url: SITE_URL,
    title: 'Vedhh AI — Strategic Counsel & Vedic Astrology',
    description:
      'Ask Chanakya for Arthashastra-grounded strategic counsel, and calculate a precise sidereal Vedic Kundali. Strategy first, deterministic astronomy, grounded interpretation.',
  },
  twitter: {
    card: 'summary',
    title: 'Vedhh AI — Strategic Counsel & Vedic Astrology',
    description:
      'Ask Chanakya for strategic counsel, and calculate a precise sidereal Vedic Kundali.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0B0F' },
  ],
  width: 'device-width',
  initialScale: 1,
}

/** Applies the saved (or system) theme before first paint to avoid a flash. */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('vedhh-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark')}}catch(e){}})();`

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Vedhh AI',
      description: 'Vedic astrology and Kundali AI — precise sidereal charts with grounded interpretation.',
      inLanguage: 'en',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Vedhh AI',
      url: SITE_URL,
      description: 'Vedhh AI builds Vedic astrology (Kundali) and strategic-intelligence tools.',
      founder: {
        '@type': 'Person',
        name: 'Sahil Dadaso Patil',
        sameAs: 'https://www.linkedin.com/in/sahil-dadaso-patil/',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Vedhh AI',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description:
        'Vedhh AI generates a sidereal (Lahiri ayanamsa) Vedic birth chart from exact birth details and interprets it with AI.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
      />
      <body className="flex min-h-dvh flex-col bg-canvas text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* Navbar lives in the layout so it persists across route changes and
            never re-mounts (no blink) — only the page content swaps below. */}
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        <MusicPlayer />
      </body>
    </html>
  )
}
