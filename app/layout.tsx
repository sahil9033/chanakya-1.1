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
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  )
}
