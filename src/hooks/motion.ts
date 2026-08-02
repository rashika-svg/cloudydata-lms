/* ============================================================
   Motion hooks.

   The motion vocabulary here is typographic, not physical: rules
   draw, type is unmasked line by line, figures count, blocks wipe.
   There is deliberately no magnetic pull, no 3D tilt and no ripple —
   those are ornament attached to an element, and they read as
   generated rather than designed.

   House rules:
     1. Transforms, opacity and clip-path only. No layout properties.
     2. Pointer/scroll work is rAF-coalesced — one write per frame.
     3. prefers-reduced-motion degrades to a static, usable state.
     4. Passive listeners wherever nothing is prevented.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/* ----------------------------------------------------------
   useInView — one-shot intersection observer.
   Drives every entrance in the app.
   ---------------------------------------------------------- */

interface InViewOptions {
  once?: boolean
  rootMargin?: string
  threshold?: number
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  once = true,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.12,
}: InViewOptions = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No observer (old browser, test env): show the content.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )

    io.observe(el)

    // Failsafe. An entrance animation must never be the reason content
    // is unreadable: if the observer has not reported within a second —
    // zero-size target, an odd scroll container, a browser quirk — show
    // the content anyway. Costs one timer per element and is invisible
    // in the normal case, because the observer fires long before it.
    const failsafe = window.setTimeout(() => setInView(true), 1000)

    return () => {
      window.clearTimeout(failsafe)
      io.disconnect()
    }
  }, [once, rootMargin, threshold])

  return { ref, inView }
}

/* ----------------------------------------------------------
   useCountUp — figures count once they scroll into view.
   ---------------------------------------------------------- */

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function useCountUp(target: number, duration = 1400) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(target)
      return
    }

    let raf = 0
    let start: number | null = null

    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(easeOutExpo(t) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, reduced])

  return { ref, value }
}

/* ----------------------------------------------------------
   useScrollProgress — 0..1 through the document.
   Drives the reading bar under the header.
   ---------------------------------------------------------- */

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const read = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      setProgress(scrollable > 0 ? Math.min(1, doc.scrollTop / scrollable) : 0)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}

/* ----------------------------------------------------------
   useCopy — clipboard write with a self-clearing "copied" flag.
   ---------------------------------------------------------- */

export function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      } catch {
        // Clipboard blocked (insecure context, denied permission) —
        // stay silent rather than throwing at the user.
        setCopied(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), resetAfter)
    return () => window.clearTimeout(t)
  }, [copied, resetAfter])

  return { copied, copy }
}

/* ----------------------------------------------------------
   useScrolled — has the page moved past `offset`?
   ---------------------------------------------------------- */

export function useScrolled(offset = 24): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > offset))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [offset])

  return scrolled
}

/* ----------------------------------------------------------
   useMagnetic — the element leans toward an approaching cursor,
   then springs back on exit.

   The pull is deliberately sub-linear and clamped, so a button never
   detaches from where the user actually aimed. Writes a custom
   property; CSS decides what to do with it.
   ---------------------------------------------------------- */

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 0.3, max = 10) {
  const ref = useRef<T | null>(null)
  const frame = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    // Coarse pointers have no hover state — a magnet just fights the tap.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const clamp = (v: number) => Math.max(-max, Math.min(max, v))

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        el.style.setProperty('--mag-x', `${clamp(dx * strength).toFixed(2)}px`)
        el.style.setProperty('--mag-y', `${clamp(dy * strength).toFixed(2)}px`)
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame.current)
      el.style.setProperty('--mag-x', '0px')
      el.style.setProperty('--mag-y', '0px')
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', reset, { passive: true })
    // A tap on a hybrid device must not leave it stuck off-centre.
    el.addEventListener('pointerup', reset, { passive: true })

    return () => {
      cancelAnimationFrame(frame.current)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      el.removeEventListener('pointerup', reset)
    }
  }, [strength, max, reduced])

  return ref
}

/* ----------------------------------------------------------
   useTilt — 3D card tilt plus a cursor-tracked sheen.

   Writes four custom properties and lets CSS choose what to use, so
   a card can opt into the tilt, the sheen, or both. Under reduced
   motion the sheen still tracks — it is a static gradient position,
   not movement — but the rotation is suppressed.
   ---------------------------------------------------------- */

export function useTilt<T extends HTMLElement = HTMLDivElement>(maxDeg = 6) {
  const ref = useRef<T | null>(null)
  const frame = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height

        el.style.setProperty('--px', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--py', `${(py * 100).toFixed(1)}%`)

        if (reduced) return
        // Y inverted so the card tips *away* from the cursor — the
        // direction that reads as "being pushed".
        el.style.setProperty('--tilt-x', `${((0.5 - py) * maxDeg * 2).toFixed(2)}deg`)
        el.style.setProperty('--tilt-y', `${((px - 0.5) * maxDeg * 2).toFixed(2)}deg`)
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame.current)
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
      el.style.setProperty('--px', '50%')
      el.style.setProperty('--py', '50%')
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', reset, { passive: true })

    return () => {
      cancelAnimationFrame(frame.current)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
    }
  }, [maxDeg, reduced])

  return ref
}

/* ----------------------------------------------------------
   useRipple — pointer-origin ripple.

   Returns a pointerdown handler plus the live ripple list. Ripples
   self-expire on animationend, so nothing accumulates in state.
   ---------------------------------------------------------- */

export interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)
  const reduced = useReducedMotion()

  const spawn = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced) return
      const r = e.currentTarget.getBoundingClientRect()
      // Cover the furthest corner from the origin.
      const size = Math.max(r.width, r.height) * 2
      setRipples((prev) => [
        ...prev,
        { id: nextId.current++, x: e.clientX - r.left, y: e.clientY - r.top, size },
      ])
    },
    [reduced],
  )

  const clear = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { ripples, spawn, clear }
}

/* ----------------------------------------------------------
   useAnimatedHeight — measured expand/collapse.

   `height: auto` is not animatable, so this measures the content and
   drives an explicit pixel height, then releases to `auto` once open
   so nested content can still reflow.
   ---------------------------------------------------------- */

export function useAnimatedHeight(open: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | 'auto'>(open ? 'auto' : 0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      setHeight(open ? 'auto' : 0)
      return
    }

    if (open) {
      setHeight(el.scrollHeight)
      const t = window.setTimeout(() => setHeight('auto'), 320)
      return () => window.clearTimeout(t)
    }

    // Collapsing: pin the measured height for a frame so the browser
    // has something to transition *from*, then drop to zero.
    setHeight(el.scrollHeight)
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)))
    return () => cancelAnimationFrame(raf)
  }, [open, reduced])

  return { ref, height }
}
