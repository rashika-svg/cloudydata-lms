/* ============================================================
   Course card.

   Redesigned around a problem the previous version had: six bands of
   equal weight — category chip, title, rating, icon list, price,
   button — separated by rules. It read as a spec sheet, and three of
   them in a row read as noise.

   Now there are four, and each is a different KIND of thing:

     the cover      identity — the category and duration sit on the
                    photo's scrim, which empties a whole row out of
                    the body and stops every card in a row repeating
                    the same grey "DATA" chip
     the title      the only large type
     the strip      what you get, as three figures rather than three
                    icon-and-label pairs; a tinted block, so the
                    grouping is done by surface instead of a hairline
     the close      what it costs, then the two calls to action

   Both actions match the real site: "Enroll NOW", and a WhatsApp
   link with the course name already written into the message.
   WhatsApp is icon-only so the primary action stays unambiguous.
   ============================================================ */

import { Link } from 'react-router-dom'
import { formatINR, lessonCount, totalMinutes, type Accent, type Course } from '../data/courses'
import { waCourse, whatsappLink } from '../data/site'
import { useApp } from '../store/app'
import { Icon } from './ui/Icon'
import { Cover, Progress, Stars } from './ui/Primitives'

/** Tints the hovered outline in the course's own colour. Decorative
    only — these are too light to carry text on a white surface, so the
    hovered title moves to `primary` instead. */
const ACCENT: Record<Accent, string> = {
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  lime: '#a3e635',
  amber: '#fbbf24',
  rose: '#fb7185',
}

interface CourseCardProps {
  course: Course
  index?: number
  /** Shows progress instead of price — used on My learning. */
  enrolledView?: boolean
}

export function CourseCard({ course, index = 0, enrolledView = false }: CourseCardProps) {
  const { isEnrolled, progressFor } = useApp()

  const enrolled = isEnrolled(course.slug)
  const p = progressFor(course.slug)
  const hours = Math.round(totalMinutes(course) / 60)
  const showProgress = enrolledView || (enrolled && p.done > 0)
  const off = Math.round(((course.mrpINR - course.priceINR) / course.mrpINR) * 100)

  const facts: [string, string][] = [
    [String(lessonCount(course)), 'lessons'],
    [String(course.projects), 'projects'],
    [`${hours}h`, 'live'],
  ]

  return (
    <article
      /* Deliberately quiet. Five things used to move at once — a 4px
         lift, a heavy shadow, a fully saturated accent border and a
         4% image zoom, all in 300ms — and a grid of them flickered
         as the pointer crossed. What is left is one soft shadow, a
         faint accent in the outline, and a 1.5% drift on the photo,
         over 500ms. The card should acknowledge the pointer, not
         react to it. */
      className="group/card rise relative flex flex-col overflow-hidden rounded-lg border border-outline-variant/70 glass ring-1 ring-[var(--glass-edge)] ring-inset transition-[box-shadow,border-color] duration-500 ease-decelerate hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--m3-outline-variant))] hover:shadow-e2"
      data-cursor="card"
      style={
        {
          '--i': Math.min(index, 8),
          '--accent': ACCENT[course.accent],
        } as React.CSSProperties
      }
    >
      <Link to={`/courses/${course.slug}`} className="relative block overflow-hidden">
        {/* Wrapper, not the cover itself: .cover carries a scaleX(-1)
            flip on some slugs and a scale here would cancel it. */}
        <span className="block transition-transform duration-700 ease-decelerate group-hover/card:scale-[1.015]">
          <Cover slug={course.slug} accent={course.accent} />
        </span>

        {/* Carries the overline below. Photographs vary, so the text
            needs its own ground rather than trusting the image. */}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-3/5 bg-linear-to-t from-black/75 via-black/25 to-transparent"
          aria-hidden="true"
        />

        <span className="absolute top-3 left-3 z-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.08em] text-white uppercase backdrop-blur-sm">
          {/* Fixed cyan, not `primary`: the pill is dark in both themes
              and the light-theme primary is a dark teal that vanishes
              against it. */}
          <i className="size-1.5 animate-pulse rounded-full bg-[#4fd8eb]" aria-hidden="true" /> Live
        </span>

        {enrolled && !enrolledView && (
          <span className="absolute top-3 right-3 z-3 inline-flex items-center gap-1 rounded-full bg-ok px-2.5 py-1 text-[0.625rem] font-medium tracking-wide text-white uppercase">
            <Icon name="check" size={12} /> Enrolled
          </span>
        )}

        <span className="absolute inset-x-4 bottom-3 z-3 flex items-center gap-2 text-[0.625rem] font-medium tracking-widest text-white/90 uppercase">
          {course.category}
          <i className="size-0.75 rounded-full bg-white/45" aria-hidden="true" />
          {course.durationLabel}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        {/* Floored at two lines so the strips line up across a row of
            cards whatever the title length. */}
        <h3 className="min-h-[2.6em] text-[1.0625rem] leading-[1.3] font-semibold">
          <Link
            to={`/courses/${course.slug}`}
            className="line-clamp-2 transition-colors duration-300 group-hover/card:text-primary"
          >
            {course.title}
          </Link>
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <strong className="font-semibold text-star">{course.rating.toFixed(1)}</strong>
          <Stars value={course.rating} size={12} />
          <span className="text-outline">({course.learners.toLocaleString('en-IN')})</span>
        </div>

        <ul className="mt-4 grid grid-cols-3 divide-x divide-outline-variant/60 rounded-md bg-linear-to-b from-surface-container to-surface-high py-2.5">
          {facts.map(([value, label]) => (
            <li key={label} className="flex flex-col items-center gap-0.5 leading-none">
              <strong className="text-[0.9375rem] font-semibold tabular-nums">{value}</strong>
              <span className="text-[0.625rem] tracking-wide text-on-surface-variant uppercase">{label}</span>
            </li>
          ))}
        </ul>

        {showProgress ? (
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <Progress ratio={p.ratio} size="sm" />
            <span className="text-[0.6875rem] text-on-surface-variant">
              <strong className="font-semibold text-on-surface">{p.pct}%</strong> · {p.done}/{p.total} lessons
            </span>
          </div>
        ) : (
          <div className="mt-auto flex flex-wrap items-baseline gap-x-2.5 gap-y-1 pt-4">
            <strong className="text-[1.375rem] leading-none font-bold tracking-tight">
              {formatINR(course.priceINR)}
            </strong>
            <s className="text-[0.8125rem] text-outline">{formatINR(course.mrpINR)}</s>
            <em className="ml-auto rounded-full bg-ok-container px-2 py-0.5 text-[0.6875rem] font-medium text-ok not-italic">
              {off}% off
            </em>
          </div>
        )}

        {/* Both actions share a height and a radius so they read as one
            control pair rather than a slab with a disc beside it. */}
        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-2.5">
          <Link
            to={enrolled ? `/learn/${course.slug}` : `/courses/${course.slug}`}
            className="state-layer inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-[0.8125rem] font-semibold text-on-primary transition-shadow duration-200 hover:shadow-e1"
          >
            <span>{enrolled ? (p.done > 0 ? 'Continue' : 'Start learning') : 'Enroll NOW'}</span>
          </Link>

          <a
            className="state-layer grid size-10 shrink-0 place-items-center rounded-full bg-wa/15 text-wa-dark ring-1 ring-wa/30 ring-inset transition-colors duration-200 hover:bg-wa/25"
            href={whatsappLink(waCourse(course.title))}
            target="_blank"
            rel="noopener noreferrer"
            title="Ask about this course on WhatsApp"
            aria-label={`Ask about ${course.title} on WhatsApp`}
          >
            <Icon name="whatsapp" size={18} />
          </a>
        </div>
      </div>
    </article>
  )
}
