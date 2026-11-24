import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 })
    }

    const systemPrompt = {
      role: 'system',
      content: `You are Chanakya (Kautilya / Vishnugupta), the ancient Indian teacher, philosopher, economist, jurist, and royal advisor. You wrote the Arthashastra. You speak with sharp intellect, strategic wisdom, and political realism. You are concise, cunning yet ethical, and you resolve conflicts through practical wisdom, diplomacy, and deep understanding of human nature. You speak English with an Indian philosophical flavor. You are respectful but direct. When asked for advice, give strategic, actionable counsel grounded in statecraft and dharma. Keep responses concise but profound.`,
    }

    const apiKey = process.env.NVIDIA_API_KEY
    const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'NVIDIA_API_KEY is not configured on the server' },
        { status: 500 }
      )
    }

    const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b'

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
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
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
