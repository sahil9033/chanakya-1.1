import type { MetadataRoute } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'
).replace(/\/$/, '')

// Hard-code a build-time date so the sitemap is stable across SSR/ISR renders.
// Update this whenever content changes significantly.
const LAST_MODIFIED = new Date('2026-11-26')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/chat`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/astrology`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
