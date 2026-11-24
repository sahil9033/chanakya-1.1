import { DateTime } from 'luxon'
import { buildChart, type BirthInput, type ChartData } from './chart'
import { currentDasha, dashaTimeline, mahadashas, type CurrentDasha, type DashaPeriod } from './dasha'
import { currentTransits, transitHouses, type TransitInfo } from './transits'
import { detectYogas, type Yoga } from './yogas'
import { lahiriAyanamsa, julianDay } from './ephemeris'
import { RASHIS, NAKSHATRAS } from './constants'

export interface KundaliResult {
  birthDetails: {
    dateOfBirth: string
    timeOfBirth: string
    place: string
    latitude: number
    longitude: number
    timezone: string
    utc: string
  }
  lagna: ChartData['lagna']
  planets: ChartData['planets']
  houses: ChartData['houses']
  nakshatra: {
    name: string
    devanagari: string
    number: number
    pada: number
    lord: string
  }
  aspects: ChartData['aspects']
  dashas: {
    mahadashas: Array<{ lord: string; start: string; end: string }>
    current: CurrentDasha | null
    upcoming: DashaPeriod[]
  }
  transits: {
    current: TransitInfo[]
    houses: ReturnType<typeof transitHouses>
  }
  yogas: Yoga[]
  ayanamsa: number
}

export function calculateKundali(input: BirthInput): KundaliResult {
  const [y, m, d] = input.dateOfBirth.split('-').map(Number)
  const [hh, mm] = input.timeOfBirth.split(':').map(Number)

  const dt = DateTime.fromObject(
    { year: y, month: m, day: d, hour: hh, minute: mm },
    { zone: input.timezone }
  )
  if (!dt.isValid) throw new Error(`Invalid birth date/time: ${dt.invalidReason}`)

  const utc = dt.toUTC().toJSDate()
  const jd = julianDay(utc)
  const ayanamsa = lahiriAyanamsa(jd)

  const chart = buildChart(input, utc, input.latitude, input.longitude, ayanamsa)

  const moon = chart.planets.find((p) => p.key === 'Moon')!
  const nakshatra = {
    name: moon.nakshatra,
    devanagari: moon.nakshatraDevanagari,
    number: moon.nakshatraNumber,
    pada: moon.pada,
    lord: NAKSHATRAS[moon.nakshatraNumber - 1].lord,
  }

  const maha = mahadashas(moon.longitude, utc)
  const current = currentDasha(moon.longitude, utc)
  const upcoming = dashaTimeline(moon.longitude, utc, 12)

  const transits = {
    current: currentTransits(new Date()),
    houses: transitHouses(chart.lagna.rashiNumber, new Date()),
  }

  const yogas = detectYogas(chart)

  return {
    birthDetails: {
      dateOfBirth: input.dateOfBirth,
      timeOfBirth: input.timeOfBirth,
      place: input.place,
      latitude: input.latitude,
      longitude: input.longitude,
      timezone: input.timezone,
      utc: utc.toISOString(),
    },
    lagna: chart.lagna,
    planets: chart.planets,
    houses: chart.houses,
    nakshatra,
    aspects: chart.aspects,
    dashas: {
      mahadashas: maha.map((p) => ({
        lord: p.lord,
        start: p.start.toISOString()!,
        end: p.end.toISOString()!,
      })),
      current,
      upcoming,
    },
    transits,
    yogas,
    ayanamsa,
  }
}

export { RASHIS, NAKSHATRAS }
export type { BirthInput } from './chart'
