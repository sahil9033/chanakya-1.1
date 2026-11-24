'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  latency?: string
}

const FILTER_TABS = [
  { id: 'all', label: '✦ Complete Synthesis', desc: 'Arthashastra + Chanakya Niti + Upanishads' },
  { id: 'arthashastra', label: '⚔️ Arthashastra Realpolitik', desc: 'Statecraft, 4 Upayas & Strategy' },
  { id: 'niti', label: '📜 Chanakya Niti', desc: 'Human Psychology & Discerning Allies' },
  { id: 'upanishad', label: '🕉️ Upanishadic Viveka', desc: 'Detachment, Dharma & Inner Sovereignty' },
]

const QUICK_COUNSEL_PROMPTS = [
  'How to negotiate when the adversary holds 90% of the leverage?',
  'What are the 4 Upayas (Sama, Dama, Bheda, Danda) and how should I apply them?',
  'How do I identify deceit and test the true loyalty of ministers or allies?',
  'Explain the Upanishadic concept of Viveka (discernment) in worldly decision making.',
  'How should a leader overcome betrayal without succumbing to emotional weakness?',
  'What does the Arthashastra teach about managing capital, treasury, and resources?',
]

function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-2.5 text-[#1E2033] leading-relaxed text-[15px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />
        }

        if (trimmed.startsWith('>')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-[#D5650F] pl-3.5 py-2 my-2 italic text-[#585C7B] bg-[#FFF8F3] rounded-r-lg font-serif"
            >
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          )
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const bulletText = trimmed.replace(/^[-*•]\s*/, '')
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1">
              <span className="text-[#D5650F] mt-1.5 text-[10px]">✦</span>
              <span className="text-[#2C3048]">{renderBold(bulletText)}</span>
            </div>
          )
        }

        const matchNumber = trimmed.match(/^(\d+)\.\s+(.*)/)
        if (matchNumber) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1">
              <span className="text-[#D5650F] font-semibold text-xs mt-1 w-4 text-right">
                {matchNumber[1]}.
              </span>
              <span className="text-[#2C3048]">{renderBold(matchNumber[2])}</span>
            </div>
          )
        }

        return <p key={idx}>{renderBold(line)}</p>
      })}
    </div>
  )
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#1E2033]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function ChatContent() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'all'
  const [filter, setFilter] = useState(initialFilter)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, filter }),
      })

      const rawText = await res.text()
      let data: any
      try {
        data = JSON.parse(rawText)
      } catch {
        throw new Error(rawText || `Server returned ${res.status}`)
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server returned ${res.status}`)
      }

      const t1 = performance.now()
      const latencySec = ((t1 - t0) / 1000).toFixed(1)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latency: `${latencySec}s flash`,
        },
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Counsel interrupted: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
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
    <div className="min-h-screen flex flex-col bg-white text-[#1E2033] relative">
      <Navbar />

      {/* Top Filter Selection Tabs (Sarvam Style) */}
      <div className="bg-[#F7F7F8] border-b border-[#E6E6E6] py-2.5 px-4 sticky top-[72px] z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 p-1 bg-[#EBECEF] rounded-full">
            {FILTER_TABS.map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-white text-[#1E2033] shadow-xs border border-[rgba(30,32,51,0.08)]'
                      : 'text-[#585C7B] hover:text-[#1E2033]'
                  }`}
                  title={tab.desc}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear chat session?')) setMessages([])
              }}
              className="text-xs text-[#585C7B] hover:text-[#D5650F] whitespace-nowrap px-3 py-1.5 rounded-full border border-[#E6E6E6] bg-white transition-colors"
            >
              Reset Chat
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 z-10 pb-36">
        {messages.length === 0 ? (
          <div className="py-8 sm:py-12 flex flex-col items-center text-center animate-fadeIn">
            {/* Cultural Seal */}
            <div className="w-16 h-16 rounded-full bg-[#FFF8F3] border border-[#D5650F]/30 flex items-center justify-center text-[#D5650F] text-2xl font-serif font-bold mb-4 shadow-sm">
              चा
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#1E2033]">
              Ask Chanakya Anything
            </h1>
            <p className="max-w-lg text-[#585C7B] text-xs sm:text-sm mt-2 leading-relaxed">
              Every counsel strictly conforms to the <strong className="text-[#1E2033]">Arthashastra</strong>, <strong className="text-[#1E2033]">Chanakya Niti</strong>, and <strong className="text-[#1E2033]">Upanishadic Viveka</strong>. Formulated in seconds via sovereign NVIDIA NIM.
            </p>

            {/* Quick Prompt Chips */}
            <div className="mt-8 w-full max-w-2xl text-left space-y-2">
              <div className="text-[11px] font-semibold text-[#8F92A9] uppercase tracking-wider px-1">
                Strategic Inquiries
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_COUNSEL_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="p-3 text-left rounded-xl border border-[#E6E6E6] hover:border-[#D5650F]/50 bg-white hover:bg-[#FFFDFB] text-xs text-[#2C3048] transition-all flex items-start gap-2 shadow-xs group"
                  >
                    <span className="text-[#D5650F] mt-0.5">✦</span>
                    <span className="group-hover:text-[#1E2033] leading-snug">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              } animate-fadeIn`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-2 text-xs text-[#585C7B]">
                {m.role === 'assistant' ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-[#D5650F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      चा
                    </div>
                    <span className="font-semibold text-[#1E2033]">Acharya Chanakya</span>
                    <span className="text-[#8F92A9]">· Royal Chancellor</span>
                    {m.latency && (
                      <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ⚡ {m.latency}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="font-medium text-[#585C7B]">Seeker</span>
                  </>
                )}
                {m.timestamp && <span className="text-[#A6A8BC] text-[11px]">· {m.timestamp}</span>}
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-3xl px-5 sm:px-6 py-4 shadow-sm ${
                  m.role === 'user'
                    ? 'bg-[#1E2033] text-white rounded-tr-sm'
                    : 'bg-white border border-[#E6E6E6] text-[#1E2033] rounded-tl-sm shadow-[0_2px_12px_rgba(30,32,51,0.04)]'
                }`}
              >
                {m.role === 'assistant' ? (
                  <FormattedContent content={m.content} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content}</p>
                )}

                {m.role === 'assistant' && (
                  <div className="mt-4 pt-2.5 border-t border-[#F0F1F5] flex items-center justify-between text-xs text-[#8F92A9]">
                    <span className="text-[11px] text-[#A6A8BC] font-serif">
                      100% Arthashastra & Upanishadic Filter Applied
                    </span>
                    <button
                      onClick={() => copyToClipboard(m.content, i)}
                      className="hover:text-[#1E2033] flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-full bg-[#F7F7F8] hover:bg-[#F0F1F5] border border-[rgba(30,32,51,0.06)]"
                    >
                      {copiedIdx === i ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 text-[#585C7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[#585C7B]">Copy Counsel</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex flex-col items-start animate-fadeIn">
            <div className="flex items-center gap-2 mb-1.5 px-2 text-xs text-[#585C7B]">
              <div className="w-5 h-5 rounded-full bg-[#D5650F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                चा
              </div>
              <span className="font-semibold text-[#1E2033]">Chanakya</span>
              <span className="text-[#8F92A9]">is formulating strategy...</span>
            </div>
            <div className="px-5 py-4 rounded-3xl bg-white border border-[#E6E6E6] rounded-tl-sm flex items-center gap-3 shadow-[0_2px_12px_rgba(30,32,51,0.04)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D5650F] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#D5650F] animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#D5650F] animate-bounce [animation-delay:0.3s]" />
              </div>
              <span className="text-sm text-[#585C7B] font-serif italic">
                Scanning Arthashastra treatises with flash inference...
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </main>

      {/* Floating Input Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E6E6E6] shadow-[0_12px_36px_rgba(30,32,51,0.09)] p-2 sm:p-2.5 transition-all focus-within:border-[#D5650F]/50 focus-within:ring-2 focus-within:ring-[#D5650F]/15">
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
                placeholder="Ask Chanakya anything... (statecraft, negotiation, human nature, Upanishadic discernment)"
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none px-3 py-2 text-sm sm:text-base text-[#1E2033] placeholder-[#8F92A9] focus:outline-none focus:ring-0 max-h-32 leading-normal"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <span>Ask Chanakya</span>
                <span className="text-[#D5650F]">✦</span>
              </button>
            </div>

            <div className="mt-1 px-3 pb-0.5 flex items-center justify-between text-[11px] text-[#8F92A9]">
              <span>Filter: <strong className="text-[#1E2033] uppercase">{filter}</strong> · Enter ↵ to submit</span>
              <span className="hidden sm:inline">Flash response speed &lt;2s</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#585C7B]">Loading Chanakya counsel...</div>}>
      <ChatContent />
    </Suspense>
  )
}
