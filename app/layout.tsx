import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '../lib/AuthContext'

export const metadata: Metadata = {
  title: 'Chanakya — Sovereign Strategic Intelligence',
  description:
    'Strategic counsel from Acharya Chanakya, grounded in the Arthashastra, Chanakya Niti and Upanishadic Viveka. Answered in under two seconds on sovereign compute.',
  keywords: [
    'Chanakya',
    'Arthashastra',
    'strategic intelligence',
    'Kautilya',
    'statecraft',
    'AI',
  ],
  openGraph: {
    title: 'Chanakya — Sovereign Strategic Intelligence',
    description:
      'Strategic counsel from Acharya Chanakya, grounded in the Arthashastra, Chanakya Niti and Upanishadic Viveka.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
      />
      <body className="bg-canvas text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
