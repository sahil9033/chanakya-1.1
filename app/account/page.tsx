'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import SignInGate from '../components/SignInGate'
import { useAuth } from '../../lib/AuthContext'
import { subscribeSessions, deleteSession, type ChatSession } from '../../lib/chatStore'
import {
  Chakra,
  IconArrowUpRight,
  IconMessageSquare,
  IconSignOut,
  IconSpark,
  IconTarget,
  IconTrash,
} from '../components/Icons'

function formatDate(value?: string | number) {
  if (!value) return '—'
  const d = typeof value === 'number' ? new Date(value) : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function providerLabel(providerId?: string) {
  if (!providerId) return 'Account'
  if (providerId === 'google.com') return 'Google'
  return providerId.replace('.com', '')
}

function AccountContent() {
  const { user, signOut } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const uid = user?.uid ?? ''

  useEffect(() => {
    if (!uid) return
    return subscribeSessions(uid, setSessions)
  }, [uid])

  const totalMessages = sessions.reduce((n, s) => n + (s.messages?.length ?? 0), 0)
  const totalQuestions = sessions.reduce(
    (n, s) => n + (s.messages?.filter((m) => m.role === 'user').length ?? 0),
    0
  )

  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? 'S').toUpperCase()
  const provider = providerLabel(user?.providerData?.[0]?.providerId)

  const stats = [
    { label: 'Consultations', value: sessions.length, icon: <IconMessageSquare width={16} height={16} /> },
    { label: 'Questions asked', value: totalQuestions, icon: <IconTarget width={16} height={16} /> },
    { label: 'Messages', value: totalMessages, icon: <IconSpark width={16} height={16} /> },
  ]

  async function handleDelete(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (uid) deleteSession(uid, id).catch(() => {})
  }

  return (
    <div className="relative isolate mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mesh" aria-hidden="true">
        <span className="mesh-layer mesh-a" />
      </div>

      {/* Header */}
      <div className="relative animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-cream px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          <Chakra width={13} height={13} className="text-accent" />
          Your account
        </span>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink-line bg-ink text-2xl font-medium text-canvas">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" width={64} height={64} className="h-16 w-16 object-cover" />
            ) : (
              initial
            )}
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              {user?.displayName ?? 'Strategist'}
            </h1>
            <p className="mt-1 truncate text-sm text-ink-soft">{user?.email ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-ink-line bg-canvas p-5 shadow-xs transition-colors hover:border-accent/40"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cream text-accent-deep">
              {s.icon}
            </span>
            <div className="mt-3 font-serif text-3xl tracking-tight text-ink">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.1em] text-ink-faint">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Details + History */}
      <div className="relative mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Profile details */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-ink-line bg-canvas p-5 shadow-xs">
            <h2 className="font-serif text-xl tracking-tight text-ink">Profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-faint">Name</dt>
                <dd className="truncate text-right text-ink">{user?.displayName ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-faint">Email</dt>
                <dd className="truncate text-right text-ink">{user?.email ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-faint">Signed in with</dt>
                <dd className="text-right text-ink">{provider}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-faint">Member since</dt>
                <dd className="text-right text-ink">{formatDate(user?.metadata?.creationTime)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-faint">Last sign-in</dt>
                <dd className="text-right text-ink">{formatDate(user?.metadata?.lastSignInTime)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => signOut()}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink-line bg-canvas px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink"
            >
              <IconSignOut width={15} height={15} />
              Sign out
            </button>
          </div>
        </div>

        {/* Saved consultations */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-ink-line bg-canvas p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl tracking-tight text-ink">Saved consultations</h2>
              <span className="rounded-full border border-ink-line bg-cream px-2.5 py-0.5 text-[11px] text-ink-soft">
                {sessions.length}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {sessions.length === 0 ? (
                <p className="py-6 text-center text-sm italic text-ink-faint">
                  No consultations yet.{' '}
                  <Link href="/chat" className="not-italic text-accent-deep underline-offset-2 hover:underline">
                    Ask your first question.
                  </Link>
                </p>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-ink-line/60 bg-cream/40 px-3.5 py-3 transition-colors hover:border-accent/40 hover:bg-cream/70"
                  >
                    <Link href={`/chat?session=${s.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-faint">
                        <IconMessageSquare width={14} height={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">{s.title}</span>
                        <span className="block text-[11px] text-ink-faint">
                          {s.messages?.length ?? 0} messages · {formatDate(s.updatedAt)}
                        </span>
                      </span>
                    </Link>
                    <div className="flex shrink-0 items-center gap-1">
                      <Link
                        href={`/chat?session=${s.id}`}
                        aria-label={`Open consultation: ${s.title}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:text-ink"
                      >
                        <IconArrowUpRight width={15} height={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        aria-label={`Delete consultation: ${s.title}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:text-accent-deep"
                      >
                        <IconTrash width={14} height={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="relative flex flex-1 flex-col bg-canvas text-ink">
      <SignInGate>
        <AccountContent />
      </SignInGate>
      <Footer />
    </div>
  )
}
