/* ============================================================
   My learning — courses you have joined, with progress.
   ============================================================ */

import { Link } from 'react-router-dom'
import { COURSES, COURSE_BY_SLUG, allLessons, formatDuration } from '../data/courses'
import { WA_GENERAL } from '../data/site'
import { useApp } from '../store/app'
import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Grid, PageHead, Section, Wrap } from '../components/ui/Layout'
import { Cover, Empty, Progress, Ring, SectionHead } from '../components/ui/Primitives'
import { Wa } from '../components/ui/Wa'

export default function MyLearning() {
  const { enrolled, completed, progressFor, lastLessonFor } = useApp()

  const courses = enrolled
    .map((slug) => COURSE_BY_SLUG.get(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const totals = courses.reduce(
    (acc, c) => {
      const p = progressFor(c.slug)
      acc.done += p.done
      acc.total += p.total
      if (p.complete) acc.complete += 1
      const doneIds = new Set(completed[c.slug] ?? [])
      acc.minutes += allLessons(c)
        .filter((l) => doneIds.has(l.id))
        .reduce((n, l) => n + l.minutes, 0)
      return acc
    },
    { done: 0, total: 0, complete: 0, minutes: 0 },
  )

  const overall = totals.total === 0 ? 0 : totals.done / totals.total

  const resume = (() => {
    for (const course of courses) {
      const p = progressFor(course.slug)
      if (p.complete) continue
      const done = new Set(completed[course.slug] ?? [])
      const lessons = allLessons(course)
      const lastId = lastLessonFor(course.slug)
      const lesson =
        (lastId && !done.has(lastId) ? lessons.find((l) => l.id === lastId) : undefined) ??
        lessons.find((l) => !done.has(l.id))
      if (!lesson) continue
      const mod = course.curriculum.find((m) => m.lessons.some((l) => l.id === lesson.id))
      return { course, lesson, mod, progress: p }
    }
    return undefined
  })()

  if (courses.length === 0) {
    return (
      <>
        <PageHead title="My learning">
          Courses you join appear here with your progress, saved in this browser.
        </PageHead>

        <Section top>
          <Wrap>
            <Empty
              icon="book"
              title="You have not joined a course yet"
              body="Open any course and tap Enroll NOW to try the learning experience. For a real batch, message Ajay on WhatsApp."
            >
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <Button to="/courses" variant="brand" icon="arrow-right">
                  Browse courses
                </Button>
                <Wa message={WA_GENERAL}>Ask on WhatsApp</Wa>
              </div>
            </Empty>

            <SectionHead title="Popular starting points" />
            <Grid>
              {COURSES.slice(0, 3).map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </Grid>
          </Wrap>
        </Section>
      </>
    )
  }

  return (
    <>
      <PageHead title="My learning">
        {courses.length} {courses.length === 1 ? 'course' : 'courses'} in progress. Everything here is stored in this
        browser only.
      </PageHead>

      {resume && (
        <Wrap>
          <div className="rise mt-8 grid items-center gap-6 rounded-lg border border-outline-variant bg-surface-lowest p-4 shadow-e2 min-[720px]:grid-cols-[200px_minmax(0,1fr)_auto]">
            <div className="overflow-hidden rounded-md">
              <Cover slug={resume.course.slug} accent={resume.course.accent} />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.09em] text-primary uppercase">
                <Icon name="play" size={12} filled /> Continue where you left off
              </span>
              <h2 className="text-[1.3rem]">{resume.lesson.title}</h2>
              <p className="text-xs text-on-surface-variant">
                {resume.course.title} · {resume.mod?.title} · {formatDuration(resume.lesson.minutes)}
              </p>
              <Progress ratio={resume.progress.ratio} showValue />
            </div>

            <div className="flex flex-col items-center gap-3">
              <Ring ratio={resume.progress.ratio} size={78} stroke={6} />
              <Button to={`/learn/${resume.course.slug}?lesson=${resume.lesson.id}`} variant="brand" icon="arrow-right">
                Resume
              </Button>
            </div>
          </div>
        </Wrap>
      )}

      <Section top>
        <Wrap>
          <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 rounded-lg border border-outline-variant bg-surface-lowest p-6">
            {[
              { value: `${Math.round(overall * 100)}%`, label: 'Overall progress' },
              { value: totals.done, label: 'Lessons completed' },
              { value: totals.total - totals.done, label: 'Lessons remaining' },
              { value: formatDuration(totals.minutes), label: 'Time invested' },
              { value: totals.complete, label: 'Courses finished' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <strong className="text-[1.55rem] font-bold tracking-[-0.026em] tabular-nums">{s.value}</strong>
                <span className="text-xs text-on-surface-variant">{s.label}</span>
              </div>
            ))}
          </div>

          <SectionHead
            title="Your courses"
            action={
              <Button to="/courses" variant="outline" size="sm" icon="plus" iconSide="left">
                Add a course
              </Button>
            }
          />

          <Grid>
            {courses.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} enrolledView />
            ))}
          </Grid>

          <p className="mt-6 text-xs text-outline">
            This is a demo of the learning experience. To join a real live batch, message Ajay on WhatsApp — or{' '}
            <Link to="/courses" className="text-primary underline underline-offset-[3px]">
              browse the catalogue
            </Link>
            .
          </p>
        </Wrap>
      </Section>
    </>
  )
}
