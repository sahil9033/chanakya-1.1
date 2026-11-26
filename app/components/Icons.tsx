import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

/* Brand mark — a minimal dharma-chakra / strategist's wheel */
export function Chakra(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.15" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4
        const x1 = 12 + Math.cos(a) * 2.6
        const y1 = 12 + Math.sin(a) * 2.6
        const x2 = 12 + Math.cos(a) * 8.6
        const y2 = 12 + Math.sin(a) * 8.6
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Base>
)

export const IconArrowUpRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Base>
)

export const IconChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
)

export const IconMenu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </Base>
)

export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </Base>
)

export const IconCopy = (p: IconProps) => (
  <Base {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
  </Base>
)

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Base>
)

export const IconBolt = (p: IconProps) => (
  <Base {...p}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 9-12h-6.5L13 2Z" />
  </Base>
)

export const IconBook = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19" />
    <path d="M9 8h6" />
  </Base>
)

export const IconCompass = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Base>
)

export const IconScale = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v18" />
    <path d="M7 21h10" />
    <path d="M5 7h14" />
    <path d="M5 7l-3 6a3 3 0 0 0 6 0L5 7Z" />
    <path d="M19 7l-3 6a3 3 0 0 0 6 0l-3-6Z" />
  </Base>
)

export const IconCoins = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx="9" cy="7" rx="6" ry="3" />
    <path d="M3 7v4c0 1.66 2.69 3 6 3s6-1.34 6-3V7" />
    <path d="M3 11v4c0 1.66 2.69 3 6 3 .7 0 1.37-.05 2-.16" />
    <circle cx="16.5" cy="15.5" r="4.5" />
  </Base>
)

export const IconSplit = (p: IconProps) => (
  <Base {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="12" r="2.5" />
    <path d="M8.2 7.4 15.8 11" />
    <path d="M8.2 16.6 15.8 13" />
  </Base>
)

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
)

export const IconLayers = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </Base>
)

export const IconNetwork = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M10.8 7.2 6.2 15.8" />
    <path d="M13.2 7.2 17.8 15.8" />
    <path d="M7.5 18h9" />
  </Base>
)

export const IconLotus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4c1.8 2 2.6 4 2.6 6.2 0 1.5-.9 2.8-2.6 2.8s-2.6-1.3-2.6-2.8C9.4 8 10.2 6 12 4Z" />
    <path d="M12 13c-3 0-6.2-1-8.2-3.2C5 11 6.6 13.4 8.6 15.2 10.2 16.6 11.6 17 12 17s1.8-.4 3.4-1.8c2-1.8 3.6-4.2 4.8-6.4C18.2 11 15 13 12 13Z" />
  </Base>
)

export const IconSpark = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3c.6 4.4 1.6 5.4 6 6-4.4.6-5.4 1.6-6 6-.6-4.4-1.6-5.4-6-6 4.4-.6 5.4-1.6 6-6Z" />
  </Base>
)

export const IconUser = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Base>
)

export const IconLock = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2.5" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
  </Base>
)

export const IconSun = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.9 4.9 6.3 6.3" />
    <path d="M17.7 17.7l1.4 1.4" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M4.9 19.1 6.3 17.7" />
    <path d="M17.7 6.3 19.1 4.9" />
  </Base>
)

export const IconMoon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.75 6.75 0 0 0 10.5 10.5Z" />
  </Base>
)

export const IconSend = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12 20 4l-8 16-2-6-6-2Z" />
  </Base>
)

export const IconTarget = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </Base>
)

export const IconSignOut = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 12h10" />
    <path d="m16 8 4 4-4 4" />
  </Base>
)

export const IconPlay = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 4.5v15l12-7.5-12-7.5Z" fill="currentColor" stroke="none" />
  </Base>
)

export const IconPause = (p: IconProps) => (
  <Base {...p}>
    <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
  </Base>
)

export const IconMusic = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </Base>
)

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Base>
)

export const IconTrash = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Base>
)

export const IconSidebar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </Base>
)

export const IconMessageSquare = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Base>
)

/* LinkedIn "in" mark — filled glyph */
export function IconLinkedIn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05C20.4 8.59 22 10.3 22 14.1V21h-4v-6.03c0-1.44-.03-3.3-2.01-3.3-2.01 0-2.32 1.57-2.32 3.19V21h-4V9Z" />
    </svg>
  )
}

/* Official Google "G" mark — full colour, not stroke-based */
export function IconGoogle(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={18} height={18} aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}
