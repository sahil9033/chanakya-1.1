'use client'

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { ConfirmationResult } from 'firebase/auth'
import { useAuth } from '../../lib/AuthContext'
import { Chakra, IconGoogle, IconLock, IconPhone } from './Icons'

const RECAPTCHA_ID = 'vedhh-recaptcha'

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
 * Otherwise shows the branded sign-in chamber (Google or phone OTP).
 */
export default function SignInGate({ children }: { children: ReactNode }) {
  const {
    user,
    loading,
    error,
    signInWithGoogle,
    sendPhoneOtp,
    confirmPhoneOtp,
    createRecaptcha,
    clearRecaptcha,
  } = useAuth()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [busy, setBusy] = useState(false)

  // Tear down the reCAPTCHA verifier when the chamber unmounts.
  useEffect(() => () => clearRecaptcha(RECAPTCHA_ID), [clearRecaptcha])

  if (loading) return <AuthLoading />
  if (user) return <>{children}</>

  // Normalise to E.164. Default to India (+91) when no country code is given.
  function normalise(raw: string): string {
    const trimmed = raw.replace(/[^\d+]/g, '')
    if (trimmed.startsWith('+')) return trimmed
    if (trimmed.startsWith('0')) return `+91${trimmed.slice(1)}`
    return `+91${trimmed}`
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    if (busy || phone.trim().length < 6) return
    setBusy(true)
    const verifier = createRecaptcha(RECAPTCHA_ID)
    const result = await sendPhoneOtp(normalise(phone), verifier)
    setBusy(false)
    if (result) {
      setConfirmation(result)
      setStep('otp')
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    if (busy || !confirmation || code.trim().length < 4) return
    setBusy(true)
    await confirmPhoneOtp(confirmation, code.trim())
    setBusy(false)
    // On success, onAuthStateChanged flips `user` and children render.
  }

  function handleBack() {
    clearRecaptcha(RECAPTCHA_ID)
    setStep('phone')
    setCode('')
    setConfirmation(null)
  }

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
            {step === 'phone'
              ? 'Sign in to consult Acharya Chanakya. Every enquiry is private and bound to your account.'
              : `We sent a one-time code to ${phone.trim()}. Enter it below to continue.`}
          </p>

          {step === 'phone' ? (
            <>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-ink-line bg-canvas px-5 py-3.5 text-sm font-medium text-ink shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lift"
              >
                <IconGoogle width={19} height={19} />
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                <span className="h-px flex-1 bg-ink-line" />
                or
                <span className="h-px flex-1 bg-ink-line" />
              </div>

              <form onSubmit={handleSend} className="flex flex-col gap-3">
                <label className="flex items-center gap-3 rounded-full border border-ink-line bg-canvas px-5 py-3.5 text-left transition-colors focus-within:border-accent">
                  <IconPhone width={18} height={18} className="shrink-0 text-ink-faint" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    aria-label="Phone number"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy || phone.trim().length < 6}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-canvas transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-50"
                >
                  {busy ? 'Sending code…' : 'Send one-time code'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-3">
              <label className="flex items-center gap-3 rounded-full border border-ink-line bg-canvas px-5 py-3.5 text-left transition-colors focus-within:border-accent">
                <IconLock width={18} height={18} className="shrink-0 text-ink-faint" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  aria-label="One-time code"
                  className="w-full bg-transparent text-sm tracking-[0.3em] text-ink outline-none placeholder:tracking-normal placeholder:text-ink-faint"
                />
              </label>
              <button
                type="submit"
                disabled={busy || code.trim().length < 4}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-canvas transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-50"
              >
                {busy ? 'Verifying…' : 'Verify & enter'}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="mt-1 text-xs text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Use a different number
              </button>
            </form>
          )}

          {error && <p className="mt-4 text-xs leading-relaxed text-accent-deep">{error}</p>}

          <p className="mt-6 text-[11px] leading-relaxed text-ink-faint">
            Chanakya&apos;s counsel is advisory in nature and governed by Dharma.
          </p>
        </div>
      </div>

      {/* Invisible reCAPTCHA anchor — must stay mounted while phone auth is active */}
      <div id={RECAPTCHA_ID} />
    </div>
  )
}
