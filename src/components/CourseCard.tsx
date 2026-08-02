/* ============================================================
   Course card.

   Two calls to action, matching the real site: "Enroll NOW" and
   "Get details on WhatsApp". The WhatsApp button is a genuine wa.me
   deep link with the course name pre-filled into the message.
   ============================================================ */

import { Link } from 'react-router-dom'
import { formatINR, lessonCount, totalMinutes, type Course } from '../data/courses'
import { FOUNDER, waCourse, whatsappLink } from '../data/site'
import { useApp } from '../store/app'
import { useTilt } from '../hooks/motion'
import { Icon } from './ui/Icon'
import { Cover, Progress, Stars } from './ui/Primitives'

interface CourseCardProps {
  course: Course
  index?: number
  /** Shows progress instead of price — used on My learning. */
  enrolledView?: boolean
}

export function CourseCard({ course, index = 0, enrolledView = false }: CourseCardProps) {
  const tiltRef = useTilt<HTMLElement>(5)
  const { isEnrolled, progressFor } = useApp()
  const enrolled = isEnrolled(course.slug)
  const p = progressFor(course.slug)
  const hours = Math.round(totalMinutes(course) / 60)
  const showProgress = enrolledView || (enrolled && p.done > 0)
  const off = Math.round(((course.mrpINR - course.priceINR) / course.mrpINR) * 100)

  return (
    <article
      ref={tiltRef}
      className="ccard rise"
      data-cursor="card"
      style={{ '--i': Math.min(index, 8) } as React.CSSProperties}
    >
      {/* Pointer-tracked sheen — position comes from useTilt's --px/--py. */}
      <span className="ccard__sheen" aria-hidden="true" />
      <Link to={`/courses/${course.slug}`} className="ccard__cover">
        <Cover slug={course.slug} accent={course.accent} label={course.short} />
        <span className="ccard__live">
          <i aria-hidden="true" /> Live
        </span>
        {enrolled && !enrolledView && (
          <span className="ccard__enrolled">
            <Icon name="check" size={12} strokeWidth={2.6} /> Enrolled
          </span>
        )}
      </Link>

      <div className="ccard__body">
        <div className="ccard__top">
          <span className="ccard__cat">{course.category}</span>
          <span className="ccard__dur">
            <Icon name="clock" size={12} /> {course.durationLabel}
          </span>
        </div>

        <h3 className="ccard__title">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>

        <p className="ccard__by">by {FOUNDER.name}</p>

        <div className="ccard__rating">
          <strong>{course.rating.toFixed(1)}</strong>
          <Stars value={course.rating} />
          <span>({course.learners.toLocaleString('en-IN')})</span>
        </div>

        <ul className="ccard__facts">
          <li>
            <Icon name="list" size={13} /> {lessonCount(course)} lessons
          </li>
          <li>
            <Icon name="box" size={13} /> {course.projects} projects
          </li>
          <li>
            <Icon name="video" size={13} /> {hours}h live
          </li>
        </ul>

        {showProgress ? (
          <div className="ccard__prog">
            <Progress ratio={p.ratio} size="sm" />
            <span>
              <strong>{p.pct}%</strong> · {p.done}/{p.total} lessons
            </span>
          </div>
        ) : (
          <div className="ccard__price">
            <strong>{formatINR(course.priceINR)}</strong>
            <s>{formatINR(course.mrpINR)}</s>
            <em>{off}% off</em>
          </div>
        )}
      </div>

      <footer className="ccard__foot">
        {enrolled ? (
          <Link to={`/learn/${course.slug}`} className="btn btn--brand btn--sm ccard__cta">
            {p.done > 0 ? 'Continue' : 'Start learning'}
            <Icon name="arrow-right" size={14} className="btn__icon" />
          </Link>
        ) : (
          <Link to={`/courses/${course.slug}`} className="btn btn--brand btn--sm ccard__cta">
            Enroll NOW
          </Link>
        )}

        <a
          className="wa wa--sm"
          href={whatsappLink(waCourse(course.title))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Get details about ${course.title} on WhatsApp`}
        >
          <Icon name="whatsapp" size={15} />
          <span>WhatsApp</span>
        </a>
      </footer>
    </article>
  )
}
