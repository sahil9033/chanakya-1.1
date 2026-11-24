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
    <html lang="en">
      <body className="bg-white text-[#1E2033] antialiased selection:bg-[#FF7A30]/20 selection:text-[#1E2033]">
        {children}
      </body>
    </html>
  )
}
