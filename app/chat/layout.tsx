import type { Metadata } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Ask Chanakya — AI Strategic Counsel',
  description:
    'Chat with Chanakya AI — get Arthashastra-grounded strategic counsel, Chanakya Niti psychology, and Upanishadic Viveka for real-world decisions. Powered by NVIDIA NIM.',
  keywords: [
    'Ask Chanakya',
    'Chanakya AI chat',
    'Arthashastra AI',
    'strategic counsel AI',
    'ancient wisdom chatbot',
    'Chanakya chatbot',
    'AI strategy advisor',
    'NVIDIA NIM AI',
    'Kautilya AI',
  ],
  alternates: { canonical: `${SITE_URL}/chat` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/chat`,
    title: 'Ask Chanakya — AI Strategic Counsel — Vedhh AI',
    description:
      'Get Arthashastra-grounded strategic advice from Chanakya AI. Powered by NVIDIA NIM.',
    siteName: 'Vedhh AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ask Chanakya — AI Strategic Counsel — Vedhh AI',
    description:
      'Chat with Chanakya AI for strategic, Arthashastra-grounded counsel.',
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
