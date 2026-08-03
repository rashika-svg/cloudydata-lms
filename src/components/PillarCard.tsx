/* ============================================================
   Pillar card.

   The same six principles appear twice — as "why this is not a
   recorded course" on the Home page, and as "what I hold to" on
   About. The markup was duplicated byte-for-byte in both, which is
   exactly how the two fell out of step the moment one of them got a
   hover treatment. One component, one place to change it.

   Hover: a 4px lift, the outline warms to primary, and the icon chip
   springs up a notch and tints. The same vocabulary as the course
   card, one step livelier — these tiles are not links, so hover is
   the only affordance they have to give.

   Durations come from --t*, not the fixed duration-* utilities. The
   tokens multiply by --motion, so this collapses under
   prefers-reduced-motion the way the entrance animations do; the
   utilities are literal milliseconds and would not.

   No pointer-tracked glow and no tilt, on purpose. The component
   layer records why .sheen/.card-glow were removed (a white radial
   on a near-black surface reads as a smudge) and why .tilt is kept
   off grid cards (a rotated card falls out of line with the two
   beside it). Both apply here.
   ============================================================ */

import type { Pillar } from '../data/site'
import { Icon, type IconName } from './ui/Icon'

export function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <article
      className="group rise flex flex-col gap-3 rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset p-6 shadow-e1 transition-[transform,border-color,box-shadow] duration-[var(--t4)] ease-decelerate hover:-translate-y-1 hover:border-primary/25 hover:shadow-e3"
      style={{ '--i': index } as React.CSSProperties}
    >
      <span className="grid size-11 place-items-center rounded-md border border-outline-variant bg-surface-container text-on-surface-variant transition-[transform,background-color,border-color,color] duration-[var(--t3)] ease-spring group-hover:-rotate-6 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/12 group-hover:text-primary">
        <Icon name={pillar.icon as IconName} size={19} />
      </span>
      <h3 className="text-[1.08rem] transition-colors duration-[var(--t3)] ease-decelerate group-hover:text-primary">
        {pillar.title}
      </h3>
      <p className="text-sm text-on-surface-variant">{pillar.body}</p>
    </article>
  )
}
