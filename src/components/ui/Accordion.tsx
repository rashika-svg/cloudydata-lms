/* ============================================================
   Accordion — measured height animation.

   `height: auto` cannot be transitioned, so useAnimatedHeight measures
   the panel and drives a pixel height, releasing back to `auto` once
   open so nested content can still reflow. Collapsed panels are
   `invisible` and `inert`, so they stay out of the tab order.
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
    <div
      className={`rounded-md border transition-[border-color,box-shadow] duration-200 not-first:mt-2 ${
        open ? 'border-outline shadow-e1' : 'border-outline-variant'
      } bg-surface-lowest`}
    >
      <h3 className="m-0 text-base">
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-center gap-3 rounded-md p-4 text-left font-semibold transition-colors duration-100 hover:bg-surface-container"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span className="flex min-w-0 flex-1 items-center gap-3">{title}</span>
          {meta && (
            <span className="flex items-center gap-3 text-xs font-normal whitespace-nowrap text-outline">{meta}</span>
          )}
          {/* A drawn plus that loses its vertical stroke on open —
              cheaper and calmer than a rotating chevron. */}
          <span className="relative size-3.25 flex-none text-on-surface-variant" aria-hidden="true">
            <i className="absolute top-1/2 left-0 h-[1.6px] w-full -mt-[0.8px] bg-current" />
            <i
              className={`absolute top-0 left-1/2 h-full w-[1.6px] -ml-[0.8px] bg-current transition-transform duration-300 ${
                open ? 'scale-y-0' : ''
              }`}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden transition-[height,opacity] duration-300 ${
          open ? 'visible opacity-100' : 'invisible opacity-0 [transition:height_300ms,opacity_300ms,visibility_0s_linear_300ms]'
        }`}
        style={{ height: height === 'auto' ? 'auto' : `${height}px` }}
        // Collapsed panels must not be reachable by keyboard.
        {...(!open ? { inert: '' } : {})}
      >
        <div className="max-w-[74ch] px-4 pb-4 text-sm text-on-surface-variant" ref={ref}>
          {children}
        </div>
      </div>
    </div>
  )
}
