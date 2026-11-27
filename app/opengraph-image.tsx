import { ImageResponse } from 'next/og'

// Rendered on demand as a real 1200×630 PNG, so every shared link gets a
// crisp, on-brand card instead of a plain text preview.
export const runtime = 'edge'
export const alt = 'Vedhh AI — Arthashastra-grounded strategy and precise Vedic Kundali'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const HOST = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app').replace(
  /^https?:\/\//,
  ''
)

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #FFF6EE 0%, #F6EDFF 48%, #EAFBF6 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 15,
              background: 'linear-gradient(135deg, #FC8211 0%, #A78BFA 100%)',
            }}
          />
          <div style={{ fontSize: 34, color: '#1A1523', letterSpacing: '-0.01em' }}>vedhh ai</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 980 }}>
          <div style={{ fontSize: 64, lineHeight: 1.06, color: '#1A1523', letterSpacing: '-0.02em' }}>
            Arthashastra-grounded strategy. Precise Vedic Kundali.
          </div>
          <div style={{ fontSize: 28, color: '#5B5470' }}>
            Ask Chanakya · Free sidereal birth chart · Vedhh AI
          </div>
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: '#8A8398' }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#FC8211' }} />
          {HOST}
        </div>
      </div>
    ),
    { ...size }
  )
}
