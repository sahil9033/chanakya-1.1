import { NextResponse } from 'next/server'
import { calculateKundali, type KundaliResult } from '../../../../lib/astrology'
import type { BirthInput } from '../../../../lib/astrology/chart'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `You are an expert Vedic astrology interpretation engine.

Interpret ONLY the astronomical and astrological data supplied in the JSON below.
Never invent planetary positions, houses, nakshatras, dashas, or yogas.
If data is missing, explicitly say that the calculation is unavailable.

Use traditional Vedic astrology concepts: Lagna, Rashi, Bhava, Nakshatra, Graha strength, house lordship, Drishti (aspects), Yogas, Vimshottari Dasha, Antardasha, and transit effects.

Clearly distinguish:
1. Calculated astronomical facts
2. Traditional astrological interpretation
3. Probabilistic/interpretive predictions

Never present astrology as scientifically proven medical diagnosis or guaranteed future events.

For health questions: Do NOT diagnose diseases. Describe traditional astrological tendencies and recommend professional medical care for real symptoms.
For relationship predictions: Give time windows and explain the astrological reasoning — never claim a specific person will arrive on an exact date.
For financial predictions: Give tendencies and practical advice — never guarantee wealth, income, or investment outcomes.

Always explain WHY a prediction is being made by referencing the actual chart factors (house, planet, lordship, dasha, transit).
Avoid generic horoscope text. Every interpretation must reference the user's calculated chart.
Be honest when the chart does not strongly support a prediction.

Produce exactly these sections:
1. OVERALL PERSONALITY (Lagna, Lagna lord, Moon, Sun, dominant elements, strong/weak planets)
2. LOVE & RELATIONSHIPS (5th/7th houses & lords, Venus, Moon, Darakaraka if available, relevant dasha/transits) — relationship style, attraction patterns, strengths, challenges, likely relationship periods, marriage tendencies, practical advice
3. CAREER (10th, 6th, 2nd, 11th houses & lords; Saturn, Mercury, Jupiter; dasha/transits) — suitable themes, entrepreneurship vs employment, technology/AI suitability when supported, growth windows
4. WEALTH & LUXURY (2nd, 11th, Venus, Jupiter, 5th, 9th; wealth yogas; dasha/transits) — likely sources of luxury (career/business/investments/partnerships/foreign/creative-tech)
5. HEALTH (1st, 6th, 8th, 12th houses; Lagna lord, Sun, Moon, Saturn; dasha) — clearly label "Traditional astrological interpretation — not medical diagnosis"
6. EDUCATION (4th, 5th houses; Mercury, Jupiter; dasha)
7. NEXT 12 MONTHS — month-by-month based on ACTUAL dasha and transit data (career, love, money, education, energy, opportunities, cautions)
8. NEXT 5 YEARS — yearly timeline based on calculated Mahadasha/Antardasha and major transits
9. LOVE TIMELINE — attraction windows, relationship-start windows, commitment windows, potential conflict periods, marriage-supportive periods (date ranges only)
10. DASHA TIMELINE — Mahadasha → Antardasha → start → end → brief interpretation

Use markdown headings. Under each section add a "Why?" line citing the chart factors. Where confidence is low, say so (Strong / Moderate / Weak indication).`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { dateOfBirth, timeOfBirth, place, latitude, longitude, timezone } = body as Partial<BirthInput>

    if (!dateOfBirth || !timeOfBirth || !place) {
      return NextResponse.json(
        { error: 'Date of birth, time of birth, and place are required.' },
        { status: 400 }
      )
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude and longitude must be numbers.' },
        { status: 400 }
      )
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      )
    }

    const input: BirthInput = {
      dateOfBirth,
      timeOfBirth,
      place,
      latitude,
      longitude,
      timezone: timezone || 'Asia/Kolkata',
    }

    let chart: KundaliResult
    try {
      chart = calculateKundali(input)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate chart'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    // NIM interpretation
    let interpretation = ''
    let nimError: string | null = null

    const apiKey = process.env.NVIDIA_API_KEY
    const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'
    const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-bolt-e4b'

    if (apiKey) {
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Interpret this Vedic birth chart:\n\n${JSON.stringify(chart, null, 2)}`,
              },
            ],
            temperature: 0.4,
            top_p: 0.85,
            max_tokens: 3000,
            stream: false,
          }),
        })

        if (!response.ok) {
          const t = await response.text()
          nimError = `AI service returned ${response.status}: ${t.slice(0, 300)}`
        } else {
          const data = await response.json()
          interpretation =
            data.choices?.[0]?.message?.content ||
            data.choices?.[0]?.message?.reasoning_content ||
            ''
        }
      } catch (err) {
        nimError = err instanceof Error ? err.message : 'AI interpretation failed'
      }
    } else {
      nimError = 'NVIDIA_API_KEY is not configured on the server.'
    }

    return NextResponse.json({ chart, interpretation, nimError })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
