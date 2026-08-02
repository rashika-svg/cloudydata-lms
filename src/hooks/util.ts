/* ============================================================
   Non-motion utility hooks.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from 'react'

/* ----------------------------------------------------------
   usePersistentState — useState that survives a reload.

   This is the whole "backend" of the app: a static site with no
   server, so enrolments and lesson progress live in localStorage.
   Reads are lazy and guarded, because a user in private mode or with
   storage disabled should get a working site, not a white screen.
   ---------------------------------------------------------- */

export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* quota or disabled storage — the session still works in memory */
    }
  }, [key, state])

  // Keep duplicate tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return
      try {
        setState(JSON.parse(e.newValue) as T)
      } catch {
        /* ignore malformed payloads from another tab */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [state, setState] as const
}

/* ----------------------------------------------------------
   useHotkey — global keyboard shortcut.
   ---------------------------------------------------------- */

interface HotkeyOptions {
  /** Require Ctrl (Windows/Linux) or Cmd (macOS). */
  meta?: boolean
  /** Fire even when focus is inside an input. Default false. */
  allowInInput?: boolean
}

export function useHotkey(
  key: string,
  handler: (e: KeyboardEvent) => void,
  { meta = false, allowInInput = false }: HotkeyOptions = {},
) {
  const saved = useRef(handler)
  useEffect(() => {
    saved.current = handler
  }, [handler])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      if (meta && !(e.metaKey || e.ctrlKey)) return
      if (!meta && (e.metaKey || e.ctrlKey || e.altKey)) return

      if (!allowInInput) {
        const t = e.target as HTMLElement | null
        const tag = t?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return
      }

      saved.current(e)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, meta, allowInInput])
}

/* ----------------------------------------------------------
   useLockBodyScroll — freeze the page behind an overlay.

   Compensates for the scrollbar width so locking does not shift the
   layout sideways, which is the tell of a cheap modal.
   ---------------------------------------------------------- */

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    const barWidth = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (barWidth > 0) body.style.paddingRight = `${barWidth}px`

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
    }
  }, [locked])
}

/* ----------------------------------------------------------
   useFocusTrap — keep Tab inside an open overlay, and restore focus
   to whatever opened it on close.
   ---------------------------------------------------------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (!container) return

    restoreTo.current = document.activeElement as HTMLElement | null

    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
    focusables()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return

      const first = items[0]!
      const last = items[items.length - 1]!
      const current = document.activeElement

      if (e.shiftKey && current === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && current === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      restoreTo.current?.focus()
    }
  }, [active])

  return ref
}

/* ----------------------------------------------------------
   useMediaQuery
   ---------------------------------------------------------- */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/* ----------------------------------------------------------
   useDebounced — trailing-edge debounce for a value.
   ---------------------------------------------------------- */

export function useDebounced<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])

  return debounced
}

/* ----------------------------------------------------------
   useEventCallback — a stable identity around a changing function.
   Lets effects depend on a callback without re-subscribing.
   ---------------------------------------------------------- */

export function useEventCallback<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: A) => ref.current(...args), [])
}
