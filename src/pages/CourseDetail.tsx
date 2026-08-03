/* ============================================================
   Course detail.

   Sticky enrollment card with both real calls to action: "Enroll NOW"
   (demo state) and a genuine WhatsApp deep link with the course name
   pre-filled — which is how enrollment actually works on the real site.
   ============================================================ */

import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { COURSES, formatDuration, formatINR, getCourse, lessonCount, totalMinutes } from '../data/courses'
import { CONTACT, FOUNDER, waCourse } from '../data/site'
import { photoFor } from '../data/photos'
import { useApp } from '../store/app'
import { AccordionItem } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { CourseCard } from '../components/CourseCard'
import { Icon } from '../components/ui/Icon'
import { Grid, Section, Wrap } from '../components/ui/Layout'
import { Avatar, Cover, KindTag, Progress, Rating, SectionHead, kindLabel } from '../components/ui/Primitives'
import { Wa } from '../components/ui/Wa'

/* The hero is a dark band in both themes, so its chips are opacity
   steps on white rather than surface roles. */
const CHIP = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'
const PANEL = 'rounded-lg bg-surface-low p-6'

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const course = getCourse(slug)
  const { isEnrolled, enroll, leave, resetCourse, progressFor, isLessonDone, pushToast } = useApp()

  // Brief success state on the enroll button, so the click is
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

  const onEnroll = () => {
    setJustEnrolled(true)
    enroll(course.slug)
    pushToast('Added to My learning', {
      detail: 'Demo enrollment — message on WhatsApp to join a real batch.',
      tone: 'success',
    })
  }

  return (
    <>
      {/* ---- Hero ------------------------------------- */}
      <section className="bg-dark pt-8 pb-[calc(4.5rem+40px)] text-on-dark">
        <Wrap className="flex max-w-[820px] flex-col items-start gap-4">
          <nav className="flex items-center gap-1.5 text-xs text-on-dark/55" aria-label="Breadcrumb">
            <Link to="/courses" className="hover:text-white hover:underline hover:underline-offset-[3px]">
              Courses
            </Link>
            <Icon name="chevron-right" size={13} />
            <Link
              to={`/courses?cat=${encodeURIComponent(course.category)}`}
              className="hover:text-white hover:underline hover:underline-offset-[3px]"
            >
              {course.category}
            </Link>
          </nav>

          <div className="flex flex-wrap gap-2">
            <span className={`${CHIP} bg-white/12 text-white`}>
              <i className="size-1.5 animate-[livepulse_1.8s_var(--ease)_infinite] rounded-full bg-primary" aria-hidden="true" />
              Live classes
            </span>
            <span className={`${CHIP} bg-white/12 text-white`}>{course.level}</span>
            {enrolled && (
              <span className={`${CHIP} bg-ok text-white`}>
                <Icon name="check" size={12} strokeWidth={2.6} /> Enrolled
              </span>
            )}
          </div>

          <h1 className="text-h1">{course.title}</h1>
          <p className="max-w-[64ch] text-on-dark/72">{course.description}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-dark/75">
            <Rating value={course.rating} learners={course.learners} tone="onDark" />
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={15} /> {course.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="video" size={15} /> {course.mode}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="list" size={15} /> {lessons} lessons · {formatDuration(minutes)}
            </span>
          </div>

          <p className="text-sm text-on-dark/60">
            Taught by <strong className="text-white">{FOUNDER.name}</strong> — {FOUNDER.experience} in analytics and
            data science
          </p>
        </Wrap>
      </section>

      {/* ---- Body ------------------------------------- */}
      <Wrap className="-mt-10 grid items-start gap-8 pb-18 wide:grid-cols-[minmax(0,1fr)_360px]">
        {/* The card comes first on narrow screens — the price is the
            question people arrive with. */}
        <aside className="max-wide:order-first wide:sticky wide:top-21">
          <div className="overflow-hidden rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset shadow-e3">
            <div className="relative">
              <Cover slug={course.slug} accent={course.accent} priority />
              {photo && (
                <span className="absolute right-1.5 bottom-1.5 z-3 rounded-xs bg-black/55 px-1.5 py-0.5 text-[10px] text-white/75">
                  Photo: {photo.by} / Pexels
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 p-6">
              {enrolled ? (
                <>
                  <div className="flex items-center gap-2 font-semibold text-ok">
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
                  <div className="flex flex-wrap items-baseline gap-3">
                    <strong className="text-[1.9rem] font-bold tracking-[-0.026em]">
                      {formatINR(course.priceINR)}
                    </strong>
                    <s className="text-sm text-outline">{formatINR(course.mrpINR)}</s>
                    <em className="text-xs font-medium text-ok not-italic">{off}% off</em>
                  </div>
                  <Button block size="lg" variant="brand" onClick={onEnroll}>
                    Enroll NOW
                  </Button>
                </>
              )}

              <Wa message={waCourse(course.title)} block>
                Get details on WhatsApp
              </Wa>

              <p className="text-center text-[0.6875rem] leading-relaxed text-outline">
                Real batches are confirmed over WhatsApp — {CONTACT.phoneDisplay}. The button above is a demo enrollment.
              </p>

              <ul className="mt-2 flex flex-col gap-3 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
                {(
                  [
                    ['video', course.mode],
                    ['list', `${lessons} lessons in ${course.curriculum.length} modules`],
                    ['box', `${course.projects} real-world projects`],
                    ['users', 'Daily one-on-one doubt clearing'],
                    ['award', 'Certificate on completion'],
                  ] as const
                ).map(([icon, text]) => (
                  <li key={text} className="flex items-center gap-3">
                    <Icon name={icon} size={15} className="flex-none text-outline" /> {text}
                  </li>
                ))}
              </ul>

              {enrolled && (
                <div className="flex justify-center gap-4 border-t border-outline-variant pt-3">
                  <button
                    type="button"
                    className="text-xs text-outline underline underline-offset-[3px] hover:text-primary"
                    onClick={() => {
                      resetCourse(course.slug)
                      pushToast('Progress reset', { detail: course.title, tone: 'warn' })
                    }}
                  >
                    Reset progress
                  </button>
                  <button
                    type="button"
                    className="text-xs text-outline underline underline-offset-[3px] hover:text-primary"
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

        <div className="flex min-w-0 flex-col gap-6">
          {enrolled && progress.done > 0 && (
            <section className="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset p-4 shadow-e1">
              <div className="flex flex-col">
                <strong className="text-sm">Your progress</strong>
                <span className="text-xs text-on-surface-variant">
                  {progress.done} of {progress.total} lessons complete
                </span>
              </div>
              <div className="min-w-45 flex-1">
                <Progress ratio={progress.ratio} showValue />
              </div>
              <Button to={`/learn/${course.slug}`} size="sm" variant="brand" icon="arrow-right">
                Continue
              </Button>
            </section>
          )}

          <section className={PANEL}>
            <h2 className="mb-4 text-h3">What you will learn</h2>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(290px,100%),1fr))] gap-x-6 gap-y-3">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Icon name="check" size={15} strokeWidth={2.2} className="mt-[3px] flex-none text-ok" />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section className={PANEL}>
            <h2 className="mb-4 text-h3">Tools you will use</h2>
            <div className="flex flex-wrap gap-2">
              {course.tools.map((t) => (
                <span
                  className="rounded-md border border-outline-variant bg-surface-container px-3 py-1.5 font-mono text-xs text-on-surface-variant transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/16"
                  key={t}
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg bg-surface-low">
            <div className="border-b border-outline-variant px-6 pt-6 pb-4">
              <h2 className="text-h3">Course content</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {course.curriculum.length} modules · {lessons} lessons · {formatDuration(minutes)} total
              </p>
            </div>

            <div className="p-4">
              {course.curriculum.map((mod, mi) => {
                const modMinutes = mod.lessons.reduce((n, l) => n + l.minutes, 0)
                const modDone = enrolled ? mod.lessons.filter((l) => isLessonDone(course.slug, l.id)).length : 0

                return (
                  <AccordionItem
                    key={mod.id}
                    defaultOpen={mi === 0}
                    title={
                      <>
                        <span className="flex-none font-mono text-xs text-primary">
                          {String(mi + 1).padStart(2, '0')}
                        </span>
                        {mod.title}
                      </>
                    }
                    meta={
                      <>
                        {enrolled && (
                          <span className={modDone === mod.lessons.length ? 'text-ok' : ''}>
                            {modDone}/{mod.lessons.length}
                          </span>
                        )}
                        <span>
                          {mod.lessons.length} lessons · {formatDuration(modMinutes)}
                        </span>
                      </>
                    }
                  >
                    <p className="mb-3 text-sm text-on-surface-variant">{mod.summary}</p>
                    <ul className="flex flex-col">
                      {mod.lessons.map((l) => {
                        const done = enrolled && isLessonDone(course.slug, l.id)
                        return (
                          <li
                            key={l.id}
                            className="flex items-center gap-3 border-t border-outline-variant py-2 text-sm"
                          >
                            <Icon
                              name={done ? 'check-circle' : 'circle'}
                              size={15}
                              className={`flex-none ${done ? 'text-ok' : 'text-outline'}`}
                            />
                            <KindTag kind={l.kind} />
                            {enrolled ? (
                              <Link
                                to={`/learn/${course.slug}?lesson=${l.id}`}
                                className="min-w-0 flex-1 hover:text-primary hover:underline hover:underline-offset-[3px]"
                              >
                                {l.title}
                              </Link>
                            ) : (
                              <span className={`min-w-0 flex-1 ${done ? 'text-outline' : ''}`}>{l.title}</span>
                            )}
                            <span className="flex-none text-xs text-outline">{kindLabel(l.kind)}</span>
                            <span className="min-w-[3.6em] flex-none text-right font-mono text-xs text-outline">
                              {formatDuration(l.minutes)}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionItem>
                )
              })}
            </div>
          </section>

          <section className={PANEL}>
            <h2 className="mb-4 text-h3">Your instructor</h2>
            <div className="flex gap-4">
              <Avatar initials={FOUNDER.initials} size={64} />
              <div className="flex flex-col gap-0.5">
                <strong className="text-[1.05rem]">{FOUNDER.name}</strong>
                <span className="text-sm text-primary">{FOUNDER.role}</span>
                <p className="mt-3 text-sm text-on-surface-variant">{FOUNDER.bio}</p>
                <div className="mt-3 flex gap-4">
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-primary"
                  >
                    <Icon name="linkedin" size={15} /> LinkedIn
                  </a>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-primary"
                  >
                    <Icon name="instagram" size={15} /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Wrap>

      {/* ---- Mobile bar ------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-99 flex items-center gap-3 border-t border-outline-variant bg-surface-lowest/95 px-(--pad) py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md min-[721px]:hidden">
        <div className="flex flex-1 flex-col">
          <strong className="text-[1.1rem] font-bold">{formatINR(course.priceINR)}</strong>
          <span className="text-[0.6875rem] text-on-surface-variant">{course.durationLabel}</span>
        </div>
        <Wa message={waCourse(course.title)} size="sm">
          WhatsApp
        </Wa>
        {enrolled ? (
          <Button to={`/learn/${course.slug}`} variant="brand" icon="arrow-right">
            Continue
          </Button>
        ) : (
          <Button variant="brand" onClick={onEnroll}>
            Enroll
          </Button>
        )}
      </div>

      {/* ---- Related --------------------------------- */}
      {related.length > 0 && (
        <Section tone="alt">
          <Wrap>
            <SectionHead eyebrow="Keep exploring" title={`More in ${course.category}`} />
            <Grid>
              {related.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </Grid>
          </Wrap>
        </Section>
      )}
    </>
  )
}
