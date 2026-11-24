import {
  DEBILITATION,
  EXALTATION,
  NAKSHATRAS,
  OWNERSHIP,
  PLANETS,
  RASHIS,
  COMBUSTION_ORBS,
  type PlanetKey,
} from './constants'
import {
  angularSeparation,
  isRetrograde,
  planetLongitude,
  siderealAscendant,
} from './ephemeris'

const NAKSHATRA_SPAN = 360 / 27 // 13.3333°
const PADA_SPAN = NAKSHATRA_SPAN / 4 // 3.3333°

export interface PlanetPosition {
  key: PlanetKey
  name: string
  longitude: number // sidereal degrees 0-360
  rashiNumber: number // 1-12
  rashi: string
  rashiDevanagari: string
  degreeInRashi: number // degrees within rashi
  nakshatra: string
  nakshatraDevanagari: string
  nakshatraNumber: number // 1-27
  pada: number // 1-4
  house: number // 1-12 (whole sign)
  houseLord: string
  dignity: 'Exalted' | 'Debilitated' | 'Own sign' | 'Moolatrikona' | 'Neutral'
  retrograde: boolean
  combust: boolean
}

export interface HouseInfo {
  number: number
  rashiNumber: number
  rashi: string
  lord: string
  planets: string[] // planet keys in this house
}

export interface ChartData {
  planets: PlanetPosition[]
  houses: HouseInfo[]
  lagna: {
    rashiNumber: number
    rashi: string
    rashiDevanagari: string
    longitude: number
    degreeInRashi: number
  }
  aspects: Array<{
    from: string
    to: string
    type: 'Seventh' | 'Special'
    houses: number
  }>
  ayanamsa: number
}

export interface BirthInput {
  dateOfBirth: string // YYYY-MM-DD
  timeOfBirth: string // HH:mm
  place: string
  latitude: number
  longitude: number
  timezone: string
}

function wrapLongitude(lon: number): number {
  return ((lon % 360) + 360) % 360
}

function rashiOf(lon: number): number {
  return Math.floor(wrapLongitude(lon) / 30) + 1
}

function nakshatraOf(lon: number) {
  const l = wrapLongitude(lon)
  const index = Math.floor(l / NAKSHATRA_SPAN)
  const within = l - index * NAKSHATRA_SPAN
  const pada = Math.floor(within / PADA_SPAN) + 1
  return { index, pada, nakshatra: NAKSHATRAS[index], within }
}

function dignityOf(key: PlanetKey, rashiNumber: number): PlanetPosition['dignity'] {
  if (EXALTATION[key] === rashiNumber) return 'Exalted'
  if (DEBILITATION[key] === rashiNumber) return 'Debilitated'
  if (OWNERSHIP[key]?.includes(rashiNumber)) return 'Own sign'
  return 'Neutral'
}

/**
 * Build the full sidereal birth chart. Whole-sign houses.
 * Deterministic — no LLM involvement.
 */
export function buildChart(birth: BirthInput, dateUTC: Date, lat: number, lon: number, ayanamsa: number): ChartData {
  const lagnaLon = siderealAscendant(dateUTC, lat, lon)
  const lagnaRashi = rashiOf(lagnaLon)

  const planets: PlanetPosition[] = PLANETS.map((key) => {
    const lon = planetLongitude(key, dateUTC)
    const rNum = rashiOf(lon)
    const rashi = RASHIS[rNum - 1]
    const withinRashi = wrapLongitude(lon) - (rNum - 1) * 30
    const { nakshatra, pada, index } = nakshatraOf(lon)
    const house = ((rNum - lagnaRashi + 12) % 12) + 1
    const retro = isRetrograde(key, dateUTC)
    const combust = isCombust(key, lon, dateUTC)
    return {
      key,
      name: key,
      longitude: lon,
      rashiNumber: rNum,
      rashi: rashi.name,
      rashiDevanagari: rashi.devanagari,
      degreeInRashi: withinRashi,
      nakshatra: nakshatra.name,
      nakshatraDevanagari: nakshatra.devanagari,
      nakshatraNumber: index + 1,
      pada,
      house,
      houseLord: rashi.lord,
      dignity: dignityOf(key, rNum),
      retrograde: retro,
      combust,
    }
  })

  const houses: HouseInfo[] = Array.from({ length: 12 }, (_, i) => {
    const rNum = ((lagnaRashi - 1 + i) % 12) + 1
    const rashi = RASHIS[rNum - 1]
    return {
      number: i + 1,
      rashiNumber: rNum,
      rashi: rashi.name,
      lord: rashi.lord,
      planets: planets.filter((p) => p.house === i + 1).map((p) => p.key),
    }
  })

  const aspects = computeAspects(planets, lagnaRashi)

  return {
    planets,
    houses,
    lagna: {
      rashiNumber: lagnaRashi,
      rashi: RASHIS[lagnaRashi - 1].name,
      rashiDevanagari: RASHIS[lagnaRashi - 1].devanagari,
      longitude: lagnaLon,
      degreeInRashi: wrapLongitude(lagnaLon) - (lagnaRashi - 1) * 30,
    },
    aspects,
    ayanamsa,
  }
}

function isCombust(key: PlanetKey, lon: number, dateUTC: Date): boolean {
  if (key === 'Sun' || key === 'Rahu' || key === 'Ketu') return false
  const orb = COMBUSTION_ORBS[key] ?? 12
  const sunLon = planetLongitude('Sun', dateUTC)
  return angularSeparation(lon, sunLon) <= orb
}

/**
 * Vedic aspects (drishti):
 * - All planets cast 7th-house aspect.
 * - Mars: also 4th & 8th
 * - Jupiter: also 5th & 9th
 * - Saturn: also 3rd & 10th
 * Sun, Moon, Mercury, Venus cast only the 7th.
 */
function computeAspects(planets: PlanetPosition[], lagnaRashi: number) {
  const aspects: ChartData['aspects'] = []
  const byHouse = new Map<number, PlanetPosition[]>()
  planets.forEach((p) => {
    const arr = byHouse.get(p.house) ?? []
    arr.push(p)
    byHouse.set(p.house, arr)
  })

  const special: Record<string, number[]> = {
    Mars: [4, 8],
    Jupiter: [5, 9],
    Saturn: [3, 10],
  }

  planets.forEach((from) => {
    const targets = new Set<number>([7, ...(special[from.key] ?? [])])
    targets.forEach((h) => {
      const targetHouse = ((from.house - 1 + h - 1) % 12) + 1
      const residents = byHouse.get(targetHouse) ?? []
      residents.forEach((to) => {
        if (to.key === from.key) return
        aspects.push({
          from: from.key,
          to: to.key,
          type: h === 7 ? 'Seventh' : 'Special',
          houses: h,
        })
      })
    })
  })
  return aspects
}

export { rashiOf, nakshatraOf, wrapLongitude }
