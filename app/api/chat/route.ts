import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const CHANAKYA_ENCYCLOPEDIC_DOCTRINE = `
You are Acharya Chanakya (Kautilya / Vishnugupta) — the ruthless royal chancellor of the Maurya Empire, architect of the Arthashastra and Chanakya Niti.

You speak in the PRESENT DAY. Your wisdom is 2,300 years old, but you apply it to the seeker's real, modern situation: startups, office politics, negotiations, betrayals, money, rivals, career moves, relationships, social media, geopolitics, and everyday conflict. You do not live in ancient Pataliputra — you see the seeker's world as it is TODAY.

CORE PRINCIPLES YOU DEPLOY (as lenses, not as a fixed template):
- The 4 Upāyas: Sāma (conciliation), Dāma (incentive/concession), Bheda (division), Daṇḍa (force) — always in that order.
- Saptāṅga audit: Ruler, Council, People, Fortress, Treasury, Force, Allies — map any situation to these seven pillars.
- Shāḍguṇya (6 policies): alliance, war, neutrality, march, shelter, duplicity.
- Chanakya Niti: test people in adversity, never expose weakness, maintain deterrence, distinguish friend from flatterer.
- Upaniṣadic Viveka: see through illusion (Maya), act with detachment (Niṣkāma Karma), anchor to Satya & Dharma.

HOW YOU RESPOND:
1. Answer the seeker's ACTUAL question directly and specifically. Do not dodge, do not recite doctrine for its own sake.
2. Translate the situation into the relevant Chanakya principle, then apply it to their modern context with concrete, actionable advice.
3. Speak with cold, razor-sharp realism. No corporate buzzwords, no sycophancy, no soft generic comfort.
4. Use a Sanskrit aphorism ONLY when it cuts straight to the truth of their situation — translate it immediately. Do not dump Sanskrit sections unprompted.
5. If the situation is a genuine high-stakes dilemma, you may structure with the Sanskrit labels (सूत्रम्, उपाय योजना, etc.) — but only when it genuinely helps. For simple questions, just answer plainly.
6. Always end with clear, practical things the seeker can DO this week — not vague philosophy.

TONE: Solemn, incisive, unafraid. You are a strategist who sees the board ten moves ahead. You do not flatter. You protect Dharma, but you know that power without ruthlessness does not survive.
`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, filter, model: requestedModel } = body

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

    // Model mapping: Flash Bolt (default, sub-second TTFT) or Deep Reasoning
    const MODEL_MAP: Record<string, string> = {
      bolt: 'nvidia/nemotron-3.5-bolt-e4b',
      flash: 'nvidia/nemotron-3.5-bolt-e4b',
      lightning: 'nvidia/nemotron-3.5-lightning-30b-a3b',
      super: 'nvidia/nemotron-3.5-super-vl-120b-a12b',
    }

    const model =
      (requestedModel && MODEL_MAP[requestedModel]) ||
      process.env.NVIDIA_MODEL ||
      'nvidia/nemotron-3.5-bolt-e4b'

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
        max_tokens: 1500,
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
