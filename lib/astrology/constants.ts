// Vedic astrology reference data — sidereal (Lahiri) framework.

export interface Rashi {
  name: string
  devanagari: string
  element: 'Fire' | 'Earth' | 'Air' | 'Water'
  lord: string // planet key
}

export const RASHIS: Rashi[] = [
  { name: 'Aries', devanagari: 'मेष', element: 'Fire', lord: 'Mars' },
  { name: 'Taurus', devanagari: 'वृषभ', element: 'Earth', lord: 'Venus' },
  { name: 'Gemini', devanagari: 'मिथुन', element: 'Air', lord: 'Mercury' },
  { name: 'Cancer', devanagari: 'कर्क', element: 'Water', lord: 'Moon' },
  { name: 'Leo', devanagari: 'सिंह', element: 'Fire', lord: 'Sun' },
  { name: 'Virgo', devanagari: 'कन्या', element: 'Earth', lord: 'Mercury' },
  { name: 'Libra', devanagari: 'तुला', element: 'Air', lord: 'Venus' },
  { name: 'Scorpio', devanagari: 'वृश्चिक', element: 'Water', lord: 'Mars' },
  { name: 'Sagittarius', devanagari: 'धनु', element: 'Fire', lord: 'Jupiter' },
  { name: 'Capricorn', devanagari: 'मकर', element: 'Earth', lord: 'Saturn' },
  { name: 'Aquarius', devanagari: 'कुंभ', element: 'Air', lord: 'Saturn' },
  { name: 'Pisces', devanagari: 'मीन', element: 'Water', lord: 'Jupiter' },
]

export interface Nakshatra {
  name: string
  devanagari: string
  lord: string // planet key
}

export const NAKSHATRAS: Nakshatra[] = [
  { name: 'Ashwini', devanagari: 'अश्विनी', lord: 'Ketu' },
  { name: 'Bharani', devanagari: 'भरणी', lord: 'Venus' },
  { name: 'Krittika', devanagari: 'कृत्तिका', lord: 'Sun' },
  { name: 'Rohini', devanagari: 'रोहिणी', lord: 'Moon' },
  { name: 'Mrigashira', devanagari: 'मृगशीर्ष', lord: 'Mars' },
  { name: 'Ardra', devanagari: 'आर्द्रा', lord: 'Rahu' },
  { name: 'Punarvasu', devanagari: 'पुनर्वसु', lord: 'Jupiter' },
  { name: 'Pushya', devanagari: 'पुष्य', lord: 'Saturn' },
  { name: 'Ashlesha', devanagari: 'आश्लेषा', lord: 'Mercury' },
  { name: 'Magha', devanagari: 'मघा', lord: 'Ketu' },
  { name: 'Purva Phalguni', devanagari: 'पूर्व फाल्गुनी', lord: 'Venus' },
  { name: 'Uttara Phalguni', devanagari: 'उत्तर फाल्गुनी', lord: 'Sun' },
  { name: 'Hasta', devanagari: 'हस्त', lord: 'Moon' },
  { name: 'Chitra', devanagari: 'चित्रा', lord: 'Mars' },
  { name: 'Swati', devanagari: 'स्वाती', lord: 'Rahu' },
  { name: 'Vishakha', devanagari: 'विशाखा', lord: 'Jupiter' },
  { name: 'Anuradha', devanagari: 'अनुराधा', lord: 'Saturn' },
  { name: 'Jyeshtha', devanagari: 'ज्येष्ठा', lord: 'Mercury' },
  { name: 'Mula', devanagari: 'मूल', lord: 'Ketu' },
  { name: 'Purva Ashadha', devanagari: 'पूर्वाषाढ़ा', lord: 'Venus' },
  { name: 'Uttara Ashadha', devanagari: 'उत्तराषाढ़ा', lord: 'Sun' },
  { name: 'Shravana', devanagari: 'श्रवण', lord: 'Moon' },
  { name: 'Dhanishtha', devanagari: 'धनिष्ठा', lord: 'Mars' },
  { name: 'Shatabhisha', devanagari: 'शतभिषा', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', devanagari: 'पूर्वाभाद्रपद', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', devanagari: 'उत्तराभाद्रपद', lord: 'Saturn' },
  { name: 'Revati', devanagari: 'रेवती', lord: 'Mercury' },
]

export const PLANETS = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
] as const

export type PlanetKey = (typeof PLANETS)[number]

// Vimshottari dasha order and years (total 120)
export const DASHA_SEQUENCE: { lord: PlanetKey; years: number }[] = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
]

// Owned rashis per planet (1-indexed rashi numbers)
export const OWNERSHIP: Record<PlanetKey, number[]> = {
  Sun: [5],
  Moon: [4],
  Mars: [1, 8],
  Mercury: [3, 6],
  Jupiter: [9, 12],
  Venus: [2, 7],
  Saturn: [10, 11],
  Rahu: [],
  Ketu: [],
}

// Exaltation (ucha) rashi per planet (1-indexed)
export const EXALTATION: Partial<Record<PlanetKey, number>> = {
  Sun: 1,
  Moon: 2,
  Mars: 10,
  Mercury: 6,
  Jupiter: 4,
  Venus: 12,
  Saturn: 7,
}

// Debilitation (neecha) rashi per planet (1-indexed)
export const DEBILITATION: Partial<Record<PlanetKey, number>> = {
  Sun: 7,
  Moon: 8,
  Mars: 4,
  Mercury: 12,
  Jupiter: 10,
  Venus: 6,
  Saturn: 1,
}

// Combustion orbs (degrees from Sun) — planet considered combust within
export const COMBUSTION_ORBS: Record<string, number> = {
  Moon: 12,
  Mars: 17,
  Mercury: 14, // 12 if retrograde
  Jupiter: 11,
  Venus: 9, // 8 if retrograde
  Saturn: 15,
}
