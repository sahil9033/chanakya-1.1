'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import {
  Chakra,
  IconArrowUpRight,
  IconBolt,
  IconClose,
  IconGoogle,
  IconMenu,
  IconSignOut,
} from './Icons'

const NAV_LINKS = [
  { name: 'Overview', href: '/' },
  { name: 'Ask Chanakya', href: '/chat' },
  { name: 'Philosophy', href: '/philosophy' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Scroll progress bar + compact header state, rAF-throttled
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        const progress = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
        setScrolled(doc.scrollTop > 8)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Close mobile menu + user menu on route change
  useEffect(() => {
    setOpen(false)
    setMenuOpen(false)
  }, [pathname])

  // Dismiss the account menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  // Page-wide pointer spotlight: one delegated listener, rAF-throttled, paint-only
  useEffect(() => {
    let raf = 0
    let target: HTMLElement | null = null
    let px = 0
    let py = 0

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('.spot') as HTMLElement | null
      target = el
      px = e.clientX
      py = e.clientY
      if (!el || raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!target) return
        const rect = target.getBoundingClientRect()
        target.style.setProperty('--mx', `${px - rect.left}px`)
        target.style.setProperty('--my', `${py - rect.top}px`)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Announcement bar — scrolls away */}
      <div className="relative z-40 bg-ink text-white/85">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] sm:text-xs">
          <span className="hidden h-1 w-1 rounded-full bg-accent sm:block" />
          <span>
            Grounded in the{' '}
            <strong className="font-medium text-white">Arthashastra &amp; Upanishads</strong>
            <span className="mx-2 hidden text-white/30 sm:inline">·</span>
            <span className="hidden sm:inline">
              Sub-two-second inference on sovereign compute
            </span>
          </span>
        </div>
      </div>

      {/* Sticky navigation */}
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          scrolled ? 'border-ink-line bg-canvas/80 backdrop-blur-xl' : 'border-transparent bg-canvas'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Chanakya home">
            <span className="text-ink transition-transform duration-500 ease-expo group-hover:rotate-180">
              <Chakra width={26} height={26} />
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-serif text-[22px] leading-none tracking-tight text-ink">
                chanakya
              </span>
              <span className="hidden rounded-full bg-ink/[0.06] px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.12em] text-ink-soft sm:inline-block">
                Sovereign
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-ink-line bg-cream/70 p-1 backdrop-blur md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-canvas text-ink shadow-xs'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-ink-line bg-cream px-3 py-1.5 text-[11px] font-medium text-ink-soft lg:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ring-pulse rounded-full bg-emerald-500" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>

            <Link
              href="/chat"
              className="group hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#262833] hover:shadow-lift sm:inline-flex"
            >
              <IconBolt width={15} height={15} className="text-accent" />
              Ask Chanakya
            </Link>

            {/* Account */}
            {!loading &&
              (user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                    className="flex h-9 items-center gap-2 rounded-full border border-ink-line bg-canvas p-0.5 pr-2.5 transition-colors hover:bg-cream"
                  >
                    <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ink text-[13px] font-medium text-white">
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.photoURL}
                          alt=""
                          width={32}
                          height={32}
                          className="h-8 w-8 object-cover"
                        />
                      ) : (
                        (user.displayName?.[0] ?? user.email?.[0] ?? 'C').toUpperCase()
                      )}
                    </span>
                    <span className="hidden max-w-[90px] truncate text-[13px] font-medium text-ink sm:block">
                      {user.displayName?.split(' ')[0] ?? 'Account'}
                    </span>
                  </button>

                  <div
                    className={`absolute right-0 top-[calc(100%+8px)] w-60 origin-top-right rounded-2xl border border-ink-line bg-canvas p-1.5 shadow-lift transition-all duration-200 ease-expo ${
                      menuOpen
                        ? 'pointer-events-auto scale-100 opacity-100'
                        : 'pointer-events-none scale-95 opacity-0'
                    }`}
                  >
                    <div className="px-3 py-2.5">
                      <div className="truncate text-sm font-medium text-ink">
                        {user.displayName ?? 'Strategist'}
                      </div>
                      {user.email && (
                        <div className="truncate text-xs text-ink-faint">{user.email}</div>
                      )}
                    </div>
                    <div className="my-1 h-px bg-ink-line" />
                    <button
                      type="button"
                      onClick={() => {
                        signOut()
                        setMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                    >
                      <IconSignOut width={15} height={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-canvas px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-cream"
                >
                  <IconGoogle width={15} height={15} />
                  <span className="hidden sm:inline">Sign in</span>
                </button>
              ))}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-line text-ink transition-colors hover:bg-cream md:hidden"
            >
              {open ? <IconClose width={18} height={18} /> : <IconMenu width={18} height={18} />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          className={`overflow-hidden border-t border-ink-line bg-canvas transition-[max-height,opacity] duration-500 ease-expo md:hidden ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    active ? 'bg-cream text-ink' : 'text-ink-soft hover:bg-cream/70 hover:text-ink'
                  }`}
                >
                  {link.name}
                  <IconArrowUpRight width={16} height={16} className="text-ink-faint" />
                </Link>
              )
            })}
            <Link
              href="/chat"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white"
            >
              <IconBolt width={15} height={15} className="text-accent" />
              Ask Chanakya
            </Link>

            {!loading &&
              (user ? (
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                  className="mt-1 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-cream/70 hover:text-ink"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-white">
                      {(user.displayName?.[0] ?? user.email?.[0] ?? 'C').toUpperCase()}
                    </span>
                    <span className="truncate">{user.displayName ?? user.email}</span>
                  </span>
                  <IconSignOut width={16} height={16} className="shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-ink-line px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-cream/70"
                >
                  <IconGoogle width={16} height={16} />
                  Sign in with Google
                </button>
              ))}
          </nav>
        </div>

        {/* Scroll progress */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-transparent">
          <div
            ref={progressRef}
            className="h-px origin-left bg-accent"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </header>
    </>
  )
}
