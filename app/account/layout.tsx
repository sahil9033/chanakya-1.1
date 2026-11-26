import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Your Vedhh AI account — profile details and saved consultations.',
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
