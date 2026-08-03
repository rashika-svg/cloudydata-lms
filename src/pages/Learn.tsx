/* ============================================================
   Lesson player — the demo of the learning experience.

   Below 1100px the outline becomes a drawer over the stage rather
   than a column beside it; above that the two sit side by side and
   both scroll independently under the sticky header.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { allLessons, formatDuration, getCourse, type Lesson } from '../data/courses'
import { waCourse } from '../data/site'
import { useApp } from '../store/app'
import { useHotkey, useMediaQuery } from '../hooks/util'
import { useReducedMotion } from '../hooks/motion'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Badge, KindTag, Progress, kindLabel } from '../components/ui/Primitives'
import { Wa } from '../components/ui/Wa'

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
    <div className="grid min-h-[calc(100vh-68px)] bg-surface-lowest min-[1100px]:grid-cols-[330px_minmax(0,1fr)]">
      {celebrate && !reduced && <Confetti />}

      <aside
        className={`overflow-y-auto border-r border-outline-variant bg-surface-container transition-transform duration-300
          max-[1099px]:fixed max-[1099px]:inset-y-0 max-[1099px]:top-17 max-[1099px]:left-0 max-[1099px]:z-99
          max-[1099px]:w-[min(330px,88vw)] max-[1099px]:shadow-e3
          min-[1100px]:sticky min-[1100px]:top-17 min-[1100px]:h-[calc(100vh-68px)]
          ${outlineOpen ? 'max-[1099px]:translate-x-0' : 'max-[1099px]:-translate-x-[102%]'}`}
        ref={railRef}
        aria-label="Course outline"
      >
        <header className="sticky top-0 z-2 flex flex-col gap-3 border-b border-outline-variant bg-surface-container p-4">
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary"
          >
            <Icon name="chevron-left" size={14} />
            {course.short}
          </Link>
          {!isWide && (
            <button
              type="button"
              className="absolute top-3 right-3 text-on-surface-variant"
              onClick={() => setOutlineOpen(false)}
              aria-label="Close outline"
            >
              <Icon name="close" size={16} />
            </button>
          )}
          <div className="flex items-center gap-3 font-mono text-xs text-on-surface-variant">
            <Progress ratio={progress.ratio} size="sm" />
            <span>
              {progress.done}/{progress.total}
            </span>
          </div>
        </header>

        <nav className="pb-12">
          {course.curriculum.map((mod, mi) => {
            const modDone = mod.lessons.filter((l) => isLessonDone(course.slug, l.id)).length
            const complete = modDone === mod.lessons.length

            return (
              <section key={mod.id}>
                <h3 className="flex items-center gap-2 px-4 pt-4 pb-2 text-xs font-medium">
                  <span className="font-mono text-primary">{String(mi + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">{mod.title}</span>
                  <span className={`font-mono text-[0.6875rem] font-normal ${complete ? 'text-ok' : 'text-outline'}`}>
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
                          className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-100 ${
                            isActive
                              ? 'bg-surface-lowest font-semibold text-on-surface shadow-[inset_3px_0_0_var(--m3-primary)]'
                              : 'text-on-surface-variant hover:bg-surface-high hover:text-on-surface'
                          }`}
                          onClick={() => goTo(lessons.findIndex((x) => x.id === l.id))}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          <Tick done={lDone} />
                          <span className={`min-w-0 flex-1 ${lDone ? 'text-outline' : ''}`}>{l.title}</span>
                          <span className="flex-none font-mono text-[0.6875rem] text-outline">
                            {formatDuration(l.minutes)}
                          </span>
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

      {outlineOpen && (
        <div
          className="fixed inset-0 top-17 z-98 animate-[fade_200ms_var(--ease)] bg-black/45 min-[1100px]:hidden"
          onClick={() => setOutlineOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-col">
        <div
          className="sticky top-17 z-3 flex items-center gap-4 border-b border-outline-variant bg-surface-lowest/92 px-6 py-3 backdrop-blur-md"
        >
          {!isWide && (
            <button
              type="button"
              className="grid place-items-center text-on-surface-variant"
              onClick={() => setOutlineOpen(true)}
              aria-label="Open outline"
            >
              <Icon name="list" size={17} />
            </button>
          )}
          <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
            <span className="font-mono text-primary">{String(moduleNo).padStart(2, '0')}</span>
            {moduleOf?.title}
          </span>
          <span className="flex-none font-mono text-xs text-outline">
            {activeIndex + 1} / {lessons.length}
          </span>
        </div>

        {/* Keyed on lesson id so the stage replays its entrance. */}
        <article className="w-full max-w-[900px] animate-[pagein_280ms_var(--ease)] p-6" key={active.id}>
          <div className="relative grid aspect-video place-items-center overflow-hidden rounded-lg bg-dark">
            <button
              type="button"
              className="grid size-18 place-items-center rounded-full bg-primary text-on-primary transition-[transform,background-color] duration-200 hover:scale-107 hover:bg-[var(--brand-hi)]"
              aria-label={`Play ${active.title}`}
            >
              {/* A triangle in a circle reads as off-centre when it is
                  measured centre — nudge it toward the point. */}
              <Icon name="play" size={22} filled className="ml-0.5" />
            </button>
            <span className="absolute bottom-4 font-mono text-xs text-white/40">
              Live session recording — placeholder
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-on-surface-variant">
            <KindTag kind={active.kind} showLabel />
            <span>{formatDuration(active.minutes)}</span>
            {done && (
              <Badge tone="ok" icon="check">
                Completed
              </Badge>
            )}
          </div>

          <h1 className="mt-3 mb-6 text-h2">{active.title}</h1>

          <div className="grid gap-8 min-[821px]:grid-cols-[minmax(0,1.6fr)_260px]">
            <div>
              <h2 className="mb-3 text-h3">In this {kindLabel(active.kind).toLowerCase()}</h2>
              <p className="mb-4 text-sm text-on-surface-variant">
                {moduleOf?.summary} This session runs {formatDuration(active.minutes)} and sits in{' '}
                <strong>{moduleOf?.title}</strong>, module {moduleNo} of {course.curriculum.length}.
              </p>
              <p className="mb-4 text-sm text-on-surface-variant">
                Every concept is followed by a guided assignment. Work through it before the next live session — the
                teaching assistant is available daily, and the point of the assignment is to get stuck somewhere useful.
              </p>

              <Wa message={waCourse(course.title)}>Stuck? Ask about this lesson</Wa>
            </div>

            <aside>
              <h2 className="mb-3 text-h3">Shortcuts</h2>
              <dl className="border-t border-outline-variant">
                {[
                  ['J', 'Next lesson'],
                  ['K', 'Previous'],
                  ['M', 'Mark done'],
                ].map(([key, label]) => (
                  <div key={key} className="flex gap-4 border-b border-outline-variant py-2 text-sm">
                    <dt className="w-10 flex-none">
                      <kbd className="inline-block min-w-[1.8em] rounded-xs border border-b-2 border-outline bg-surface-container px-1.5 py-0.5 text-center font-mono text-[0.6875rem]">
                        {key}
                      </kbd>
                    </dt>
                    <dd className="m-0 text-on-surface-variant">{label}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-6">
            <Button
              variant={done ? 'outline' : 'brand'}
              icon={done ? 'rotate' : 'check'}
              iconSide="left"
              onClick={done ? () => toggleLesson(course.slug, active.id) : completeAndAdvance}
            >
              {done ? 'Mark as not done' : 'Complete & continue'}
            </Button>

            <div className="flex gap-2">
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
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-ok/35 bg-ok-container p-6">
              {/* Surface, not white — success green is light in dark mode. */}
              <span className="grid size-11 flex-none place-items-center rounded-full bg-ok text-surface-lowest">
                <Icon name="award" size={20} />
              </span>
              <div className="flex min-w-[16ch] flex-1 flex-col">
                <strong>You finished {course.title}.</strong>
                <span className="text-sm text-on-surface-variant">
                  Every lesson complete. In a real batch your certificate would be issued at this point.
                </span>
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

const HUES = ['bg-primary', 'bg-tertiary', 'bg-ok', 'bg-[var(--brand-hi)]']

const CONFETTI = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  // Deterministic pseudo-scatter — repeatable and cheap.
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  duration: 1.9 + ((i * 7) % 12) / 10,
  hue: HUES[i % 4]!,
  drift: (((i * 29) % 40) - 20) / 10,
}))

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-900 overflow-hidden" aria-hidden="true">
      {CONFETTI.map((c) => (
        <i
          key={c.id}
          className={`absolute -top-[6%] h-3 w-[7px] rounded-xs ${c.hue} [animation-fill-mode:forwards] [animation-name:confetti-fall] [animation-timing-function:var(--ease)]`}
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
    <span className="grid flex-none place-items-center" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
        <circle
          cx="12"
          cy="12"
          r="8.5"
          strokeWidth="1.5"
          className={`fill-none transition-[stroke] duration-200 ${done ? 'stroke-ok' : 'stroke-outline'}`}
        />
        {/* Path length ≈ 17, so 18 covers it with a little slack. */}
        <path
          d="M7.8 12.4 10.8 15.4 16.4 9"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-none stroke-ok transition-[stroke-dashoffset] duration-400"
          strokeDasharray={18}
          strokeDashoffset={done ? 0 : 18}
        />
      </svg>
    </span>
  )
}
