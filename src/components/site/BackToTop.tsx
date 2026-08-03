/* ============================================================
   Back to top.

   Appears once you are far enough down that scrolling back is a
   chore. The ring around it fills with reading progress, so the
   control tells you where you are as well as offering a way out.

   On narrow screens the toaster occupies the same corner, so the
   button lifts clear of it rather than overlapping.
   ============================================================ */

import { useScrollProgress, useScrolled, useReducedMotion } from '../../hooks/motion'
import { Icon } from '../ui/Icon'

const SIZE = 44
const R = (SIZE - 4) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

export function BackToTop() {
  const visible = useScrolled(700)
  const progress = useScrollProgress()
  const reduced = useReducedMotion()

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })

  return (
    <button
      type="button"
      className={`group fixed right-6 bottom-6 z-98 grid size-11 place-items-center rounded-full border border-outline-variant bg-surface-lowest text-on-surface-variant shadow-e2 transition-[opacity,transform,color,border-color] duration-300 hover:border-primary/20 hover:text-primary max-[520px]:bottom-27 ${
        visible ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-90 opacity-0'
      }`}
      onClick={toTop}
      aria-label="Back to top"
      // Keep it out of the tab order while it is invisible.
      tabIndex={visible ? 0 : -1}
    >
      <svg className="absolute inset-0" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle className="fill-none stroke-transparent" cx={SIZE / 2} cy={SIZE / 2} r={R} strokeWidth="2" />
        <circle
          className="fill-none stroke-primary opacity-75"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <Icon
        name="chevron-down"
        size={16}
        /* Negative, because Tailwind translates before it rotates —
           the arrow has to nudge toward the top of the screen. */
        className="relative rotate-180 transition-transform duration-200 group-hover:-translate-y-0.5"
      />
    </button>
  )
}
