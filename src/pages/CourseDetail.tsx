/* ============================================================
   Course detail.

   Sticky enrolment card with both real calls to action: "Enroll NOW"
   (demo state) and a genuine WhatsApp deep link with the course name
   pre-filled — which is how enrolment actually works on the real site.
   ============================================================ */

import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  COURSES,
  formatDuration,
  formatINR,
  getCourse,
  lessonCount,
  totalMinutes,
} from '../data/courses'
import { CONTACT, FOUNDER, waCourse, whatsappLink } from '../data/site'
import { photoFor } from '../data/photos'
import { useApp } from '../store/app'
import { AccordionItem } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { CourseCard } from '../components/CourseCard'
import { Icon } from '../components/ui/Icon'
import { Avatar, Cover, KindTag, Progress, Rating, SectionHead, kindLabel } from '../components/ui/Primitives'

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const course = getCourse(slug)
  const { isEnrolled, enrol, leave, resetCourse, progressFor, isLessonDone, pushToast } = useApp()

  // Brief success state on the enrol button, so the click is
  // acknowledged in place before the card swaps to its enrolled form.
  const [justEnrolled, setJustEnrolled] = useState(false)

  useEffect(() => {
    if (!justEnrolled) return
    const t = window.setTimeout(() => setJustEnrolled(false), 1100)
    return () => window.clearTimeout(t)
  }, [justEnrolled])

  const related = useMemo(
    () => COURSES.filter((c) => c.slug !== slug && c.category === course?.category).slice(0, 3),
    [slug, course?.category],
  )

  if (!course) return <Navigate to="/courses" replace />

  const enrolled = isEnrolled(course.slug)
  const photo = photoFor(course.slug)
  const progress = progressFor(course.slug)
  const lessons = lessonCount(course)
  const minutes = totalMinutes(course)
  const off = Math.round(((course.mrpINR - course.priceINR) / course.mrpINR) * 100)

  const onEnrol = () => {
    setJustEnrolled(true)
    enrol(course.slug)
    pushToast('Added to My learning', {
      detail: 'Demo enrolment — message on WhatsApp to join a real batch.',
      tone: 'success',
    })
  }

  return (
    <>
      {/* ---- Hero ------------------------------------- */}
      <section className="dhero">
        <div className="wrap dhero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/courses">Courses</Link>
            <Icon name="chevron-right" size={13} />
            <Link to={`/courses?cat=${encodeURIComponent(course.category)}`}>{course.category}</Link>
          </nav>

          <div className="dhero__badges">
            <span className="dhero__live">
              <i aria-hidden="true" /> Live classes
            </span>
            <span className="dhero__tag">{course.level}</span>
            {enrolled && (
              <span className="dhero__tag dhero__tag--ok">
                <Icon name="check" size={12} strokeWidth={2.6} /> Enrolled
              </span>
            )}
          </div>

          <h1>{course.title}</h1>
          <p className="dhero__lede">{course.description}</p>

          <div className="dhero__meta">
            <Rating value={course.rating} learners={course.learners} />
            <span>
              <Icon name="clock" size={15} /> {course.durationLabel}
            </span>
            <span>
              <Icon name="video" size={15} /> {course.mode}
            </span>
            <span>
              <Icon name="list" size={15} /> {lessons} lessons · {formatDuration(minutes)}
            </span>
          </div>

          <p className="dhero__by">
            Taught by <strong>{FOUNDER.name}</strong> — {FOUNDER.experience} in analytics and data science
          </p>
        </div>
      </section>

      {/* ---- Body ------------------------------------- */}
      <div className="wrap dbody">
        <div className="dbody__main">
          {enrolled && progress.done > 0 && (
            <section className="dprog">
              <div>
                <strong>Your progress</strong>
                <span>
                  {progress.done} of {progress.total} lessons complete
                </span>
              </div>
              <Progress ratio={progress.ratio} showValue />
              <Button to={`/learn/${course.slug}`} size="sm" variant="brand" icon="arrow-right">
                Continue
              </Button>
            </section>
          )}

          <section className="panel">
            <h2>What you will learn</h2>
            <ul className="learnlist">
              {course.outcomes.map((o) => (
                <li key={o}>
                  <Icon name="check" size={15} strokeWidth={2.2} />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>Tools you will use</h2>
            <div className="tools">
              {course.tools.map((t) => (
                <span className="tool" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="panel panel--flush">
            <div className="panel__head">
              <h2>Course content</h2>
              <p>
                {course.curriculum.length} modules · {lessons} lessons · {formatDuration(minutes)} total
              </p>
            </div>

            <div className="modules">
              {course.curriculum.map((mod, mi) => {
                const modMinutes = mod.lessons.reduce((n, l) => n + l.minutes, 0)
                const modDone = enrolled ? mod.lessons.filter((l) => isLessonDone(course.slug, l.id)).length : 0

                return (
                  <AccordionItem
                    key={mod.id}
                    defaultOpen={mi === 0}
                    title={
                      <>
                        <span className="modules__n">{String(mi + 1).padStart(2, '0')}</span>
                        {mod.title}
                      </>
                    }
                    meta={
                      <>
                        {enrolled && (
                          <span className={modDone === mod.lessons.length ? 'is-all' : ''}>
                            {modDone}/{mod.lessons.length}
                          </span>
                        )}
                        <span>
                          {mod.lessons.length} lessons · {formatDuration(modMinutes)}
                        </span>
                      </>
                    }
                  >
                    <p className="modules__summary">{mod.summary}</p>
                    <ul className="lessons">
                      {mod.lessons.map((l) => {
                        const done = enrolled && isLessonDone(course.slug, l.id)
                        return (
                          <li key={l.id} className={done ? 'is-done' : ''}>
                            <Icon name={done ? 'check-circle' : 'circle'} size={15} className="lessons__mark" />
                            <KindTag kind={l.kind} />
                            {enrolled ? (
                              <Link to={`/learn/${course.slug}?lesson=${l.id}`}>{l.title}</Link>
                            ) : (
                              <span>{l.title}</span>
                            )}
                            <span className="lessons__kind">{kindLabel(l.kind)}</span>
                            <span className="lessons__time">{formatDuration(l.minutes)}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionItem>
                )
              })}
            </div>
          </section>

          <section className="panel">
            <h2>Your instructor</h2>
            <div className="inst">
              <Avatar initials={FOUNDER.initials} size={64} />
              <div>
                <strong>{FOUNDER.name}</strong>
                <span>{FOUNDER.role}</span>
                <p>{FOUNDER.bio}</p>
                <div className="inst__links">
                  <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                    <Icon name="linkedin" size={15} /> LinkedIn
                  </a>
                  <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
                    <Icon name="instagram" size={15} /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ---- Sticky enrolment card ------------------ */}
        <aside className="dbuy">
          <div className="dbuy__card">
            <div className="dbuy__cover">
              <Cover slug={course.slug} accent={course.accent} priority />
              {photo && (
                <span className="dbuy__credit">
                  Photo: {photo.by} / Pexels
                </span>
              )}
            </div>

            <div className="dbuy__body">
              {enrolled ? (
                <>
                  <div className={`dbuy__enrolled ${justEnrolled ? 'is-fresh' : ''}`}>
                    <Icon name="check-circle" size={17} />
                    {justEnrolled ? 'Added to My learning' : 'In your My learning'}
                  </div>
                  <Progress ratio={progress.ratio} showValue />
                  <Button to={`/learn/${course.slug}`} block size="lg" variant="brand" icon="arrow-right">
                    {progress.done > 0 ? 'Continue learning' : 'Start learning'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="dbuy__price">
                    <strong>{formatINR(course.priceINR)}</strong>
                    <s>{formatINR(course.mrpINR)}</s>
                    <em>{off}% off</em>
                  </div>
                  <Button block size="lg" variant="brand" onClick={onEnrol}>
                    Enroll NOW
                  </Button>
                </>
              )}

              <a
                className="wa wa--block"
                href={whatsappLink(waCourse(course.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                <span>Get details on WhatsApp</span>
              </a>

              <p className="dbuy__note">
                Real batches are confirmed over WhatsApp — {CONTACT.phoneDisplay}. The button above is a demo enrolment.
              </p>

              <ul className="dbuy__facts">
                <li>
                  <Icon name="video" size={15} /> {course.mode}
                </li>
                <li>
                  <Icon name="list" size={15} /> {lessons} lessons in {course.curriculum.length} modules
                </li>
                <li>
                  <Icon name="box" size={15} /> {course.projects} real-world projects
                </li>
                <li>
                  <Icon name="users" size={15} /> Daily one-on-one doubt clearing
                </li>
                <li>
                  <Icon name="award" size={15} /> Certificate on completion
                </li>
              </ul>

              {enrolled && (
                <div className="dbuy__minor">
                  <button
                    type="button"
                    onClick={() => {
                      resetCourse(course.slug)
                      pushToast('Progress reset', { detail: course.title, tone: 'warn' })
                    }}
                  >
                    Reset progress
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      leave(course.slug)
                      pushToast('Removed', { detail: 'Your progress is kept if you return.', tone: 'warn' })
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ---- Mobile bar ------------------------------- */}
      <div className="buybar">
        <div>
          <strong>{formatINR(course.priceINR)}</strong>
          <span>{course.durationLabel}</span>
        </div>
        <a className="wa wa--sm" href={whatsappLink(waCourse(course.title))} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={16} />
          <span>WhatsApp</span>
        </a>
        {enrolled ? (
          <Button to={`/learn/${course.slug}`} variant="brand" icon="arrow-right">
            Continue
          </Button>
        ) : (
          <Button variant="brand" onClick={onEnrol}>
            Enroll
          </Button>
        )}
      </div>

      {/* ---- Related --------------------------------- */}
      {related.length > 0 && (
        <section className="section section--alt">
          <div className="wrap">
            <SectionHead eyebrow="Keep exploring" title={`More in ${course.category}`} />
            <div className="grid grid--3">
              {related.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
