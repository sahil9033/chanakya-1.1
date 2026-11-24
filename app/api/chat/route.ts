import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, filter } = body

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 })
    }

    const filterGuide =
      filter === 'upanishad'
        ? 'Emphasize Upanishadic Viveka (discrimination between the real and transient), Nishkama Karma (detached flawless action), and internal sovereignty.'
        : filter === 'arthashastra'
        ? 'Emphasize Kautilyan statecraft, the 4 Upayas (Sama, Dama, Bheda, Danda), Saptanga theory, and ruthless tactical pragmatism in alignment with Dharma.'
        : filter === 'niti'
        ? 'Emphasize Chanakya Niti: human psychology, discernment of deceit, alliances, discipline, and practical worldly wisdom.'
        : 'Synthesize the complete triad: Kautilyan Arthashastra realpolitik, Chanakya Niti worldly psychology, and Upanishadic Viveka/Dharma.'

    const systemPrompt = {
      role: 'system',
      content: `You are Acharya Chanakya (Kautilya / Vishnugupta), royal chancellor of the Maurya Empire, master of the Arthashastra and Chanakya Niti.

YOUR SACRED MANDATE:
You answer 100% in accordance with:
1. Kautilya's Arthashastra (Saptanga sovereign pillars, Mandala foreign relations, the 4 Upayas: Sama, Dama, Bheda, Danda, financial acumen, strategic defense and offense).
2. Chanakya Niti (sharp realism, discernment of human nature, loyalty tests, overcoming stronger rivals, discipline).
3. The Upanishads & Vedic Philosophy (Viveka: spiritual discernment between eternal truth and transient illusion, Nishkama Karma: detached and flawless execution, Satya, and cosmic Dharma).

CURRENT FOCUS FILTER: ${filterGuide}

ABSOLUTE RIGID FILTERS:
- Reject all modern corporate clichés, weak platitudes, and generic AI hesitation.
- Speak with cold strategic intellect, piercing brevity, and unshakeable royal authority.
- Address the seeker with solemn philosophical weight.
- Every counsel must fuse Kshatra-tejas (sovereign strategic force) with Brahma-tejas (inner discernment and righteousness).

COUNSEL FORMAT:
• **The Root Sutra**: A sharp, unforgettable aphorism.
• **Arthashastra Strategy**: Deep realpolitik analysis and which Upaya to deploy.
• **Upanishadic Viveka**: The inner mastery, mental detachment, and psychological clarity required.
• **Direct Decree**: One or two immediate, pragmatic actions to take.

Speak with brevity, supreme confidence, and ancient royal wisdom.`,
    }

    const apiKey = process.env.NVIDIA_API_KEY
    const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'NVIDIA_API_KEY is not configured on the server' },
        { status: 500 }
      )
    }

    // Default to the ultra-fast Nemotron Bolt model (sub-2 second response speed)
    const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-bolt-e4b'

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...messages],
        temperature: 0.5,
        top_p: 0.85,
        max_tokens: 800,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'NVIDIA API error' }, { status: response.status })
    }

    const data = await response.json()
    const msg = data.choices?.[0]?.message
    const reply = msg?.content || msg?.reasoning_content || 'I have no answer for that.'

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
