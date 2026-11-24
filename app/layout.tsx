import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Characha AI — Chanakya',
  description: 'Strategic counsel from Chanakya, powered by NVIDIA NIM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f17] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  )
}
