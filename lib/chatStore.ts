// Private, per-user chat history + profile backed by Firebase Realtime Database.
//
// Data layout:
//   users/{uid}/profile            -> { displayName, email, photoURL, createdAt, lastSeen }
//   users/{uid}/sessions/{id}      -> { id, title, filter, model, updatedAt, messages: [...] }
//
// Everything is scoped to the signed-in user's uid, and the database security
// rules (database.rules.json) only grant each user access to their own branch.
import { get, onValue, ref, remove, set, update } from 'firebase/database'
import type { User } from 'firebase/auth'
import { db } from './firebase'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  latency?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  filter: string
  model: string
  updatedAt: number
}

export interface UserProfile {
  displayName: string | null
  email: string | null
  photoURL: string | null
  createdAt: number
  lastSeen: number
}

// RTDB rejects `undefined` values, so strip anything optional that is missing.
function cleanMessages(messages: Message[]): Message[] {
  return messages.map((m) => {
    const out: Message = { role: m.role, content: m.content }
    if (m.timestamp) out.timestamp = m.timestamp
    if (m.latency) out.latency = m.latency
    return out
  })
}

const sessionsRef = (uid: string) => ref(db, `users/${uid}/sessions`)
const sessionRef = (uid: string, id: string) => ref(db, `users/${uid}/sessions/${id}`)
const profileRef = (uid: string) => ref(db, `users/${uid}/profile`)

/** Live subscription to a user's saved consultations, newest first. */
export function subscribeSessions(
  uid: string,
  onData: (sessions: ChatSession[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onValue(
    sessionsRef(uid),
    (snapshot) => {
      const value = snapshot.val() as Record<string, ChatSession> | null
      const list = value ? Object.values(value) : []
      list.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
      onData(list)
    },
    (error) => onError?.(error)
  )
}

/** Persist a single consultation (creates or overwrites it). */
export async function saveSession(uid: string, session: ChatSession): Promise<void> {
  if (!uid || !session?.id) return
  await set(sessionRef(uid, session.id), {
    id: session.id,
    title: session.title || 'Consultation',
    filter: session.filter || 'all',
    model: session.model || 'bolt',
    updatedAt: session.updatedAt || Date.now(),
    messages: cleanMessages(session.messages ?? []),
  })
}

/** Delete one consultation. */
export async function deleteSession(uid: string, id: string): Promise<void> {
  await remove(sessionRef(uid, id))
}

/** Write the signed-in user's profile once, and refresh `lastSeen` thereafter. */
export async function syncProfile(user: User): Promise<void> {
  const profile = profileRef(user.uid)
  const snapshot = await get(profile)
  const createdAt = Date.parse(user.metadata?.creationTime ?? '') || Date.now()
  const base: UserProfile = {
    displayName: user.displayName ?? null,
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
    createdAt,
    lastSeen: Date.now(),
  }
  if (snapshot.exists()) {
    await update(profile, { ...base, createdAt: (snapshot.val() as UserProfile).createdAt ?? createdAt })
  } else {
    await set(profile, base)
  }
}
