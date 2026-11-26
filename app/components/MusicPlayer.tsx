'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IconClose, IconMusic, IconPause, IconPlay } from './Icons'

const STORAGE_KEY = 'vedhh-music-dismissed'

/**
 * Floating ambient music player, pinned to the bottom-right so it never covers
 * the chat composer.
 * - Auto-plays the "vedhh" track on first user interaction (browsers block
 *   untriggered audio autoplay, so we start on the first pointer/key event).
 * - Loops indefinitely.
 * - The audio element only exists while the player UI is rendered, so music can
 *   never keep playing once the box is dismissed.
 * - Dismissal is remembered.
 */
export default function MusicPlayer() {
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(true)

  // The chat composer owns the bottom of the screen, so lift the player above it.
  const onChat = pathname?.startsWith('/chat') ?? false

  // Respect a previous dismissal.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setVisible(false)
    } catch {}
  }, [])

  // Start playback on the first user interaction (autoplay policy workaround).
  useEffect(() => {
    if (!visible) return
    const audio = audioRef.current
    if (!audio) return

    let started = false
    const cleanup = () => {
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
      window.removeEventListener('touchstart', onInteract)
    }
    const tryPlay = async () => {
      if (started) return
      started = true
      try {
        audio.volume = 0.55
        await audio.play()
        setPlaying(true)
      } catch {
        /* autoplay still blocked — user can press play manually */
        started = false
      }
    }
    function onInteract() {
      cleanup()
      tryPlay()
    }

    tryPlay().then(() => {
      if (audio.paused) {
        window.addEventListener('pointerdown', onInteract, { once: true })
        window.addEventListener('keydown', onInteract, { once: true })
        window.addEventListener('touchstart', onInteract, { once: true })
      }
    })

    return cleanup
  }, [visible])

  // Sync state when audio naturally pauses/ends (shouldn't with loop, but safe).
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
  }, [visible])

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

  const close = () => {
    const audio = audioRef.current
    if (audio) audio.pause()
    setPlaying(false)
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
  }

  // No player UI → no audio element. Music can never play with no way to stop it.
  if (!visible) return null

  return (
    <div
      className={`fixed right-4 z-40 sm:right-6 ${
        onChat ? 'bottom-28 sm:bottom-36' : 'bottom-4 sm:bottom-6'
      }`}
    >
      <div className="spot pointer-events-auto flex items-center gap-2.5 rounded-full border border-ink-line bg-canvas/90 px-2 py-2 pr-3.5 shadow-soft backdrop-blur-xl">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause vedhh' : 'Play vedhh'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-transform duration-300 ease-expo hover:scale-105"
        >
          {playing ? <IconPause width={15} height={15} /> : <IconPlay width={15} height={15} />}
        </button>

        {/* Track label + equalizer */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-line bg-cream text-accent">
            <IconMusic width={14} height={14} />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-sm font-normal tracking-tight text-ink">vedhh</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {playing ? 'Now playing' : 'Ambient sitar'}
            </div>
          </div>
          {/* Equalizer bars */}
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

        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label="Close vedhh player"
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-cream hover:text-ink"
        >
          <IconClose width={14} height={14} />
        </button>
      </div>

      <style>{`
        @keyframes eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <audio ref={audioRef} src="/vedhh.wav" loop preload="auto" />
    </div>
  )
}
