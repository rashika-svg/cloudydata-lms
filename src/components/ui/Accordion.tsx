/* ============================================================
   Accordion — measured height animation.

   `height: auto` cannot be transitioned, so useAnimatedHeight measures
   the panel and drives a pixel height, releasing back to `auto` once
   open so nested content can still reflow. Collapsed panels keep
   `visibility: hidden` in CSS to stay out of the tab order.
   ============================================================ */

import { useId, useState, type ReactNode } from 'react'
import { useAnimatedHeight } from '../../hooks/motion'

interface AccordionItemProps {
  title: ReactNode
  meta?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  /** Controlled mode — supply both to lift state out. */
  open?: boolean
  onToggle?: (next: boolean) => void
}

export function AccordionItem({
  title,
  meta,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
}: AccordionItemProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const { ref, height } = useAnimatedHeight(open)
  const panelId = useId()
  const buttonId = `${panelId}-btn`

  const toggle = () => {
    const next = !open
    if (!isControlled) setUncontrolledOpen(next)
    onToggle?.(next)
  }

  return (
    <div className={`acc ${open ? 'is-open' : ''}`}>
      <h3 className="acc__heading">
        <button
          id={buttonId}
          type="button"
          className="acc__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span className="acc__title">{title}</span>
          {meta && <span className="acc__meta">{meta}</span>}
          {/* A drawn plus that loses its vertical stroke on open —
              cheaper and calmer than a rotating chevron. */}
          <span className="acc__mark" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="acc__panel"
        style={{ height: height === 'auto' ? 'auto' : `${height}px` }}
        // Collapsed panels must not be reachable by keyboard.
        {...(!open ? { inert: '' } : {})}
      >
        <div className="acc__inner" ref={ref}>
          {children}
        </div>
      </div>
    </div>
  )
}
