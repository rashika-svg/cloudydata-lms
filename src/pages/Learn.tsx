/* ============================================================
   Lesson player — the demo of the learning experience.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { allLessons, formatDuration, getCourse, type Lesson } from '../data/courses'
import { waCourse, whatsappLink } from '../data/site'
import { useApp } from '../store/app'
import { useHotkey, useMediaQuery } from '../hooks/util'
import { useReducedMotion } from '../hooks/motion'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Badge, KindTag, Progress, kindLabel } from '../components/ui/Primitives'

export default function Learn() {
  const { slug } = useParams<{ slug: string }>()
  const course = getCourse(slug)
  const [params, setParams] = useSearchParams()

  const { isEnrolled, enrol, isLessonDone, setLessonDone, toggleLesson, progressFor, noteLastLesson, pushToast } =
    useApp()

  const isWide = useMediaQuery('(min-width: 1100px)')
  const [outlineOpen, setOutlineOpen] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const reduced = useReducedMotion()
  const railRef = useRef<HTMLDivElement | null>(null)

  const lessons = useMemo(() => (course ? allLessons(course) : []), [course])

  // The URL owns "which lesson", so a player view is linkable and
  // survives a refresh.
  const activeId = params.get('lesson') ?? lessons[0]?.id
  const activeIndex = Math.max(0, lessons.findIndex((l) => l.id === activeId))
  const active: Lesson | undefined = lessons[activeIndex]

  const goTo = useCallback(
    (index: number) => {
      const target = lessons[index]
      if (!target) return
      setParams({ lesson: target.id }, { replace: true })
      setOutlineOpen(false)
    },
    [lessons, setParams],
  )

  // Landing on a player URL directly counts as joining.
  useEffect(() => {
    if (course && !isEnrolled(course.slug)) enrol(course.slug)
  }, [course, isEnrolled, enrol])

  useEffect(() => {
    if (course && active) noteLastLesson(course.slug, active.id)
  }, [course, active, noteLastLesson])

  useEffect(() => {
    railRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [activeId, reduced])

  const progress = course ? progressFor(course.slug) : { done: 0, total: 0, ratio: 0, pct: 0, complete: false }

  const completeAndAdvance = useCallback(() => {
    if (!course || !active) return

    const wasLast = progress.done === progress.total - 1 && !isLessonDone(course.slug, active.id)
    setLessonDone(course.slug, active.id, true)

    if (wasLast) {
      setCelebrate(true)
      pushToast('Course complete', { detail: `You finished ${course.title}.`, tone: 'success' })
      window.setTimeout(() => setCelebrate(false), 2600)
      return
    }

    if (activeIndex < lessons.length - 1) goTo(activeIndex + 1)
  }, [course, active, progress, isLessonDone, setLessonDone, activeIndex, lessons.length, goTo, pushToast])

  useHotkey('j', () => goTo(activeIndex + 1))
  useHotkey('k', () => goTo(activeIndex - 1))
  useHotkey('ArrowRight', () => goTo(activeIndex + 1))
  useHotkey('ArrowLeft', () => goTo(activeIndex - 1))
  useHotkey('m', () => {
    if (course && active) toggleLesson(course.slug, active.id)
  })

  if (!course) return <Navigate to="/courses" replace />
  if (!active) return <Navigate to={`/courses/${course.slug}`} replace />

  const done = isLessonDone(course.slug, active.id)
  const moduleOf = course.curriculum.find((m) => m.lessons.some((l) => l.id === active.id))
  const moduleNo = course.curriculum.findIndex((m) => m.id === moduleOf?.id) + 1

  return (
    <div className={`player ${outlineOpen ? 'outline-open' : ''}`}>
      {celebrate && !reduced && <Confetti />}

      <aside className="outline" ref={railRef} aria-label="Course outline">
        <header className="outline__head">
          <Link to={`/courses/${course.slug}`} className="outline__back">
            <Icon name="chevron-left" size={14} />
            {course.short}
          </Link>
          {!isWide && (
            <button type="button" className="outline__close" onClick={() => setOutlineOpen(false)} aria-label="Close outline">
              <Icon name="close" size={16} />
            </button>
          )}
          <div className="outline__prog">
            <Progress ratio={progress.ratio} size="sm" />
            <span>
              {progress.done}/{progress.total}
            </span>
          </div>
        </header>

        <nav className="outline__modules">
          {course.curriculum.map((mod, mi) => {
            const modDone = mod.lessons.filter((l) => isLessonDone(course.slug, l.id)).length
            const complete = modDone === mod.lessons.length

            return (
              <section key={mod.id}>
                <h3 className={`outline__mod ${complete ? 'is-complete' : ''}`}>
                  <span>{String(mi + 1).padStart(2, '0')}</span>
                  <span className="outline__modtitle">{mod.title}</span>
                  <span className="outline__modcount">
                    {complete ? <Icon name="check" size={12} strokeWidth={2.4} /> : `${modDone}/${mod.lessons.length}`}
                  </span>
                </h3>

                <ul>
                  {mod.lessons.map((l) => {
                    const lDone = isLessonDone(course.slug, l.id)
                    const isActive = l.id === active.id
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          data-active={isActive}
                          className={`outline__lesson ${lDone ? 'is-done' : ''}`}
                          onClick={() => goTo(lessons.findIndex((x) => x.id === l.id))}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          <Tick done={lDone} />
                          <span className="outline__lessontitle">{l.title}</span>
                          <span className="outline__lessontime">{formatDuration(l.minutes)}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </nav>
      </aside>

      {outlineOpen && <div className="outline__scrim" onClick={() => setOutlineOpen(false)} aria-hidden="true" />}

      <div className="stage">
        <div className="stage__bar">
          {!isWide && (
            <button type="button" className="stage__menu" onClick={() => setOutlineOpen(true)} aria-label="Open outline">
              <Icon name="list" size={17} />
            </button>
          )}
          <span className="stage__crumb">
            <span>{String(moduleNo).padStart(2, '0')}</span>
            {moduleOf?.title}
          </span>
          <span className="stage__count">
            {activeIndex + 1} / {lessons.length}
          </span>
        </div>

        {/* Keyed on lesson id so the stage replays its entrance. */}
        <article className="stage__body" key={active.id}>
          <div className="stage__video">
            <button type="button" className="stage__play" aria-label={`Play ${active.title}`}>
              <Icon name="play" size={22} filled />
            </button>
            <span className="stage__placeholder">Live session recording — placeholder</span>
          </div>

          <div className="stage__meta">
            <KindTag kind={active.kind} showLabel />
            <span>{formatDuration(active.minutes)}</span>
            {done && (
              <Badge tone="ok" icon="check">
                Completed
              </Badge>
            )}
          </div>

          <h1 className="stage__title">{active.title}</h1>

          <div className="stage__cols">
            <div className="stage__notes">
              <h2>In this {kindLabel(active.kind).toLowerCase()}</h2>
              <p>
                {moduleOf?.summary} This session runs {formatDuration(active.minutes)} and sits in{' '}
                <strong>{moduleOf?.title}</strong>, module {moduleNo} of {course.curriculum.length}.
              </p>
              <p>
                Every concept is followed by a guided assignment. Work through it before the next live session — the
                teaching assistant is available daily, and the point of the assignment is to get stuck somewhere useful.
              </p>

              <a
                className="wa"
                href={whatsappLink(waCourse(course.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" size={17} />
                <span>Stuck? Ask about this lesson</span>
              </a>
            </div>

            <aside className="stage__side">
              <h2>Shortcuts</h2>
              <dl className="keys">
                <div>
                  <dt>
                    <kbd>J</kbd>
                  </dt>
                  <dd>Next lesson</dd>
                </div>
                <div>
                  <dt>
                    <kbd>K</kbd>
                  </dt>
                  <dd>Previous</dd>
                </div>
                <div>
                  <dt>
                    <kbd>M</kbd>
                  </dt>
                  <dd>Mark done</dd>
                </div>
              </dl>
            </aside>
          </div>

          <div className="stage__actions">
            <Button
              variant={done ? 'outline' : 'brand'}
              icon={done ? 'rotate' : 'check'}
              iconSide="left"
              onClick={done ? () => toggleLesson(course.slug, active.id) : completeAndAdvance}
            >
              {done ? 'Mark as not done' : 'Complete & continue'}
            </Button>

            <div className="stage__nav">
              <Button
                variant="ghost"
                icon="chevron-left"
                iconSide="left"
                onClick={() => goTo(activeIndex - 1)}
                {...(activeIndex === 0 ? { disabled: true } : {})}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                icon="chevron-right"
                onClick={() => goTo(activeIndex + 1)}
                {...(activeIndex === lessons.length - 1 ? { disabled: true } : {})}
              >
                Next
              </Button>
            </div>
          </div>

          {progress.complete && (
            <div className="stage__done">
              <span className="stage__doneicon">
                <Icon name="award" size={20} />
              </span>
              <div>
                <strong>You finished {course.title}.</strong>
                <span>Every lesson complete. In a real batch your certificate would be issued at this point.</span>
              </div>
              <Button to="/my-learning" variant="outline" size="sm" icon="chevron-right">
                My learning
              </Button>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------
   Confetti — one-shot celebration for finishing a course.

   Pure CSS particles from a fixed seed pattern: no canvas, no
   library, and no Math.random in render, so the burst is identical
   every time and never causes a hydration mismatch. Unmounts itself
   when the parent clears the flag.
   ---------------------------------------------------------- */

const CONFETTI = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  // Deterministic pseudo-scatter — repeatable and cheap.
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  duration: 1.9 + ((i * 7) % 12) / 10,
  hue: [0, 1, 2, 3][i % 4]!,
  drift: (((i * 29) % 40) - 20) / 10,
}))

function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {CONFETTI.map((c) => (
        <i
          key={c.id}
          data-hue={c.hue}
          style={
            {
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              '--drift': `${c.drift}rem`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/* ----------------------------------------------------------
   Tick — the check is drawn along its path rather than faded in,
   so completing a lesson carries a small gesture.
   ---------------------------------------------------------- */

function Tick({ done }: { done: boolean }) {
  return (
    <span className={`tick ${done ? 'is-done' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
        <circle cx="12" cy="12" r="8.5" className="tick__ring" strokeWidth="1.5" />
        <path
          d="M7.8 12.4 10.8 15.4 16.4 9"
          className="tick__check"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
