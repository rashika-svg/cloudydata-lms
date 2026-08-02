/* ============================================================
   Back to top.

   Appears once you are far enough down that scrolling back is a
   chore. The ring around it fills with reading progress, so the
   control tells you where you are as well as offering a way out.
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
      className={`totop ${visible ? 'is-in' : ''}`}
      onClick={toTop}
      aria-label="Back to top"
      // Keep it out of the tab order while it is invisible.
      tabIndex={visible ? 0 : -1}
    >
      <svg className="totop__ring" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle className="totop__track" cx={SIZE / 2} cy={SIZE / 2} r={R} strokeWidth="2" />
        <circle
          className="totop__fill"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <Icon name="chevron-down" size={16} className="totop__arrow" />
    </button>
  )
}
