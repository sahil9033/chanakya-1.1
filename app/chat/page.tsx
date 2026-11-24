'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import SignInGate from '../components/SignInGate'
import {
  Chakra,
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconChevronRight,
  IconClose,
  IconCopy,
  IconMessageSquare,
  IconPlus,
  IconSend,
  IconSidebar,
  IconTrash,
} from '../components/Icons'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  latency?: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  filter: string
  model: string
  updatedAt: number
}

const TREATISE_LENSES = [
  {
    id: 'all',
    label: 'Supreme Synthesis',
    badge: '✦ Supreme Synthesis',
    desc: 'Arthashastra + Chanakya Niti + Upaniṣadic Viveka',
  },
  {
    id: 'arthashastra',
    label: 'Arthashastra',
    badge: '⚔️ Arthashastra',
    desc: '15 Books of Kautilya, Saptanga & 4 Upayas',
  },
  {
    id: 'niti',
    label: 'Chanakya Niti',
    badge: '📜 Chanakya Niti',
    desc: 'Human psychology, deceit and deterrence',
  },
  {
    id: 'upanishad',
    label: 'Upaniṣadic Viveka',
    badge: '🕉️ Upaniṣadic Viveka',
    desc: 'Detachment (Nishkama Karma) & inner sovereignty',
  },
]

const AI_MODELS = [
  {
    id: 'bolt',
    name: 'Chanakya Flash',
    tag: '⚡ Flash Bolt',
    desc: 'Sub-second real-time streaming · Fast as lightning',
  },
  {
    id: 'super',
    name: 'Chanakya Deep',
    tag: '🧠 Deep Sovereign',
    desc: 'Maximum depth & comprehensive strategic reasoning',
  },
]

const STRATEGIC_INQUIRIES = [
  'My partner is secretly negotiating behind my back with our competitor. What should I do?',
  'How to negotiate when the adversary holds 90% of the leverage and resources?',
  'What are the 4 Upāyas and how should I apply them in conflict?',
  'How do I detect deceit and test the true loyalty of allies?',
  'Explain Upaniṣadic Viveka (discernment) in high-stakes decisions.',
  'How should a leader overcome betrayal without emotional weakness?',
]

function currentLens(id: string) {
  return TREATISE_LENSES.find((t) => t.id === id) ?? TREATISE_LENSES[0]
}

function currentModel(id: string) {
  return AI_MODELS.find((m) => m.id === id) ?? AI_MODELS[0]
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-ink">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1.5" />

        if (/^(I|II|III|IV|V)\.\s+/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-center gap-2 pb-1 pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-serif text-base font-normal tracking-tight text-ink sm:text-lg">
                {trimmed}
              </span>
            </div>
          )
        }

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

        if (/^[-*•]\s+/.test(trimmed)) {
          const text = trimmed.replace(/^[-*•]\s+/, '')
          return (
            <div key={idx} className="flex items-start gap-3 pl-1">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span className="text-ink/90">{renderBold(text)}</span>
            </div>
          )
        }

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
  const [selectedModel, setSelectedModel] = useState('bolt')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')

  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasAutoFired = useRef(false)

  // On desktop screens (>=768px), open sidebar by default; on mobile, keep closed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setSidebarOpen(true)
    }
  }, [])

  // Load chat sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chanakya_chat_sessions_v1')
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSession[]
        setSessions(parsed)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  // Auto-scroll when messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  // Save session when messages change
  const saveCurrentSession = (updatedMsgs: Message[], activeFilter = filter, activeModel = selectedModel) => {
    if (updatedMsgs.length === 0) return

    const title =
      updatedMsgs.find((m) => m.role === 'user')?.content.slice(0, 38) || 'Consultation'

    setSessions((prev) => {
      let id = currentSessionId
      if (!id) {
        id = `session_${Date.now()}`
        setCurrentSessionId(id)
      }

      const existingIndex = prev.findIndex((s) => s.id === id)
      const newSession: ChatSession = {
        id,
        title: title.length >= 38 ? `${title}…` : title,
        messages: updatedMsgs,
        filter: activeFilter,
        model: activeModel,
        updatedAt: Date.now(),
      }

      const updated =
        existingIndex >= 0
          ? prev.map((s, idx) => (idx === existingIndex ? newSession : s))
          : [newSession, ...prev]

      try {
        localStorage.setItem('chanakya_chat_sessions_v1', JSON.stringify(updated.slice(0, 20)))
      } catch {
        // ignore storage errors
      }

      return updated
    })
  }

  // Auto-fire prompt from query params if present
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt')
    if (urlPrompt && !hasAutoFired.current && messages.length === 0) {
      hasAutoFired.current = true
      handleSend(urlPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function startNewChat() {
    setMessages([])
    setCurrentSessionId(`session_${Date.now()}`)
    setInput('')
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
    if (textareaRef.current) textareaRef.current.focus()
  }

  function loadSession(s: ChatSession) {
    setCurrentSessionId(s.id)
    setMessages(s.messages)
    setFilter(s.filter || 'all')
    setSelectedModel(s.model || 'bolt')
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  function deleteSession(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      try {
        localStorage.setItem('chanakya_chat_sessions_v1', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
    if (currentSessionId === id) {
      startNewChat()
    }
  }

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
        body: JSON.stringify({
          messages: updatedMessages,
          filter,
          model: selectedModel,
        }),
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

      const finalMessages = [
        ...updatedMessages,
        {
          role: 'assistant' as const,
          content: accumulated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latency: `${((performance.now() - t0) / 1000).toFixed(1)}s`,
        },
      ]
      saveCurrentSession(finalMessages)
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

  const hasMessages = messages.length > 0
  const activeLensObj = currentLens(filter)
  const activeModelObj = currentModel(selectedModel)

  return (
    <div className="flex h-[calc(100dvh-65px)] w-full overflow-hidden bg-canvas text-ink relative">
      {/* =========================================================================
          MOBILE BACKDROP OVERLAY
         ========================================================================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* =========================================================================
          CLAUDE-STYLE COLLAPSIBLE SIDEBAR (Drawer on mobile, side panel on desktop)
         ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-ink-line bg-canvas shadow-2xl transition-transform duration-300 ease-in-out md:relative md:inset-auto md:z-20 md:shadow-none md:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0 w-72 sm:w-80 md:w-64 lg:w-72 shrink-0'
            : '-translate-x-full w-72 md:w-0 md:overflow-hidden md:border-none'
        }`}
      >
        <div className="flex h-full flex-col p-3.5">
          {/* Header Row: New Consultation CTA + Mobile Close Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startNewChat}
              className="group flex flex-1 items-center justify-between rounded-2xl border border-ink-line bg-cream/70 px-4 py-2.5 text-xs font-medium text-ink shadow-xs transition-all duration-200 hover:border-accent/40 hover:bg-cream"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-canvas">
                  <IconPlus width={12} height={12} />
                </span>
                <span>New consultation</span>
              </span>
              <span className="text-[10px] text-ink-faint hidden sm:inline">⌘K</span>
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink-line bg-canvas text-ink-soft hover:text-ink md:hidden transition-colors"
              title="Close sidebar"
            >
              <IconClose width={16} height={16} />
            </button>
          </div>

          {/* Treatise Strategy Lenses Selection */}
          <div className="mt-5">
            <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Treatise Lens
            </div>
            <div className="mt-2 space-y-1">
              {TREATISE_LENSES.map((tab) => {
                const active = filter === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setFilter(tab.id)
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setSidebarOpen(false)
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors ${
                      active
                        ? 'bg-ink text-canvas font-medium shadow-xs'
                        : 'text-ink-soft hover:bg-cream/80 hover:text-ink'
                    }`}
                  >
                    <span className="truncate">{tab.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Selection */}
          <div className="mt-5">
            <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Engine Model
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-cream/80 p-1 border border-ink-line/60">
              {AI_MODELS.map((m) => {
                const active = selectedModel === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.id)
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setSidebarOpen(false)
                      }
                    }}
                    className={`rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all ${
                      active
                        ? 'bg-canvas text-ink shadow-xs border border-ink-line'
                        : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {m.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Consultations / Chat History (Stored locally) */}
          <div className="mt-6 flex-1 overflow-y-auto">
            <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Recent Consultations
            </div>
            <div className="mt-2 space-y-1">
              {sessions.length === 0 ? (
                <div className="px-2 py-3 text-left text-xs text-ink-faint italic">
                  No previous sessions yet. Ask your first counsel above.
                </div>
              ) : (
                sessions.map((s) => {
                  const isActive = currentSessionId === s.id
                  return (
                    <div
                      key={s.id}
                      onClick={() => loadSession(s)}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                        isActive
                          ? 'bg-cream text-ink font-medium border border-ink-line/70'
                          : 'text-ink-soft hover:bg-cream/60 hover:text-ink'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <IconMessageSquare width={13} height={13} className="shrink-0 text-ink-faint" />
                        <span className="truncate">{s.title}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => deleteSession(e, s.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-accent-deep transition-opacity p-0.5"
                        title="Delete session"
                      >
                        <IconTrash width={12} height={12} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-ink-line pt-3 text-[11px] text-ink-faint">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                NVIDIA NIM
              </span>
              <span className="font-mono text-[10px]">v1.1</span>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CHAT PANEL (Claude-Style Central Reading & Conversation)
         ========================================================================= */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-canvas w-full">
        {/* Top Header Bar inside Chat View */}
        <div className="flex h-12 sm:h-13 shrink-0 items-center justify-between border-b border-ink-line bg-canvas/85 px-3 sm:px-4 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Sidebar toggle button (Claude style) */}
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-line bg-canvas text-ink-soft hover:text-ink hover:border-accent/40 transition-colors"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <IconSidebar width={16} height={16} />
            </button>

            {/* Active Mode & Model Badges */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-cream px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-ink max-w-[140px] sm:max-w-none truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                <span className="truncate">{activeLensObj.label}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-ink-line/70 bg-canvas px-2.5 py-1 text-[11px] text-ink-soft">
                {activeModelObj.tag}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {hasMessages && (
              <button
                type="button"
                onClick={startNewChat}
                className="inline-flex items-center gap-1 rounded-full border border-ink-line bg-canvas px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs text-ink-soft hover:text-ink hover:border-accent/30 transition-colors"
              >
                <IconPlus width={12} height={12} />
                <span className="hidden xs:inline">New</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Conversation Stage */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 pb-36 sm:pb-48">
          <div className="mx-auto w-full max-w-3xl">
            {!hasMessages ? (
              /* Empty State (Claude style with Chanakya sovereign branding) */
              <div className="py-8 sm:py-20 text-center animate-fade-in">
                <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-cream border border-ink-line shadow-xs mb-4 sm:mb-5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-accent-deep">चा</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl text-ink font-normal tracking-tight">
                  Consult Acharya Chanakya
                </h1>
                <p className="mt-2.5 sm:mt-3 max-w-md mx-auto text-xs sm:text-sm text-ink-soft leading-relaxed px-2">
                  Strategic counsel synthesized from the Arthashastra, Chanakya Niti, and Upanishads.
                  Select a dilemma below or pose your inquiry directly.
                </p>

                {/* Quick Dilemma Cards */}
                <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-left">
                  {STRATEGIC_INQUIRIES.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="group flex items-start gap-3 rounded-2xl border border-ink-line bg-canvas p-3.5 sm:p-4 text-xs leading-relaxed text-ink-soft hover:border-accent/40 hover:text-ink hover:shadow-soft transition-all"
                    >
                      <IconArrowRight
                        width={14}
                        height={14}
                        className="mt-0.5 shrink-0 text-accent group-hover:translate-x-0.5 transition-transform"
                      />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message Thread */
              <div className="space-y-5 sm:space-y-7">
                {messages.map((m, i) => {
                  const isUser = m.role === 'user'
                  return (
                    <div
                      key={i}
                      className={`flex flex-col animate-fade-in ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="mb-1.5 sm:mb-2 flex items-center gap-2 px-1 text-xs text-ink-faint">
                        {!isUser ? (
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
                                {m.latency}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="font-medium text-ink-soft">You</span>
                        )}
                        {m.timestamp && <span className="text-[11px] text-ink-faint">· {m.timestamp}</span>}
                      </div>

                      <div
                        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm ${
                          isUser
                            ? 'rounded-tr-lg bg-ink text-canvas'
                            : 'rounded-tl-lg border border-ink-line bg-canvas w-full sm:w-auto'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed break-words">{m.content}</p>
                        ) : m.content ? (
                          <div className="break-words">
                            <FormattedContent content={m.content} />
                          </div>
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
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-faint truncate">
                              <IconCheck width={12} height={12} className="text-accent-deep shrink-0" />
                              <span className="truncate">{activeLensObj.label} lens</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(m.content, i)}
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-line bg-cream px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:text-ink"
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

            <div ref={endRef} className="scroll-mb-36 sm:scroll-mb-40" />
          </div>
        </div>

        {/* =========================================================================
            CLAUDE-STYLE FLOATING COMPOSER AT BOTTOM (Mobile responsive)
           ========================================================================= */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-canvas via-canvas/95 to-transparent p-2.5 sm:p-4 pb-2.5 sm:pb-6 pt-5 sm:pt-10">
          <div className="pointer-events-auto mx-auto w-full max-w-3xl">
            <div className="rounded-2xl sm:rounded-3xl border border-ink-line bg-canvas/95 p-1.5 sm:p-2.5 shadow-soft backdrop-blur-xl transition-all duration-300 focus-within:border-accent/45 focus-within:shadow-glow">
              <div className="flex items-end gap-1.5 sm:gap-2 px-1">
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
                  placeholder="Ask Chanakya anything — statecraft, negotiation…"
                  disabled={loading}
                  rows={1}
                  className="max-h-36 sm:max-h-40 flex-1 resize-none bg-transparent px-2.5 sm:px-3 py-2 text-base leading-normal text-ink placeholder:text-ink-faint focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-medium text-canvas shadow-sm transition-all duration-200 hover:shadow-lift disabled:pointer-events-none disabled:opacity-25 sm:text-sm"
                >
                  <IconSend width={14} height={14} />
                  <span>Ask</span>
                </button>
              </div>

              {/* Bottom bar inside composer (Treatise + Model selector pills Claude-style) */}
              <div className="flex items-center justify-between gap-1.5 px-1 sm:px-2 pb-0.5 pt-1.5 sm:pt-2 border-t border-ink-line/50">
                <div className="flex items-center gap-1.5 max-w-full overflow-x-auto no-scrollbar py-0.5">
                  {/* Treatise Lens Pill Dropdown */}
                  <div className="relative group shrink-0">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="cursor-pointer appearance-none rounded-full border border-ink-line bg-canvas pl-2.5 sm:pl-3 pr-6 sm:pr-7 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium text-ink-soft hover:text-ink hover:border-accent/40 transition-colors focus:outline-none max-w-[130px] sm:max-w-none truncate"
                    >
                      {TREATISE_LENSES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <IconChevronRight
                      width={11}
                      height={11}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-ink-faint"
                    />
                  </div>

                  {/* Model Selector Pill Dropdown */}
                  <div className="relative group shrink-0">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="cursor-pointer appearance-none rounded-full border border-ink-line bg-canvas pl-2.5 sm:pl-3 pr-6 sm:pr-7 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium text-ink-soft hover:text-ink hover:border-accent/40 transition-colors focus:outline-none max-w-[110px] sm:max-w-none truncate"
                    >
                      {AI_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.tag}
                        </option>
                      ))}
                    </select>
                    <IconChevronRight
                      width={11}
                      height={11}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-ink-faint"
                    />
                  </div>
                </div>

                <span className="hidden items-center gap-1.5 text-[11px] text-ink-faint md:flex shrink-0">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  Enter ↵ to send · sub-second streaming
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
