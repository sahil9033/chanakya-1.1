import type { ChartData } from './chart'

export interface Yoga {
  name: string
  description: string
  strength: 'Strong' | 'Moderate' | 'Weak'
}

/**
 * Detect a small set of well-known yogas from the calculated chart.
 * Only reports yogas actually supported by the chart positions — no fabrication.
 */
export function detectYogas(chart: ChartData): Yoga[] {
  const yogas: Yoga[] = []
  const byKey = new Map(chart.planets.map((p) => [p.key, p]))
  const lagnaLord = chart.houses[0].lord

  // Gajakesari Yoga: Jupiter in Kendra (1,4,7,10) from Moon or Moon in Kendra from Jupiter
  const moon = byKey.get('Moon')
  const jupiter = byKey.get('Jupiter')
  if (moon && jupiter) {
    const diff = Math.abs(moon.rashiNumber - jupiter.rashiNumber) % 12
    const kendraDist = Math.min(diff, 12 - diff)
    if (kendraDist === 0 || kendraDist === 3 || kendraDist === 6 || kendraDist === 9) {
      yogas.push({
        name: 'Gajakesari Yoga',
        description: 'Jupiter and Moon are in mutual Kendra (1/4/7/10) positions — grants wisdom, fame and steady fortune.',
        strength: kendraDist === 0 ? 'Strong' : 'Moderate',
      })
    }
  }

  // Budhaditya Yoga: Mercury and Sun in the same rashi
  const sun = byKey.get('Sun')
  const mercury = byKey.get('Mercury')
  if (sun && mercury && sun.rashiNumber === mercury.rashiNumber) {
    yogas.push({
      name: 'Budhaditya Yoga',
      description: 'Mercury conjoins the Sun — sharp intellect, eloquence and analytical ability.',
      strength: sun.combust ? 'Weak' : 'Moderate',
    })
  }

  // Chandra-Mangala Yoga: Moon and Mars in same rashi
  const mars = byKey.get('Mars')
  if (moon && mars && moon.rashiNumber === mars.rashiNumber) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      description: 'Moon and Mars conjoin — emotional intensity, courage and strong drive.',
      strength: 'Moderate',
    })
  }

  // Lagnadhipati Yoga: Lagna lord exalted or in own sign / Kendra
  const lagnaLordPlanet = byKey.get(lagnaLord as any)
  if (lagnaLordPlanet) {
    const kendra = [1, 4, 7, 10].includes(lagnaLordPlanet.house)
    const strong = ['Exalted', 'Own sign'].includes(lagnaLordPlanet.dignity)
    if (strong || kendra) {
      yogas.push({
        name: 'Lagnadhipati Yoga',
        description: `Lagna lord (${lagnaLord}) is ${strong ? lagnaLordPlanet.dignity.toLowerCase() : 'in a Kendra'} — supports a strong, self-directed life path.`,
        strength: strong && kendra ? 'Strong' : 'Moderate',
      })
    }
  }

  // Dharma-Karmadhipati Yoga: lords of 9th and 10th in mutual relationship
  const dharmaLord = chart.houses[8].lord
  const karmaLord = chart.houses[9].lord
  const dharmaP = byKey.get(dharmaLord as any)
  const karmaP = byKey.get(karmaLord as any)
  if (dharmaP && karmaP && dharmaP.rashiNumber === karmaP.rashiNumber) {
    yogas.push({
      name: 'Dharma-Karmadhipati Yoga',
      description: `Lords of the 9th (${dharmaLord}) and 10th (${karmaLord}) houses conjoin — elevated career and fortune through righteous action.`,
      strength: 'Moderate',
    })
  }

  return yogas
}
