import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 15

interface OpenMeteoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  timezone: string
  country?: string
  country_code?: string
  admin1?: string
}

/**
 * Global place search. Proxies Open-Meteo's free geocoding API (no key) so the
 * client can resolve ANY place on earth — with latitude, longitude and IANA
 * timezone — rather than a curated city list.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', q)
  url.searchParams.set('count', '10')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VedhhAI/1.0 (https://vedhh-ai.vercel.app)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      return NextResponse.json({ results: [], error: 'geocoder_unavailable' })
    }
    const data = await res.json()
    const results = (data.results || []).map((r: OpenMeteoResult) => ({
      id: String(r.id),
      name: r.name,
      region: r.admin1 || '',
      country: r.country || '',
      countryCode: r.country_code || '',
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone || 'UTC',
    }))
    return NextResponse.json({ results })
  } catch {
    // Never fail hard — the client keeps its offline fallback list.
    return NextResponse.json({ results: [], error: 'geocoder_unavailable' })
  }
}
