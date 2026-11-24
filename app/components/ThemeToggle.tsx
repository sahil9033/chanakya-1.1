'use client'

import { IconMoon, IconSun } from './Icons'

/**
 * Theme switch for the light/dark editorial palettes.
 * The icons are swapped purely with CSS (`dark:` variants) so server and client
 * markup match exactly — no hydration flash, no state to sync.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  function toggle() {
    const root = document.documentElement
    const next = root.classList.contains('dark') ? 'light' : 'dark'
    root.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('vedhh-theme', next)
    } catch {
      /* storage unavailable — theme simply won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-line bg-canvas text-ink-soft transition-all duration-300 hover:border-accent/40 hover:text-ink ${className}`}
    >
      <IconMoon width={16} height={16} className="dark:hidden" />
      <IconSun width={16} height={16} className="hidden dark:block" />
    </button>
  )
}
