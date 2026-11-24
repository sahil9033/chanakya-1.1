'use client'

import type { ReactNode } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { Chakra, IconGoogle, IconLock } from './Icons'

function AuthLoading() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="flex flex-col items-center gap-4 text-ink-faint">
        <span className="animate-float-slow text-ink">
          <Chakra width={26} height={26} />
        </span>
        <span className="text-sm">Summoning the council…</span>
      </div>
    </div>
  )
}

/**
 * Renders `children` only for signed-in strategists.
 * Otherwise shows the branded sign-in chamber.
 */
export default function SignInGate({ children }: { children: ReactNode }) {
  const { user, loading, error, signInWithGoogle } = useAuth()

  if (loading) return <AuthLoading />
  if (user) return <>{children}</>

  return (
    <div className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <div className="mesh" aria-hidden="true">
        <span className="mesh-layer mesh-a" />
        <span className="mesh-layer mesh-b" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="spot rounded-3xl border border-ink-line bg-canvas/80 p-8 text-center shadow-soft backdrop-blur-xl sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-cream px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            <IconLock width={13} height={13} className="text-accent" />
            Restricted · The inner council
          </span>

          <h1 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            Enter the council chamber
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink-soft">
            Sign in to consult Acharya Chanakya. Every enquiry is private and
            bound to your account.
          </p>

          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-ink-line bg-canvas px-5 py-3.5 text-sm font-medium text-ink shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lift"
          >
            <IconGoogle width={19} height={19} />
            Continue with Google
          </button>

          {error && <p className="mt-4 text-xs leading-relaxed text-accent-deep">{error}</p>}

          <p className="mt-6 text-[11px] leading-relaxed text-ink-faint">
            Chanakya&apos;s counsel is advisory in nature and governed by Dharma.
          </p>
        </div>
      </div>
    </div>
  )
}
