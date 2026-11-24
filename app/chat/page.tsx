'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import SignInGate from '../components/SignInGate'
import Reveal from '../components/Reveal'
import {
  Chakra,
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconCopy,
  IconSend,
} from '../components/Icons'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  latency?: string
}

const FILTER_TABS = [
  { id: 'all', label: 'Supreme Synthesis', desc: 'Arthashastra + Chanakya Niti + Upaniṣadic Viveka' },
  { id: 'arthashastra', label: 'Arthashastra', desc: '15 Books of Kautilya, Saptanga & 4 Upayas' },
  { id: 'niti', label: 'Chanakya Niti', desc: 'Human psychology, deceit and deterrence' },
  { id: 'upanishad', label: 'Upaniṣadic Viveka', desc: 'Detachment (Nishkama Karma) & inner sovereignty' },
]

const STRATEGIC_INQUIRIES = [
  'My partner is secretly negotiating behind my back with our competitor. What should I do?',
  'How to negotiate when the adversary holds 90% of the leverage and resources?',
  'What are the 4 Upāyas and how should I apply them in conflict?',
  'How do I detect deceit and test the true loyalty of allies?',
  'Explain Upaniṣadic Viveka (discernment) in high-stakes decisions.',
  'How should a leader overcome betrayal without emotional weakness?',
]

function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-ink">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1.5" />

        // Roman numeral section headers
        if (/^(I|II|III|IV|V)\.\s+/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-center gap-2 pb-1 pt-3">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="font-serif text-base font-normal tracking-tight text-ink sm:text-lg">
                {trimmed}
              </span>
            </div>
          )
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          return (
            <blockquote
              key={idx}
              className="rounded-r-xl border-l-2 border-accent bg-accent-tint py-2.5 pl-4 pr-3 font-serif text-[15px] italic leading-relaxed text-ink-soft"
            >
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          )
        }

        // Bullets
        if (/^[-*•]\s+/.test(trimmed)) {
          const text = trimmed.replace(/^[-*•]\s+/, '')
          return (
            <div key={idx} className="flex items-start gap-3 pl-1">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span className="text-ink/90">{renderBold(text)}</span>
            </div>
          )
        }

        // Numbered list
        const numbered = trimmed.match(/^(\d+)\.\s+(.*)/)
        if (numbered) {
          return (
            <div key={idx} className="flex items-start gap-3 pl-1">
              <span className="mt-0.5 w-4 shrink-0 text-right font-mono text-xs font-semibold text-accent-deep">
                {numbered[1]}
              </span>
              <span className="text-ink/90">{renderBold(numbered[2])}</span>
            </div>
          )
        }

        return (
          <p key={idx} className="text-ink/90">
            {renderBold(line)}
          </p>
        )
      })}
    </div>
  )
}

function renderBold(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
}

function ChatContent() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'all'
  const [filter, setFilter] = useState(initialFilter)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasAutoFired = useRef(false)

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt && !hasAutoFired.current && messages.length === 0) {
      hasAutoFired.current = true
      handleSend(urlPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [input])

  async function handleSend(textToSend?: string) {
    const query = (textToSend ?? input).trim()
    if (!query || loading) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = { role: 'user', content: query, timestamp: now }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    const t0 = performance.now()
    const assistantIndex = updatedMessages.length

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', timestamp: now, latency: 'streaming' },
    ])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, filter }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || `Server returned ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('Streaming connection failed')

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const latency = `${((performance.now() - t0) / 1000).toFixed(1)}s`
        setMessages((prev) => {
          const next = [...prev]
          if (next[assistantIndex]) {
            next[assistantIndex] = { ...next[assistantIndex], content: accumulated, latency }
          }
          return next
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setMessages((prev) => {
        const next = [...prev]
        if (next[assistantIndex]) {
          next[assistantIndex] = {
            ...next[assistantIndex],
            content: `Counsel interrupted — ${message}`,
            latency: 'error',
          }
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-ink-line">
        <div className="mesh" aria-hidden="true">
          <span className="mesh-layer mesh-a" />
          <span className="mesh-layer mesh-c" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <Reveal className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-canvas/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Streamed counsel · Arthashastra
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.03] tracking-tightest text-ink sm:text-6xl">
              Ask <em className="italic text-accent-deep">Chanakya</em>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft">
              Every inquiry is dissected through the{' '}
              <strong className="font-medium text-ink">15 Adhikaraṇas</strong>, the{' '}
              <strong className="font-medium text-ink">4 Upāyas</strong> and{' '}
              <strong className="font-medium text-ink">Upaniṣadic Viveka</strong> — streamed token
              by token.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter rail */}
      <div className="sticky top-16 z-30 border-b border-ink-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-ink-line bg-cream p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTER_TABS.map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  title={tab.desc}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    active ? 'bg-canvas text-ink shadow-xs' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {messages.length > 0 &&
            (confirmReset ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMessages([])
                    setConfirmReset(false)
                  }}
                  className="whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-canvas"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="whitespace-nowrap rounded-full border border-ink-line px-3 py-1.5 text-xs text-ink-soft"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="whitespace-nowrap rounded-full border border-ink-line bg-canvas px-3 py-1.5 text-xs text-ink-soft transition-colors hover:text-ink"
              >
                Reset
              </button>
            ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 pb-44 sm:px-6">
        {messages.length === 0 ? (
          <div className="py-2">
            <Reveal>
              <div className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Strategic dilemmas to consult
              </div>
            </Reveal>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {STRATEGIC_INQUIRIES.map((prompt, i) => (
                <Reveal key={prompt} delay={i * 55} className="h-full">
                  <button
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="spot group flex h-full w-full items-start gap-2.5 rounded-2xl border border-ink-line bg-canvas p-4 text-left text-xs leading-snug text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
                  >
                    <IconArrowRight
                      width={15}
                      height={15}
                      className="mt-0.5 shrink-0 text-accent transition-transform duration-300 ease-expo group-hover:translate-x-0.5"
                    />
                    <span className="group-hover:text-ink">{prompt}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            {messages.map((m, i) => {
              const isUser = m.role === 'user'
              return (
                <div
                  key={i}
                  className={`flex flex-col animate-fade-in ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="mb-2 flex items-center gap-2 px-1 text-xs text-ink-faint">
                    {!isUser && (
                      <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                          <Chakra width={13} height={13} />
                        </span>
                        <span className="font-medium text-ink">Acharya Chanakya</span>
                        {m.latency && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                              m.latency === 'error'
                                ? 'border-accent/30 bg-accent-tint text-accent-deep'
                                : 'border-ink-line bg-cream text-ink-soft'
                            }`}
                          >
                            {m.latency !== 'error' && <IconBolt width={10} height={10} />}
                            {m.latency === 'streaming' ? 'streaming' : m.latency}
                          </span>
                        )}
                      </>
                    )}
                    {isUser && <span className="font-medium text-ink-soft">You</span>}
                    {m.timestamp && <span className="text-[11px] text-ink-faint">· {m.timestamp}</span>}
                  </div>

                  <div
                    className={`max-w-[92%] rounded-3xl px-5 py-4 shadow-sm sm:max-w-[85%] sm:px-6 ${
                      isUser
                        ? 'rounded-tr-lg bg-ink text-canvas'
                        : 'rounded-tl-lg border border-ink-line bg-canvas'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.content}</p>
                    ) : m.content ? (
                      <FormattedContent content={m.content} />
                    ) : (
                      <div className="flex items-center gap-2.5 text-sm text-ink-soft">
                        <span className="flex gap-1">
                          {[0, 150, 300].map((d) => (
                            <span
                              key={d}
                              className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-accent"
                              style={{ animationDelay: `${d}ms` }}
                            />
                          ))}
                        </span>
                        <span>Consulting the treatises…</span>
                      </div>
                    )}

                    {!isUser && m.content && (
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-line pt-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-faint">
                          <IconCheck width={12} height={12} className="text-accent-deep" />
                          Arthashastra &amp; Upaniṣadic filter applied
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(m.content, i)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-cream px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:text-ink"
                        >
                          {copiedIdx === i ? (
                            <>
                              <IconCheck width={13} height={13} className="text-accent-deep" />
                              Copied
                            </>
                          ) : (
                            <>
                              <IconCopy width={13} height={13} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div ref={endRef} className="scroll-mb-40" />
      </div>

      {/* Composer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-canvas via-canvas/95 to-transparent p-4 pt-10 sm:p-6">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          <div className="rounded-3xl border border-ink-line bg-canvas/90 p-2 shadow-soft backdrop-blur-xl transition-all duration-300 focus-within:border-accent/45 focus-within:shadow-glow sm:p-2.5">
            <div className="flex items-end gap-2 px-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask Chanakya anything — statecraft, negotiation, human nature…"
                disabled={loading}
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-normal text-ink placeholder:text-ink-faint focus:outline-none focus:ring-0 sm:text-base"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-canvas shadow-sm transition-all duration-200 hover:shadow-lift disabled:pointer-events-none disabled:opacity-25 sm:text-sm"
              >
                <IconSend width={15} height={15} />
                Ask
              </button>
            </div>
            <div className="flex items-center justify-between px-3 pb-0.5 pt-1 text-[11px] text-ink-faint">
              <span>
                Filter <strong className="font-medium uppercase text-ink-soft">{filter}</strong> ·
                Enter ↵ to send
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Real-time streaming
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ChatPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-canvas text-ink">
      <Navbar />
      <SignInGate>
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center py-24 text-sm text-ink-soft">
              Loading Chanakya counsel…
            </div>
          }
        >
          <ChatContent />
        </Suspense>
      </SignInGate>
    </div>
  )
}
