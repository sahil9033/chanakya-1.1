'use client'

import { useEffect, useRef, useState } from 'react'
import { IconClose, IconMusic, IconPause, IconPlay } from './Icons'

const STORAGE_KEY = 'vedhh-music-dismissed'

/**
 * Floating ambient music player.
 * - Auto-plays the "vedhh" track on first user interaction (browsers block
 *   untriggered audio autoplay, so we start on the first pointer/key event).
 * - Loops indefinitely.
 * - User can play/pause or dismiss the player (dismissal is remembered).
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(true)

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

    const onInteract = () => {
      tryPlay()
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
      window.removeEventListener('touchstart', onInteract)
    }

    // Attempt immediately; if blocked, wait for first interaction.
    tryPlay().then(() => {
      if (!audio.paused) {
        window.removeEventListener('pointerdown', onInteract)
        window.removeEventListener('keydown', onInteract)
        window.removeEventListener('touchstart', onInteract)
      } else {
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

  const close = () => {
    const audio = audioRef.current
    if (audio) audio.pause()
    setPlaying(false)
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
  }

  if (!visible) {
    // Keep the audio element mounted (hidden) so state persists across
    // route changes, but don't render the UI.
    return <audio ref={audioRef} src="/vedhh.wav" loop preload="auto" />
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in sm:bottom-6">
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
