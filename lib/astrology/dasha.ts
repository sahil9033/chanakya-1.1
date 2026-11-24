import { DASHA_SEQUENCE, type PlanetKey } from './constants'
import { wrapLongitude } from './chart'

const NAKSHATRA_SPAN = 360 / 27

export interface DashaPeriod {
  mahadasha: PlanetKey
  antardasha: PlanetKey
  start: Date
  end: Date
}

export interface CurrentDasha {
  mahadasha: PlanetKey
  antardasha: PlanetKey
  mahadashaStart: Date
  mahadashaEnd: Date
  antardashaStart: Date
  antardashaEnd: Date
  remainingMahadashaYears: number
}

/**
 * Vimshottari dasha start at birth.
 * The current mahadasha at birth is determined by the Moon's nakshatra lord.
 * Elapsed fraction = Moon's position within its nakshatra / nakshatra span.
 */
function birthDashaState(moonLongitude: number, birthDate: Date) {
  const moonLon = wrapLongitude(moonLongitude)
  const nakIndex = Math.floor(moonLon / NAKSHATRA_SPAN)
  const lordIndex = nakIndex % 9
  const nakshatraStart = nakIndex * NAKSHATRA_SPAN
  const withinNak = moonLon - nakshatraStart
  const fraction = withinNak / NAKSHATRA_SPAN

  const dasha = DASHA_SEQUENCE[lordIndex]
  const elapsedYears = fraction * dasha.years
  const elapsedMs = elapsedYears * 365.25 * 24 * 3600 * 1000
  const dashaStart = new Date(birthDate.getTime() - elapsedMs)
  return { dashaStart, startIndex: lordIndex }
}

/** All mahadasha periods from birth for 120 years. */
export function mahadashas(moonLongitude: number, birthDate: Date) {
  const { dashaStart, startIndex } = birthDashaState(moonLongitude, birthDate)
  const periods: { lord: PlanetKey; start: Date; end: Date }[] = []
  let cursor = dashaStart
  for (let i = 0; i < 9; i++) {
    const d = DASHA_SEQUENCE[(startIndex + i) % 9]
    const end = new Date(cursor.getTime() + d.years * 365.25 * 24 * 3600 * 1000)
    periods.push({ lord: d.lord, start: new Date(cursor), end })
    cursor = end
  }
  return periods
}

/** Antardasha list within a mahadasha. */
function antardashas(mahaLord: PlanetKey, mahaStart: Date, mahaYears: number) {
  const mahaIdx = DASHA_SEQUENCE.findIndex((d) => d.lord === mahaLord)
  const out: DashaPeriod[] = []
  let cursor = mahaStart
  for (let i = 0; i < 9; i++) {
    const sub = DASHA_SEQUENCE[(mahaIdx + i) % 9]
    const years = (sub.years / 120) * mahaYears
    const end = new Date(cursor.getTime() + years * 365.25 * 24 * 3600 * 1000)
    out.push({
      mahadasha: mahaLord,
      antardasha: sub.lord,
      start: new Date(cursor),
      end,
    })
    cursor = end
  }
  return out
}

export function currentDasha(moonLongitude: number, birthDate: Date, at: Date = new Date()): CurrentDasha | null {
  const mahaList = mahadashas(moonLongitude, birthDate)
  const maha = mahaList.find((p) => at >= p.start && at < p.end)
  if (!maha) return null

  const mahaYears = DASHA_SEQUENCE.find((d) => d.lord === maha.lord)!.years
  const subs = antardashas(maha.lord, maha.start, mahaYears)
  const sub = subs.find((s) => at >= s.start && at < s.end)
  if (!sub) return null

  return {
    mahadasha: maha.lord,
    antardasha: sub.antardasha,
    mahadashaStart: maha.start,
    mahadashaEnd: maha.end,
    antardashaStart: sub.start,
    antardashaEnd: sub.end,
    remainingMahadashaYears: (maha.end.getTime() - at.getTime()) / (365.25 * 24 * 3600 * 1000),
  }
}

/** Full dasha timeline for a number of years ahead. */
export function dashaTimeline(moonLongitude: number, birthDate: Date, yearsAhead = 10) {
  const mahaList = mahadashas(moonLongitude, birthDate)
  const now = Date.now()
  const horizon = now + yearsAhead * 365.25 * 24 * 3600 * 1000
  const periods: DashaPeriod[] = []
  mahaList.forEach((m) => {
    const mahaYears = DASHA_SEQUENCE.find((d) => d.lord === m.lord)!.years
    const subs = antardashas(m.lord, m.start, mahaYears)
    subs.forEach((s) => {
      if (s.end.getTime() >= now && s.start.getTime() <= horizon) periods.push(s)
    })
  })
  return periods
}
