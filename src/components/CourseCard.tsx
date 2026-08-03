/* ============================================================
   Course card — M3 outlined card, in Tailwind utilities.

   Two calls to action, matching the real site: "Enroll NOW" and a
   WhatsApp link with the course name pre-filled into the message.
   WhatsApp is icon-only so the primary action stays unambiguous.

   Outlined rather than elevated. The tonal card surface sat within a
   couple of percent of the page background, so in a three-up grid the
   cards had no edge of their own — only a shadow doing the work of a
   border. Now the card is the lowest surface (white in light, near
   black in dark) with a hairline outline, and the elevation is spent
   on hover, where it carries meaning.

   Content is grouped rather than evenly spaced: identity (category,
   title, rating) above the rule, commercials (what you get, what it
   costs) below it, actions in the footer. The previous single gap
   between every row gave five equal-weight bands and no hierarchy.
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

  return (
    <article
      className="group/card rise relative flex flex-col overflow-hidden rounded-lg border border-outline-variant/70 bg-surface-lowest transition-[transform,box-shadow,border-color] duration-300 ease-emphasized hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] hover:shadow-e3"
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
        <span className="block transition-transform duration-500 ease-emphasized group-hover/card:scale-[1.04]">
          <Cover slug={course.slug} accent={course.accent} />
        </span>

        <span className="absolute top-3 left-3 z-2 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.08em] text-white uppercase backdrop-blur-sm">
          {/* Fixed cyan, not `primary`: the pill is dark in both themes
              and the light-theme primary is a dark teal that vanishes
              against it. */}
          <i className="size-1.5 animate-pulse rounded-full bg-[#4fd8eb]" aria-hidden="true" /> Live
        </span>

        {enrolled && !enrolledView && (
          <span className="absolute top-3 right-3 z-2 inline-flex items-center gap-1 rounded-full bg-ok px-2.5 py-1 text-[0.625rem] font-medium tracking-wide text-white uppercase">
            <Icon name="check" size={12} /> Enrolled
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-5 pt-4">
        <div className="mb-2.5 flex items-center justify-between gap-2 text-[0.6875rem]">
          <span className="rounded-full bg-surface-container px-2.5 py-1 font-medium tracking-[0.04em] text-on-surface-variant uppercase">
            {course.category}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-outline">
            <Icon name="clock" size={12} /> {course.durationLabel}
          </span>
        </div>

        {/* Clamped and floored at two lines so the rating rows line up
            across a row of cards whatever the title length. */}
        <h3 className="min-h-[2.7em] text-[1.0625rem] leading-[1.35] font-semibold">
          <Link
            to={`/courses/${course.slug}`}
            className="line-clamp-2 transition-colors duration-200 group-hover/card:text-primary"
          >
            {course.title}
          </Link>
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <strong className="font-semibold text-star">{course.rating.toFixed(1)}</strong>
          <Stars value={course.rating} size={12} />
          <span className="text-outline">({course.learners.toLocaleString('en-IN')})</span>
        </div>

        <ul className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-outline-variant/60 pt-3.5 text-xs text-on-surface-variant">
          <li className="inline-flex items-center gap-1.5">
            <Icon name="list" size={13} /> {lessonCount(course)} lessons
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Icon name="box" size={13} /> {course.projects} projects
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Icon name="video" size={13} /> {hours}h live
          </li>
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
      </div>

      {/* Both actions share a height and a radius so they read as one
          control pair rather than a slab with a disc beside it. */}
      <footer className="grid grid-cols-[1fr_auto] items-center gap-2.5 px-5 pt-4 pb-5">
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
      </footer>
    </article>
  )
}
