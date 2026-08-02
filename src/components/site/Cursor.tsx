/* ============================================================
   Custom cursor.

   Two parts, and the gap between them is the whole effect:

     dot   pinned exactly to the pointer, written every event with
           zero smoothing — any lag here reads as input latency
     ring  trails behind with exponential smoothing, so the pointer
           appears to have weight

   State is driven by what is under the pointer, via one delegated
   listener rather than per-element handlers, so it keeps working for
   anything mounted later:

     link/button  ring expands and takes the accent
     card         ring expands further and fills faintly
     text field   ring collapses to a caret bar
     pressed      ring contracts

   Mounts only for fine pointers with hover, and never under reduced
   motion. Otherwise the native cursor is left completely alone.
   ============================================================ */

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/motion'
import { useMediaQuery } from '../../hooks/util'

const INTERACTIVE = 'a, button, [role="button"], summary, label'
const FIELD = 'input:not([type="checkbox"]):not([type="radio"]), textarea, select'
const CARD = '[data-cursor="card"]'

export function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()
  const enabled = finePointer && !reduced

  const rootRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLSpanElement | null>(null)
  const ringRef = useRef<HTMLSpanElement | null>(null)
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  useEffect(() => {
    if (!enabled) return

    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!root || !dot || !ring) return

    // Target (true pointer) and current (smoothed ring) positions.
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let rx = tx
    let ry = ty
    let raf = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      // Immediate write — the dot must never lag the hardware pointer.
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
      if (!visibleRef.current) setVisible(true)
    }

    const tick = () => {
      // Exponential smoothing: each frame closes ~20% of the gap, which
      // settles fast without ever quite snapping.
      rx += (tx - rx) * 0.2
      ry += (ty - ry) * 0.2
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      if (!target?.closest) return

      const state = target.closest(FIELD)
        ? 'text'
        : target.closest(CARD)
          ? 'card'
          : target.closest(INTERACTIVE)
            ? 'link'
            : ''

      root.dataset.state = state
    }

    const onDown = () => root.classList.add('is-down')
    const onUp = () => root.classList.remove('is-down')
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const docEl = document.documentElement

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    docEl.addEventListener('pointerleave', onLeave)
    docEl.addEventListener('pointerenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      docEl.removeEventListener('pointerleave', onLeave)
      docEl.removeEventListener('pointerenter', onEnter)
    }
  }, [enabled])

  // Hide the native cursor only while ours is actually running.
  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    return () => document.documentElement.classList.remove('has-cursor')
  }, [enabled])

  if (!enabled) return null

  return (
    <div className={`cursor ${visible ? 'is-visible' : ''}`} ref={rootRef} aria-hidden="true">
      <span className="cursor__ring" ref={ringRef} />
      <span className="cursor__dot" ref={dotRef} />
    </div>
  )
}
