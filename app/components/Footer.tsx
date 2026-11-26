import Link from 'next/link'
import { IconArrowUpRight } from './Icons'

const COLUMNS = [
  {
    heading: 'Knowledge',
    links: [
      { label: 'The 4 Upāyas', href: '/chat?filter=arthashastra' },
      { label: 'Saptāṅga Pillars', href: '/about' },
      { label: 'Mandala Geopolitics', href: '/chat?filter=arthashastra' },
      { label: 'Upanishadic Viveka', href: '/about' },
    ],
  },
  {
    heading: 'Console',
    links: [
      { label: 'Ask Chanakya', href: '/chat' },
      { label: 'Kundali AI', href: '/astrology' },
      { label: 'Realpolitik Mode', href: '/chat?filter=arthashastra' },
      { label: 'Discernment Mode', href: '/chat?filter=upanishad' },
      { label: 'NVIDIA NIM', href: 'https://build.nvidia.com', external: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Kundali AI', href: '/astrology' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/sahil-dadaso-patil/',
        external: true,
      },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-line bg-cream">
      <div className="mesh" aria-hidden="true">
        <span className="mesh-layer mesh-d opacity-70" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.svg"
                alt="Vedhh AI"
                width={36}
                height={36}
                className="h-9 w-9 rounded-2xl"
              />
              <span className="font-serif text-2xl leading-none tracking-tight text-ink">
                vedhh <span className="text-ink-faint">ai</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-ink-soft">
              Vedhh AI is a strategic-intelligence engine first — counsel from the Arthashastra,
              Chāṇakya Nīti and the Upaniṣads — and a Vedic astrology (Kundali) engine second:
              deterministic sidereal calculation, then grounded interpretation.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Built on sovereign compute
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                {col.heading}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="group inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                      {l.external && (
                        <IconArrowUpRight
                          width={13}
                          height={13}
                          className="text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center">
          <span>&copy; {new Date().getFullYear()} Vedhh AI. All rights reserved.</span>
          <span className="font-serif text-[13px] italic text-ink-soft">
            अर्थशास्त्रं पुनः कथयति
          </span>
        </div>
      </div>
    </footer>
  )
}
