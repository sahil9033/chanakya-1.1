import { RASHIS, PLANETS, type PlanetKey } from './constants'
import { isRetrograde, planetLongitude } from './ephemeris'
import { rashiOf, wrapLongitude } from './chart'

export interface TransitInfo {
  planet: PlanetKey
  rashiNumber: number
  rashi: string
  longitude: number
  degreeInRashi: number
  retrograde: boolean
}

/** Current sidereal planetary transits (as of `date`). */
export function currentTransits(date: Date = new Date()): TransitInfo[] {
  return PLANETS.map((key) => {
    const lon = wrapLongitude(planetLongitude(key, date))
    const rNum = rashiOf(lon)
    return {
      planet: key,
      rashiNumber: rNum,
      rashi: RASHIS[rNum - 1].name,
      longitude: lon,
      degreeInRashi: lon - (rNum - 1) * 30,
      retrograde: isRetrograde(key, date),
    }
  })
}

/**
 * Simple transit outlook: which natal houses the slow movers (Jupiter, Saturn, Rahu)
 * are currently transiting, relative to the natal lagna rashi.
 */
export function transitHouses(lagnaRashi: number, date: Date = new Date()) {
  const slow: PlanetKey[] = ['Jupiter', 'Saturn', 'Rahu', 'Ketu']
  return slow.map((p) => {
    const lon = wrapLongitude(planetLongitude(p, date))
    const rNum = rashiOf(lon)
    const house = ((rNum - lagnaRashi + 12) % 12) + 1
    return { planet: p, rashiNumber: rNum, rashi: RASHIS[rNum - 1].name, house }
  })
}
