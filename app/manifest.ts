import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vedhh AI — Vedic Astrology & Kundali AI',
    short_name: 'Vedhh AI',
    description:
      'Vedhh AI calculates a precise sidereal (Lahiri) Vedic Kundali and interprets it with grounded AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16171D',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
