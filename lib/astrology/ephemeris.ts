// Deterministic astronomical calculations using astronomy-engine (VSOP87 / ELP).
// All planetary positions are geocentric apparent ecliptic longitude of date,
// then reduced to the SIDEREAL zodiac using the Lahiri ayanamsa.
// Never ask an LLM to compute these — they come from physics only.

import * as Astronomy from 'astronomy-engine'
import type { PlanetKey } from './constants'

const DEG = 180 / Math.PI
const J2000_JD = 2451545.0

/** Julian Day from a JS Date (UTC). */
export function julianDay(date: Date): number {
  // JD of the Unix epoch (1970-01-01T00:00:00Z) is 2440587.5.
  return 2440587.5 + date.getTime() / 86400000
}

/** Julian centuries from J2000 (for ayanamsa / node formulas). */
export function julianCenturies(jd: number): number {
  return (jd - J2000_JD) / 36525
}

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees.
 * Spica (Chitra) is held at exactly 180° sidereal.
 * Reference: Lahiri value at J2000 ≈ 23°51'17.85", precession ≈ 50.2564"/yr.
 */
export function lahiriAyanamsa(jd: number): number {
  const T = julianCenturies(jd)
  return 23.854958 + 0.0139601 * T * 100
  // 0.0139601 deg/year * 100 years/century = 1.39601 deg/century
}

/**
 * Mean longitude of the Moon's ascending node (Rahu), degrees.
 * IAU mean node formula; Vedic Rahu uses the mean node.
 */
export function meanLunarNode(jd: number): number {
  const T = julianCenturies(jd)
  let omega =
    125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 450000
  omega = ((omega % 360) + 360) % 360
  return omega
}

const BODY_MAP: Record<string, string> = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mars: 'Mars',
  Mercury: 'Mercury',
  Jupiter: 'Jupiter',
  Venus: 'Venus',
  Saturn: 'Saturn',
}

function tropicalLongitude(body: string, date: Date): number {
  const vec = Astronomy.GeoVector((BODY_MAP[body] ?? body) as Astronomy.Body, date, true)
  const eco = Astronomy.Ecliptic(vec)
  return ((eco.elon % 360) + 360) % 360
}

/** Sidereal (Lahiri) longitude of a real body. */
export function siderealLongitude(body: string, date: Date): number {
  const jd = julianDay(date)
  const ayan = lahiriAyanamsa(jd)
  const trop = tropicalLongitude(body, date)
  return ((trop - ayan) % 360 + 360) % 360
}

/** Sidereal longitude of Rahu (mean ascending node) and Ketu. */
export function nodeLongitudes(date: Date): { rahu: number; ketu: number } {
  const jd = julianDay(date)
  // The mean-node formula is referred to the mean equinox of date (tropical);
  // reduce it to the sidereal zodiac with the same Lahiri ayanamsa as the planets.
  const ayan = lahiriAyanamsa(jd)
  const rahu = (((meanLunarNode(jd) - ayan) % 360) + 360) % 360
  return { rahu, ketu: (rahu + 180) % 360 }
}

/**
 * Lagna (ascendant) — sidereal.
 * Computed from local sidereal time, geographic latitude and true obliquity.
 */
export function siderealAscendant(date: Date, lat: number, lon: number): number {
  const gmst = Astronomy.SiderealTime(date) // hours
  const lst = ((gmst * 15 + lon) % 360 + 360) % 360
  const T = julianCenturies(julianDay(date))
  // Mean obliquity of the ecliptic (degrees)
  const eps = 23.43929111 - 0.013004167 * T - 1.638e-7 * T * T + 5.036e-7 * T * T * T
  const phi = lat / DEG
  const e = eps / DEG
  const lstRad = lst / DEG
  const num = -Math.cos(lstRad)
  const den = Math.sin(lstRad) * Math.cos(e) + Math.tan(phi) * Math.sin(e)
  // atan2 gives the ecliptic point on the horizon; +180° selects the
  // EASTERN intersection (the ascendant) rather than the descendant.
  let asc = (Math.atan2(num, den) * DEG) + 180
  asc = ((asc % 360) + 360) % 360
  const ayan = lahiriAyanamsa(julianDay(date))
  return ((asc - ayan) % 360 + 360) % 360
}

/**
 * Retrograde status: sample longitude one day apart.
 * Negative apparent motion => retrograde (applies to planets; Moon & nodes are direct).
 */
export function isRetrograde(body: string, date: Date): boolean {
  if (body === 'Moon' || body === 'Sun') return false
  if (body === 'Rahu' || body === 'Ketu') return true // mean nodes always retrograde
  const day = 86400000
  const a = siderealLongitude(body, date)
  const b = siderealLongitude(body, new Date(date.getTime() + day))
  let motion = b - a
  if (motion > 180) motion -= 360
  if (motion < -180) motion += 360
  return motion < 0
}

/** Angular separation in degrees (0-180). */
export function angularSeparation(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

/** Convenience: sidereal longitude for any planet key. */
export function planetLongitude(key: PlanetKey, date: Date): number {
  if (key === 'Rahu' || key === 'Ketu') {
    const n = nodeLongitudes(date)
    return key === 'Rahu' ? n.rahu : n.ketu
  }
  return siderealLongitude(key, date)
}
