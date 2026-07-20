// Clerk loader, mirroring the pattern used on llmjob.com: clerk-js is loaded
// on demand from the instance's frontend API domain, memoized, and retried on
// failure. Everything is driven by VITE_CLERK_PUBLISHABLE_KEY.

export interface ClerkUser {
  firstName: string | null
  lastName: string | null
  fullName: string | null
  primaryEmailAddress: { emailAddress: string } | null
}

export interface ClerkClient {
  user: ClerkUser | null
  session: { getToken: () => Promise<string | null> } | null
  load: () => Promise<void>
  openSignIn?: (options?: Record<string, unknown>) => void
  openUserProfile?: (options?: Record<string, unknown>) => void
  redirectToSignIn?: (options?: Record<string, unknown>) => void
  joinWaitlist: (options: { emailAddress: string }) => Promise<unknown>
  signOut: () => Promise<void>
}

declare global {
  interface Window {
    Clerk?: ClerkClient
  }
}

// Publishable keys are public by design (they ship in the page source).
// The env var can override this, e.g. to swap in a pk_live key at build time.
const DEFAULT_PUBLISHABLE_KEY = 'pk_test_Z29vZC1iZWRidWctNDguY2xlcmsuYWNjb3VudHMuZGV2JA'

const PUBLISHABLE_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) || DEFAULT_PUBLISHABLE_KEY

// The frontend API domain is base64-encoded inside the publishable key
// (pk_test_... / pk_live_...), with a trailing "$".
function frontendApiFromKey(key: string): string {
  const encoded = key.replace(/^pk_(test|live)_/, '')
  const padded = encoded + '='.repeat((4 - (encoded.length % 4)) % 4)
  return atob(padded).replace(/\$$/, '')
}

let clerkLoading: Promise<ClerkClient> | null = null

export function getClerk(): Promise<ClerkClient> {
  if (!clerkLoading) {
    clerkLoading = (async () => {
      if (!PUBLISHABLE_KEY) {
        throw new Error('Waitlist is not configured yet (missing VITE_CLERK_PUBLISHABLE_KEY).')
      }
      if (!window.Clerk) {
        const frontendApi = frontendApiFromKey(PUBLISHABLE_KEY)
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.async = true
          script.crossOrigin = 'anonymous'
          script.setAttribute('data-clerk-publishable-key', PUBLISHABLE_KEY)
          script.src = `https://${frontendApi}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Clerk failed to load'))
          document.head.appendChild(script)
        })
      }
      if (!window.Clerk) throw new Error('Clerk failed to load')
      await window.Clerk.load()
      return window.Clerk
    })()
    clerkLoading.catch(() => {
      clerkLoading = null
    })
  }
  return clerkLoading
}

export function clerkErrorMessage(err: unknown): string {
  const e = err as {
    errors?: { longMessage?: string; message?: string }[]
    message?: string
  }
  return (
    e?.errors?.[0]?.longMessage ||
    e?.errors?.[0]?.message ||
    e?.message ||
    'Something went wrong — please try again.'
  )
}
