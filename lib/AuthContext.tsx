'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'
import { syncProfile } from './chatStore'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Turn raw Firebase error codes into calm, on-brand copy.
function toMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Return when you are ready.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in window. Allow pop-ups and retry.'
    case 'auth/network-request-failed':
      return 'Network unreachable. Check your connection and try again.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorised in Firebase Authentication settings.'
    default:
      return err instanceof Error ? err.message : 'Sign-in failed. Please try again.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser)
        setLoading(false)
        // Mirror basic account info into the Realtime Database (best effort).
        if (nextUser) syncProfile(nextUser).catch(() => {})
      },
      (err) => {
        setError(toMessage(err))
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(toMessage(err))
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    try {
      await firebaseSignOut(auth)
    } catch (err) {
      setError(toMessage(err))
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, signInWithGoogle, signOut }),
    [user, loading, error, signInWithGoogle, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
