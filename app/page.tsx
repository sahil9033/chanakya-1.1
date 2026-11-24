'use client'

import { useState, useEffect, useRef } from 'react'

export default function Page() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return

    const userMsg = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server returned ${res.status}`)
      }

      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: 'assistant', content: data.reply },
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: 'assistant', content: 'Error: ' + err.message },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-lg font-bold shadow-md">
          CA
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Characha AI — Chanakya</h1>
          <p className="text-xs text-slate-300">Strategic counsel · Arthashastra wisdom</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-10">
            Ask Chanakya anything. He answers with the wisdom of the Arthashastra.
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'ml-auto max-w-[85%] px-4 py-3 rounded-2xl bg-blue-600 text-white'
                : 'mr-auto max-w-[85%] px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm'
            }
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse">
            Chanakya is thinking...
          </div>
        )}

        <div ref={endRef} />
      </main>

      <footer className="p-4 sm:p-6 border-t bg-white">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Chanakya for counsel..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition-colors"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center">
          Powered by NVIDIA NIM · Free tier on Vercel
        </p>
      </footer>
    </div>
  )
}
