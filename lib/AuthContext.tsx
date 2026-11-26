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
  PhoneAuthProvider,
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut as firebaseSignOut,
  type ApplicationVerifier,
  type ConfirmationResult,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'
import { syncProfile } from './chatStore'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  sendPhoneOtp: (phoneNumber: string, appVerifier: ApplicationVerifier) => Promise<ConfirmationResult | null>
  confirmPhoneOtp: (confirmationResult: ConfirmationResult, code: string) => Promise<boolean>
  createRecaptcha: (containerId: string) => ApplicationVerifier
  clearRecaptcha: (containerId: string) => void
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
    case 'auth/invalid-phone-number':
      return 'That phone number looks invalid. Please check it and try again.'
    case 'auth/missing-phone-number':
      return 'Please enter your phone number.'
    case 'auth/code-expired':
      return 'The code has expired. Please request a new one.'
    case 'auth/invalid-verification-code':
      return 'That code is incorrect. Please try again.'
    case 'auth/invalid-verification-id':
      return 'Something went wrong. Please request a new code.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/operation-not-allowed':
      return 'Phone sign-in is not enabled. Please contact support.'
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

  // ---- Phone (OTP) authentication ----

  // Create an invisible reCAPTCHA verifier bound to a container element.
  const createRecaptcha = useCallback((containerId: string): ApplicationVerifier => {
    // Clear any previous verifier for the same container first.
    // @ts-expect-error firebase attaches the verifier instance to the window
    if (window.recaptchaVerifier) {
      try {
        // @ts-expect-error dynamic
        window.recaptchaVerifier.clear()
      } catch {
        /* ignore */
      }
    }
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        /* reCAPTCHA solved — sign-in continues automatically */
      },
    })
    // @ts-expect-error store on window for cleanup
    window.recaptchaVerifier = verifier
    return verifier
  }, [])

  const clearRecaptcha = useCallback((_containerId: string) => {
    // @ts-expect-error firebase attaches the verifier instance to the window
    if (window.recaptchaVerifier) {
      try {
        // @ts-expect-error dynamic
        window.recaptchaVerifier.clear()
      } catch {
        /* ignore */
      }
      // @ts-expect-error dynamic
      window.recaptchaVerifier = null
    }
  }, [])

  const sendPhoneOtp = useCallback(
    async (
      phoneNumber: string,
      appVerifier: ApplicationVerifier
    ): Promise<ConfirmationResult | null> => {
      setError(null)
      try {
        return await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      } catch (err) {
        setError(toMessage(err))
        return null
      }
    },
    []
  )

  const confirmPhoneOtp = useCallback(
    async (confirmationResult: ConfirmationResult, code: string): Promise<boolean> => {
      setError(null)
      try {
        await confirmationResult.confirm(code)
        return true
      } catch (err) {
        setError(toMessage(err))
        return false
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    setError(null)
    try {
      await firebaseSignOut(auth)
    } catch (err) {
      setError(toMessage(err))
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      sendPhoneOtp,
      confirmPhoneOtp,
      createRecaptcha,
      clearRecaptcha,
      signOut,
    }),
    [
      user,
      loading,
      error,
      signInWithGoogle,
      sendPhoneOtp,
      confirmPhoneOtp,
      createRecaptcha,
      clearRecaptcha,
      signOut,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
