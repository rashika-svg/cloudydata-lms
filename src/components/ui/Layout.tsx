/* ============================================================
   Page scaffolding.

   Four shapes that every page is built from. They exist as
   components rather than utility strings so the vertical rhythm is
   decided in one place — more air than a dense app would use, which
   is most of what separates a marketing page from a cramped one.
   ============================================================ */

import type { ReactNode } from 'react'

/** Centred column at the site's max width, with the responsive gutter. */
export function Wrap({
  children,
  narrow = false,
  className = '',
}: {
  children: ReactNode
  narrow?: boolean
  className?: string
}) {
  return (
    <div className={`mx-auto w-full px-(--pad) ${narrow ? 'max-w-[820px]' : 'max-w-7xl'} ${className}`}>
      {children}
    </div>
  )
}

type SectionTone = 'plain' | 'alt'

export function Section({
  children,
  tone = 'plain',
  /** Halves the top padding — for the band directly under a page head. */
  top = false,
  tight = false,
  className = '',
  ...rest
}: {
  children: ReactNode
  tone?: SectionTone
  top?: boolean
  tight?: boolean
  className?: string
} & React.HTMLAttributes<HTMLElement>) {
  const pad = tight ? 'py-12' : top ? 'pt-8 pb-[clamp(4.5rem,7vw,6.5rem)]' : 'py-[clamp(4.5rem,7vw,6.5rem)]'

  return (
    <section
      className={`${pad} ${tone === 'alt' ? 'border-y border-outline-variant bg-surface-container' : ''} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}

/** Title and standfirst at the top of an inner page. */
export function PageHead({
  title,
  children,
  /** Taller, larger type — for the pages that are the destination
      rather than a step on the way to one. */
  large = false,
  action,
}: {
  title: ReactNode
  children?: ReactNode
  large?: boolean
  action?: ReactNode
}) {
  return (
    <section
      className={`border-b border-outline-variant bg-surface-lowest ${large ? 'pt-18 pb-12' : 'pt-12 pb-8'}`}
    >
      <Wrap>
        <h1
          className={
            large
              ? 'mt-3 max-w-[22ch] text-h1-lg'
              : 'max-w-[20ch] text-h1'
          }
        >
          {title}
        </h1>
        {children && <p className="mt-4 max-w-[64ch] text-on-surface-variant">{children}</p>}
        {action && <div className="mt-6">{action}</div>}
      </Wrap>
    </section>
  )
}

/** A tonal block used for forms and standalone content. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg bg-surface-low p-6 ${className}`}>{children}</div>
}

/** Closing band. A dark slab in both themes, so it reads as the end
    of the page rather than another section of it. */
export function CtaBand({
  title,
  children,
  actions,
}: {
  title: ReactNode
  children?: ReactNode
  actions: ReactNode
}) {
  return (
    <section className="bg-dark py-[clamp(3rem,7vw,6.5rem)] text-center text-on-dark">
      <Wrap>
        <h2 className="mx-auto max-w-[20ch] text-h1">{title}</h2>
        {children && <p className="mx-auto mt-4 max-w-[58ch] text-on-dark/70">{children}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">{actions}</div>
      </Wrap>
    </section>
  )
}

/** Auto-fitting card grid. `min` is the point a column stops shrinking. */
export function Grid({
  children,
  min = 300,
  className = '',
}: {
  children: ReactNode
  min?: number
  className?: string
}) {
  return (
    <div
      className={`grid gap-6 ${className}`}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))` }}
    >
      {children}
    </div>
  )
}
