'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

const STRATEGIC_PROMPTS = [
  {
    icon: '👑',
    category: 'Statecraft & Leadership',
    prompt: 'What are the essential qualities of a leader who commands absolute respect and loyalty?',
  },
  {
    icon: '⚔️',
    category: 'Asymmetric Warfare',
    prompt: 'How can an underdog defeat a competitor who possesses vastly superior resources?',
  },
  {
    icon: '🛡️',
    category: 'The 4 Upayas (Tactics)',
    prompt: 'Explain the strategic application of Sama (conciliation), Dama (concession), Bheda (division), and Danda (force).',
  },
  {
    icon: '⚖️',
    category: 'Discernment & Trust',
    prompt: 'How does the Arthashastra recommend testing the loyalty and hidden motives of associates?',
  },
]

function FormattedContent({ content }: { content: string }) {
  // Simple, safe parser for paragraphs, bold, lists, and quotes
  const lines = content.split('\n')
  
  return (
    <div className="space-y-2 text-slate-200 leading-relaxed text-[15px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <div key={idx} className="h-1" />
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-amber-400/70 pl-3 py-1 my-1 italic text-amber-200/90 bg-amber-500/5 rounded-r"
            >
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          )
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2)
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="text-amber-400 mt-1.5 text-xs">◆</span>
              <span>{renderBold(bulletText)}</span>
            </div>
          )
        }

        // Numbered lists (e.g. 1. or 2.)
        const matchNumber = trimmed.match(/^(\d+)\.\s+(.*)/)
        if (matchNumber) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="text-amber-400 font-semibold text-xs mt-1 w-4 text-right">
                {matchNumber[1]}.
              </span>
              <span>{renderBold(matchNumber[2])}</span>
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
        <strong key={i} className="font-semibold text-amber-200">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
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

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  function clearChat() {
    if (confirm('Start a new counsel session? Current messages will be cleared.')) {
      setMessages([])
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background radial gold aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-900/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[350px] bg-blue-900/10 blur-[140px] rounded-full" />
      </div>

      {/* Regal Navbar */}
      <header className="sticky top-0 z-30 border-b border-amber-500/15 bg-[#0b0f17]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Emblem Seal */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d1424] rounded-[11px] flex items-center justify-center">
                <span className="text-amber-400 font-bold text-base tracking-tight select-none">
                  चा
                </span>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0b0f17] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Chanakya AI
              </h1>
              <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                Arthashastra
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Strategic counsel · Royal advisory wisdom
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            NVIDIA NIM
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500/30 bg-slate-900/40 transition-colors"
              title="Reset conversation"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Stream */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 z-10 pb-32">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen */
          <div className="py-8 sm:py-14 flex flex-col items-center text-center animate-fadeIn">
            {/* Crest Emblem */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-2xl shadow-amber-500/25">
                <div className="w-full h-full bg-[#0d1424] rounded-[15px] flex items-center justify-center">
                  <svg className="w-10 h-10 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -inset-2 bg-amber-500/20 rounded-3xl blur-xl -z-10 animate-pulse-glow" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              Seek the Counsel of Chanakya
            </h2>
            <p className="max-w-lg text-slate-400 text-sm sm:text-base mt-2.5 leading-relaxed">
              &ldquo;Before embarking on an endeavor, ask: <span className="text-amber-200 font-medium">Why am I doing this? What may the results be? Will I succeed?</span> Only with clear insight, proceed.&rdquo;
            </p>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-10 text-left">
              {STRATEGIC_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="group p-4 rounded-xl border border-slate-800/80 hover:border-amber-500/40 bg-slate-900/40 hover:bg-slate-900/90 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 group-hover:text-amber-100 transition-colors leading-snug">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              } animate-fadeIn`}
            >
              {/* Role Header */}
              <div className="flex items-center gap-2 mb-1.5 px-1 text-xs text-slate-400">
                {m.role === 'assistant' ? (
                  <>
                    <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">
                      चा
                    </div>
                    <span className="font-semibold text-amber-300">Chanakya</span>
                    <span className="text-slate-500">· Counselor</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-slate-300">You</span>
                    <span className="text-slate-500">· Seeker</span>
                  </>
                )}
                {m.timestamp && <span className="text-slate-500 text-[11px]">• {m.timestamp}</span>}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative group max-w-[90%] sm:max-w-[85%] rounded-2xl px-5 py-4 shadow-md ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-amber-600/25 to-amber-700/30 border border-amber-500/35 text-slate-100 rounded-tr-sm'
                    : 'bg-[#0f172a]/90 border border-slate-800 text-slate-200 rounded-tl-sm backdrop-blur-sm'
                }`}
              >
                {m.role === 'assistant' ? (
                  <FormattedContent content={m.content} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content}</p>
                )}

                {/* Copy button for assistant responses */}
                {m.role === 'assistant' && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] text-slate-500 font-serif italic">
                      Arthashastra Counsel
                    </span>
                    <button
                      onClick={() => copyToClipboard(m.content, i)}
                      className="hover:text-amber-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800/60"
                      title="Copy counsel"
                    >
                      {copiedIdx === i ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading / Thinking State */}
        {loading && (
          <div className="flex flex-col items-start animate-fadeIn">
            <div className="flex items-center gap-2 mb-1.5 px-1 text-xs text-slate-400">
              <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">
                चा
              </div>
              <span className="font-semibold text-amber-300">Chanakya</span>
              <span className="text-slate-500">is deliberating...</span>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-[#0f172a]/80 border border-amber-500/20 rounded-tl-sm flex items-center gap-3 shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-200" />
              </div>
              <span className="text-sm text-amber-200/80 font-serif italic">
                Formulating strategic counsel from the Arthashastra...
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </main>

      {/* Floating Glassmorphic Input Dock */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <div className="relative rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-black/80 p-2 sm:p-2.5 transition-all focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20">
            <div className="flex items-end gap-2">
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
                placeholder="Ask Chanakya for strategic counsel... (e.g., negotiation, leadership, conflict)"
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none px-3 py-2 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 max-h-36 leading-normal"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-semibold text-sm shadow-md shadow-amber-500/25 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <span>Counsel</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div className="mt-1 px-3 pb-0.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Press <kbd className="font-mono bg-slate-800/80 px-1 py-0.5 rounded text-slate-400">Enter ↵</kbd> to seek counsel · <kbd className="font-mono bg-slate-800/80 px-1 py-0.5 rounded text-slate-400">Shift + Enter</kbd> for newline</span>
              <span className="hidden sm:inline">Chanakya AI v1.1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
