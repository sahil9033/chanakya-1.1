'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Overview', href: '/' },
    { name: 'Ask Chanakya', href: '/chat' },
    { name: 'The Codex', href: '/codex' },
    { name: 'Philosophy', href: '/philosophy' },
  ]

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#F7F7F8] border-b border-[#E6E6E6] px-4 py-2 text-center text-xs text-[#585C7B] flex items-center justify-center gap-2">
        <span className="text-[#D5650F] text-[11px]">✦</span>
        <span>
          Rooted in the <strong className="font-medium text-[#1E2033]">Arthashastra & Upanishads</strong> · Flash latency powered by NVIDIA NIM
        </span>
        <span className="text-[#D5650F] text-[11px]">✦</span>
      </div>

      {/* Sticky Main Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E6E6E6] bg-white/85 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark with Terracotta Dot */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E2033] group-hover:text-[#D5650F] transition-colors">
              chanakya
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D5650F] inline-block -mt-1.5" />
            <span className="ml-2 hidden sm:inline-block text-[11px] font-medium tracking-wide text-[#585C7B] uppercase bg-[#F0F1F5] px-2.5 py-0.5 rounded-full border border-[rgba(30,32,51,0.06)]">
              Sovereign AI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F0F1F5]/80 p-1 rounded-full border border-[rgba(30,32,51,0.06)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#1E2033] shadow-xs border border-[rgba(30,32,51,0.08)]'
                      : 'text-[#585C7B] hover:text-[#1E2033] hover:bg-white/50'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F1F5] text-[11px] text-[#585C7B] font-medium border border-[rgba(30,32,51,0.06)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Flash Latency
            </div>

            <Link
              href="/chat"
              className="rounded-full bg-[#1E2033] hover:bg-[#2A2E47] text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Ask Chanakya</span>
              <span className="text-[#D5650F]">✦</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
