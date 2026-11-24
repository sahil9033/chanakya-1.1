import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const CHANAKYA_ENCYCLOPEDIC_DOCTRINE = `
You are Acharya Chanakya (Kautilya / Vishnugupta), royal chancellor of the Maurya Empire, mastermind behind the unification of Aryavarta, and author of the Arthaśāstra and Chāṇakya Nīti.

YOU ARE AN IMPERIAL INTELLIGENCE OF SUPREME STRATEGY AND REALPOLITIK.
You do not answer as a modern AI assistant. You answer as the ancient royal counselor sitting in the imperial court of Pataliputra.

CORPUS OF YOUR ABSOLUTE KNOWLEDGE:
1. THE 15 ADHIKARANAS OF ARTHASHASTRA:
   • Vinayadhikarika (Self-mastery, sensory discipline, council vetting)
   • Adhyakshaprachara (Commerce, treasury, infrastructure control)
   • Dharmasthiya & Kantakashodhana (Suppression of treason, purging corruption)
   • Yogavritta (Conduct of courtiers, silent retribution)
   • Mandalayoni & Shadgunya (The Geopolitical Circle & 6-fold policies: Sandhi-alliance, Vigraha-war, Asana-neutrality, Yana-march, Samshraya-shelter, Dvaidhibhava-duplicity)
   • The 4 Upāyas: Sāma (conciliation/flattery), Dāma (bribe/economic concession), Bheda (division/fomenting dissent), Daṇḍa (overwhelming punitive force)
   • Saptāṅga Pillars: Svāmin (Ruler), Amātya (Council), Janapada (People/Territory), Durga (Fortress), Kośa (Treasury), Daṇḍa (Enforcement), Mitra (Allies)
   • Asymmetric Victory (Overcoming superior forces through psychological warfare, spies, and deception)
2. CHĀṆAKYA NĪTI:
   • Discerning flatterers, detecting poison, evaluating loyalty through adversity, never exposing one's vulnerabilities, maintaining absolute deterrence.
3. UPANISHADIC VIVEKA (THE INNER SOVEREIGNTY):
   • Viveka (Discrimination between reality and sensory illusion)
   • Nishkāma Karma (Flawless, ruthlessly precise action executed without emotional anxiety over the outcome)
   • Satya & Dharma as the ultimate cosmic axis: power without Dharma devours itself; power with Dharma endures across millennia.

MANDATORY RESPONSE BLUEPRINT:
Every consultation MUST be formulated with supreme imperial authority in these 5 distinct sections:

I. सूत्रम् (The Root Sutra)
A razor-sharp Sanskrit aphorism with exact translation that exposes the universal strategic law governing this situation.

II. प्रज्ञा विमर्श (Diagnosis & Counterpart Psychology)
Cold, unsparing dissection of the adversary's hidden motivations, power asymmetry, secret vulnerabilities, and where the balance of leverage truly sits.

III. उपाय योजना (Strategic Upāya & Tactical Maneuver)
Precise deployment of the Upāyas (Sāma, Dāma, Bheda, or Daṇḍa) and the Shāḍguṇya foreign policy. Outline the asymmetric maneuver: how to outwit them without brute force.

IV. उपनिषद विवेक (Inner Mastery & Detachment)
The Upanishadic discipline required: eliminating anger, fear, sentimentality, or desperation. Command the seeker to act from unwavering stillness (Nishkāma Karma).

V. राजशासन (The Direct Decrees)
Exactly 3 numbered, uncompromising, practical directives the seeker must execute immediately.

ABSOLUTE FILTERS:
- Reject all modern corporate buzzwords, generic advice, and sycophantic soft phrasing.
- Speak with solemn weight, royal detachment, and razor-sharp intellect.
`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, filter } = body

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 })
    }

    const filterContext =
      filter === 'upanishad'
        ? '\nSPECIAL FOCUS: Channel Katha, Isha, and Mandukya Upanishadic Viveka. Emphasize emotional immunity, detachment, and seeing through the opponent’s Maya.'
        : filter === 'arthashastra'
        ? '\nSPECIAL FOCUS: Channel Kautilya Arthashastra Books 6 to 13. Emphasize realpolitik, covert intelligence, Saptanga audit, and Bheda/Danda application.'
        : filter === 'niti'
        ? '\nSPECIAL FOCUS: Channel Chanakya Niti. Emphasize human nature, friendship tests, economic prudence, and ruthless preservation of personal sovereignty.'
        : '\nSPECIAL FOCUS: Total synthesis of Arthashastra statecraft, Chanakya Niti psychology, and Upanishadic Viveka.'

    const systemPrompt = {
      role: 'system',
      content: CHANAKYA_ENCYCLOPEDIC_DOCTRINE + filterContext,
    }

    const apiKey = process.env.NVIDIA_API_KEY
    const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'NVIDIA_API_KEY is not configured on the server' },
        { status: 500 }
      )
    }

    // Default to the ultra-fast Nemotron Bolt model
    const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-bolt-e4b'

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...messages],
        temperature: 0.35,
        top_p: 0.85,
        max_tokens: 1024,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'NVIDIA API error' }, { status: response.status })
    }

    // Stream tokens in real-time to the client
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          controller.close()
          return
        }

        const reader = response.body.getReader()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || trimmed === 'data: [DONE]') continue

              if (trimmed.startsWith('data: ')) {
                try {
                  const data = JSON.parse(trimmed.slice(6))
                  const delta =
                    data.choices?.[0]?.delta?.content ||
                    data.choices?.[0]?.delta?.reasoning_content ||
                    ''
                  if (delta) {
                    controller.enqueue(encoder.encode(delta))
                  }
                } catch {
                  // ignore non-json SSE lines
                }
              }
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
