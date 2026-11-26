import { NextResponse } from 'next/server'
import { calculateKundali, type KundaliResult } from '../../../../lib/astrology'
import type { BirthInput } from '../../../../lib/astrology/chart'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `You are a warm, clear Vedic astrology guide.

Read ONLY the chart data given in the JSON below and explain it in simple, everyday language — as if explaining to a curious friend who knows nothing about astrology.

Language rules (follow strictly):
- Use short, simple sentences and everyday words. Easy to read, easy to understand.
- Avoid heavy jargon. If you must name a technical term (Lagna, Rashi, Bhava, Nakshatra, Dasha, Graha), explain it in plain words the first time, e.g. "Lagna (your rising sign)".
- Prefer short bullet points over long paragraphs. No academic or mystical filler.
- Keep a calm, kind, practical tone. No fear, no exaggeration, no false promises.
- Use ONLY the data given. Never invent planets, houses, nakshatras, dashas or yogas. If something is missing, say so simply.
- Clearly separate what is (1) a calculated fact, (2) traditional interpretation, and (3) a soft, possible hint.
- Never present astrology as proven science, medical diagnosis, or a guaranteed future. Health = tendencies only, and always advise seeing a real doctor for symptoms. Money = tendencies and simple advice only, never promises. Relationships = time windows and reasoning, never a fixed person or exact date.

After each section, add ONE short plain line that starts with "Why:" and names the real chart factors in simple words (which house, planet, lord, dasha or transit).

Use markdown "##" headings for exactly these 12 sections, in this order, with these titles:

## OVERALL PERSONALITY
Who they are at heart — natural strengths and weak spots, in simple words.

## LOVE & RELATIONSHIPS
How they love, who attracts them, the ups and downs, likely times for a new relationship and for marriage, plus simple advice.

## CAREER
What kind of work suits them, job vs business, and when growth is likely.

## WEALTH & LUXURY
How money and comforts are likely to come to them, and simple advice.

## HEALTH
Body tendencies and easy care tips. Clearly add: "Traditional astrological view — not a medical diagnosis."

## EDUCATION
Their learning style and how studies are likely to go.

## PROBLEMS & CHALLENGES
The main difficulties, explained simply, each named with the chart factor behind it.

## SOLUTIONS & REMEDIES
Simple, practical remedies (mantras, colours, days, charity, small habits). Tie each remedy to one problem above.

## NEXT 12 MONTHS
Month by month, from the real dasha and transit data — work, love, money, study, energy, chances and cautions.

## NEXT 5 YEARS
Year by year, from the calculated Mahadasha/Antardasha and main transits.

## LOVE TIMELINE
Simple date ranges only — when they may meet someone, start a relationship, commit, face friction, and marriage-friendly periods.

## DASHA TIMELINE
Mahadasha → Antardasha → start → end → one simple line for each.

End every section with the short "Why:" line. Where you are unsure, say it honestly and simply, e.g. "Strong indication", "Moderate indication" or "Weak indication".`

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
