'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { IconClose, IconMusic, IconPause, IconPlay } from './Icons'

const STORAGE_KEY = 'vedhh-music-position'

/**
 * Floating ambient music player.
 * - Always visible (never permanently hidden) so the user can always stop the music.
 * - Draggable anywhere on screen; position is remembered.
 * - The audio element only exists while the player UI is rendered, so music can
 *   never play without a visible control.
 * - Collapsible to a small icon when the "close" button is pressed.
 */
export default function MusicPlayer() {
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Position state — default to bottom-right, lifted above the chat composer.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const dragState = useRef<{ dx: number; dy: number; dragging: boolean }>({
    dx: 0,
    dy: 0,
    dragging: false,
  })

  // Load saved position (or default) on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const p = JSON.parse(saved) as { x: number; y: number }
        if (typeof p.x === 'number' && typeof p.y === 'number') {
          setPos(p)
          return
        }
      }
    } catch {
      /* ignore */
    }
    // Default: bottom-right, lifted on chat pages.
    const onChat = pathname?.startsWith('/chat') ?? false
    setPos({
      x: window.innerWidth - 220,
      y: window.innerHeight - (onChat ? 150 : 70),
    })
  }, [pathname])

  // Clamp position into the viewport.
  const clamp = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y }
    const w = boxRef.current?.offsetWidth ?? 200
    const h = boxRef.current?.offsetHeight ?? 56
    return {
      x: Math.max(8, Math.min(x, window.innerWidth - w - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - h - 8)),
    }
  }, [])

  // Persist position.
  useEffect(() => {
    if (!pos) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    } catch {
      /* ignore */
    }
  }, [pos])

  // Start playback on the first user interaction (autoplay policy workaround).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const tryPlay = async () => {
      try {
        audio.volume = 0.55
        await audio.play()
        setPlaying(true)
      } catch {
        /* autoplay still blocked — user can press play manually */
      }
    }

    const onInteract = () => {
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
      window.removeEventListener('touchstart', onInteract)
      tryPlay()
    }

    // Attempt autoplay; if blocked, wait for the first interaction.
    tryPlay().then(() => {
      if (audio.paused) {
        window.addEventListener('pointerdown', onInteract, { once: true })
        window.addEventListener('keydown', onInteract, { once: true })
        window.addEventListener('touchstart', onInteract, { once: true })
      }
    })

    return () => {
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
      window.removeEventListener('touchstart', onInteract)
    }
  }, [])

  // Sync state when audio naturally pauses/ends.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  // "Close" pauses the music and collapses the box to a small icon — never
  // permanently hides it, so the user always has a way to stop the music.
  const close = () => {
    const audio = audioRef.current
    if (audio) audio.pause()
    setPlaying(false)
    setCollapsed(true)
  }

  const expand = () => setCollapsed(false)

  // ---- Dragging ----
  const onPointerDown = (e: React.PointerEvent) => {
    // Only start dragging from the non-button area (the label / music icon).
    const target = e.target as HTMLElement
    if (target.closest('button')) return

    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect) return
    dragState.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      dragging: true,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return
    const { x, y } = clamp(e.clientX - dragState.current.dx, e.clientY - dragState.current.dy)
    setPos({ x, y })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    dragState.current.dragging = false
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  if (!pos) return null

  return (
    <div
      ref={boxRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
      className="fixed z-50 select-none"
    >
      {collapsed ? (
        // Collapsed: a small floating music icon that expands on click.
        <button
          type="button"
          onClick={expand}
          aria-label="Show vedhh player"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-line bg-canvas/90 text-accent shadow-soft backdrop-blur-xl transition-transform duration-300 ease-expo hover:scale-105"
        >
          <IconMusic width={18} height={18} />
        </button>
      ) : (
        <div className="spot pointer-events-auto flex items-center gap-2.5 rounded-full border border-ink-line bg-canvas/90 px-2 py-2 pr-3 shadow-soft backdrop-blur-xl">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause vedhh' : 'Play vedhh'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-transform duration-300 ease-expo hover:scale-105"
          >
            {playing ? <IconPause width={15} height={15} /> : <IconPlay width={15} height={15} />}
          </button>

          {/* Track label + equalizer (drag handle) */}
          <div className="flex items-center gap-2.5 cursor-grab active:cursor-grabbing">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-line bg-cream text-accent">
              <IconMusic width={14} height={14} />
            </span>
            <div className="leading-tight">
              <div className="font-serif text-sm font-normal tracking-tight text-ink">vedhh</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                {playing ? 'Now playing' : 'Ambient sitar'}
              </div>
            </div>
            {playing && (
              <span className="flex h-4 items-end gap-[3px]">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] origin-bottom rounded-full bg-accent"
                    style={{
                      height: '100%',
                      animation: 'eq 0.9s ease-in-out infinite',
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </span>
            )}
          </div>

          {/* Close (collapses the box, pauses music) */}
          <button
            type="button"
            onClick={close}
            aria-label="Close vedhh player"
            className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-cream hover:text-ink"
          >
            <IconClose width={14} height={14} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      {/* The audio element is always present while the player is mounted,
          but playback is controlled by the play/pause button. */}
      <audio ref={audioRef} src="/vedhh.wav" loop preload="auto" />
    </div>
  )
}
