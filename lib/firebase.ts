// Firebase client SDK initialization.
// The web config values are public by design (they ship to the browser),
// so they are safe to keep in source. Import `auth` anywhere on the client.
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyAIn2dqETJuCDj-5-0kgEB6ryJsSAHmWec',
  authDomain: 'charcha-25e02.firebaseapp.com',
  databaseURL: 'https://charcha-25e02-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'charcha-25e02',
  storageBucket: 'charcha-25e02.firebasestorage.app',
  messagingSenderId: '305212453177',
  appId: '1:305212453177:web:9c39b50b74c7815f2378e8',
  measurementId: 'G-EMTLNGG4WT',
}

// Reuse the existing app across Fast Refresh / repeated imports.
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth: Auth = getAuth(app)

let analyticsPromise: Promise<Analytics | null> | null = null

// Analytics only exists in the browser and only where supported.
// Lazy + cached so it never runs during SSR/prerender.
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((ok) => (ok ? getAnalytics(app) : null))
      .catch(() => null)
  }
  return analyticsPromise
}

export default app
