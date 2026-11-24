'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

const STRATEGIC_PROMPTS = [
  {
    tag: 'Leadership',
    icon: '👑',
    title: 'The Unshakeable Leader',
    prompt: 'What are the essential qualities of a leader who commands absolute respect and loyalty in times of crisis?',
  },
  {
    tag: 'Tactics',
    icon: '⚔️',
    title: 'Asymmetric Advantage',
    prompt: 'How can an underdog defeat or outmaneuver an adversary who commands vastly superior resources?',
  },
  {
    tag: 'Diplomacy',
    icon: '🛡️',
    title: 'The Four Upayas',
    prompt: 'Explain how to apply the 4 Upayas (Sama, Dama, Bheda, and Danda) in modern high-stakes negotiations.',
  },
  {
    tag: 'Statecraft',
    icon: '⚖️',
    title: 'Testing Motives',
    prompt: 'How does the Arthashastra recommend discerning the true motives and testing loyalty of close associates?',
  },
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

        // Blockquotes
        if (trimmed.startsWith('>')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-[#D5650F] pl-3.5 py-2 my-2 italic text-[#585C7B] bg-[#FFF8F3] rounded-r-lg"
            >
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          )
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2)
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-1">
              <span className="text-[#D5650F] mt-1.5 text-[10px]">✦</span>
              <span className="text-[#2C3048]">{renderBold(bulletText)}</span>
            </div>
          )
        }

        // Numbered lists
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
    if (confirm('Start a new session? Current conversation will be cleared.')) {
      setMessages([])
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E2033] relative">
      {/* Top Ambient Mesh Gradient (Sarvam Signature) */}
      <div className="sarvam-hero-mesh fixed inset-0 pointer-events-none z-0" />

      {/* Top Announcement Bar */}
      <div className="relative z-30 bg-[#F7F7F8] border-b border-[#E6E6E6] px-4 py-2 text-center text-xs text-[#585C7B] flex items-center justify-center gap-2">
        <span className="text-[#D5650F] text-[11px]">✦</span>
        <span>
          Grounded in the <strong className="font-medium text-[#1E2033]">Arthashastra</strong> · Powered by frontier NVIDIA NIM reasoning models
        </span>
        <span className="text-[#D5650F] text-[11px]">✦</span>
      </div>

      {/* Sarvam-style Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E6E6E6] bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Brand Wordmark & Terracotta Dot */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setMessages([])}>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E2033]">
              chanakya
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D5650F] inline-block -mt-1.5" />
            <span className="ml-2 hidden sm:inline-block text-[11px] font-medium tracking-wide text-[#585C7B] uppercase bg-[#F0F1F5] px-2.5 py-0.5 rounded-full border border-[rgba(30,32,51,0.06)]">
              AI 1.1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F1F5] text-xs text-[#585C7B] font-medium border border-[rgba(30,32,51,0.06)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            NVIDIA NIM Live
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-full bg-white hover:bg-[#F7F7F8] text-[#1E2033] border border-[#E6E6E6] px-3.5 py-1.5 text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-[#585C7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>New Session</span>
            </button>
          )}

          <a
            href="https://build.nvidia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-4 py-1.5 text-xs font-medium shadow-sm transition-all flex items-center gap-1"
          >
            <span>Platform</span>
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 z-10 pb-36">
        {messages.length === 0 ? (
          /* Sarvam AI Style Hero Section */
          <div className="py-8 sm:py-14 flex flex-col items-center text-center animate-fadeIn">
            {/* Cultural Archway Flourish SVG */}
            <div className="mb-4 text-[#D5650F] opacity-90">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0C24 6.627 18.627 12 12 12C18.627 12 24 17.373 24 24C24 17.373 29.373 12 36 12C29.373 12 24 6.627 24 0Z" fill="currentColor" fillOpacity="0.85"/>
                <circle cx="2" cy="12" r="2" fill="currentColor"/>
                <circle cx="46" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>

            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F1F5] border border-[rgba(30,32,51,0.08)] text-xs font-medium text-[#1E2033] mb-4 shadow-sm">
              <span className="text-[#D5650F]">✦</span>
              <span>Ancient Strategic Intelligence · Arthashastra</span>
            </div>

            {/* Editorial Headline (Sarvam style) */}
            <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#1E2033] max-w-2xl leading-[1.15]">
              Strategic counsel for leaders from India
            </h1>

            {/* Sub-tagline */}
            <p className="max-w-xl text-[#585C7B] text-base sm:text-lg mt-3.5 leading-relaxed font-normal">
              Grounded in political realism, diplomacy, and timeless statecraft. Formulate your strategy with Chanakya.
            </p>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => handleSend(STRATEGIC_PROMPTS[0].prompt)}
                className="rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all"
              >
                Seek Leadership Counsel
              </button>
              <button
                onClick={() => handleSend(STRATEGIC_PROMPTS[2].prompt)}
                className="rounded-full bg-white hover:bg-[#F7F7F8] text-[#1E2033] border border-[#E6E6E6] px-5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all"
              >
                Explore 4 Upayas (Tactics)
              </button>
            </div>

            {/* Bento Grid - 4 Strategic Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-12 text-left">
              {STRATEGIC_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="group p-5 rounded-2xl border border-[#E6E6E6] bg-white hover:border-[#D5650F]/50 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between shadow-[0_2px_8px_rgba(30,32,51,0.03)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[#F7F7F8] text-[#585C7B] group-hover:text-[#D5650F] group-hover:bg-[#FFF8F3] transition-colors border border-[rgba(30,32,51,0.06)]">
                        {item.tag}
                      </span>
                      <span className="text-base">{item.icon}</span>
                    </div>
                    <h3 className="font-serif text-base font-medium text-[#1E2033] group-hover:text-[#D5650F] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#585C7B] mt-1.5 leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#D5650F] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Ask Chanakya</span>
                    <span>→</span>
                  </div>
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
              {/* Header Label */}
              <div className="flex items-center gap-2 mb-1.5 px-2 text-xs text-[#585C7B]">
                {m.role === 'assistant' ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-[#D5650F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      चा
                    </div>
                    <span className="font-semibold text-[#1E2033]">Chanakya</span>
                    <span className="text-[#8F92A9]">· Royal Counselor</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-[#585C7B]">You</span>
                    <span className="text-[#8F92A9]">· Inquirer</span>
                  </>
                )}
                {m.timestamp && <span className="text-[#A6A8BC] text-[11px]">· {m.timestamp}</span>}
              </div>

              {/* Message Bubble */}
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

                {/* Footer copy action for assistant replies */}
                {m.role === 'assistant' && (
                  <div className="mt-4 pt-2.5 border-t border-[#F0F1F5] flex items-center justify-between text-xs text-[#8F92A9]">
                    <span className="text-[11px] text-[#A6A8BC]">
                      Arthashastra Intelligence
                    </span>
                    <button
                      onClick={() => copyToClipboard(m.content, i)}
                      className="hover:text-[#1E2033] flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-full bg-[#F7F7F8] hover:bg-[#F0F1F5] border border-[rgba(30,32,51,0.06)]"
                      title="Copy response"
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
                          <span className="text-[#585C7B]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Thinking Deliberation State */}
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
                Deliberating ancient principles from the Arthashastra...
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </main>

      {/* Sarvam Floating Pill Input Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E6E6E6] shadow-[0_12px_36px_rgba(30,32,51,0.09)] p-2 sm:p-2.5 transition-all focus-within:border-[#D5650F]/50 focus-within:ring-2 focus-within:ring-[#D5650F]/15">
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
                placeholder="Ask Chanakya for counsel... (e.g., negotiation, conflict, leadership)"
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none px-3 py-2 text-sm sm:text-base text-[#1E2033] placeholder-[#8F92A9] focus:outline-none focus:ring-0 max-h-32 leading-normal"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <span>Seek Counsel</span>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div className="mt-1 px-3 pb-0.5 flex items-center justify-between text-[11px] text-[#8F92A9]">
              <span>Press <kbd className="font-mono bg-[#F0F1F5] text-[#585C7B] px-1 py-0.5 rounded text-[10px]">Enter ↵</kbd> to ask · <kbd className="font-mono bg-[#F0F1F5] text-[#585C7B] px-1 py-0.5 rounded text-[10px]">Shift + Enter</kbd> for line</span>
              <span className="hidden sm:inline">Built on sovereign intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
