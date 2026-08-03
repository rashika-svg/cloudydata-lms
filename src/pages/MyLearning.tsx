/* ============================================================
   My learning — courses you have joined, with progress.
   ============================================================ */

import { Link } from 'react-router-dom'
import { COURSES, COURSE_BY_SLUG, allLessons, formatDuration } from '../data/courses'
import { WA_GENERAL, whatsappLink } from '../data/site'
import { useApp } from '../store/app'
import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Cover, Empty, Progress, Ring, SectionHead } from '../components/ui/Primitives'

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
        <section className="phead">
          <div className="wrap">
            <h1>My learning</h1>
            <p>Courses you join appear here with your progress, saved in this browser.</p>
          </div>
        </section>

        <section className="section section--top">
          <div className="wrap">
            <Empty
              icon="book"
              title="You have not joined a course yet"
              body="Open any course and tap Enroll NOW to try the learning experience. For a real batch, message Ajay on WhatsApp."
            >
              <div className="empty__actions">
                <Button to="/courses" variant="brand" icon="arrow-right">
                  Browse courses
                </Button>
                <a className="wa" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={17} />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </Empty>

            <SectionHead title="Popular starting points" />
            <div className="grid grid--3">
              {COURSES.slice(0, 3).map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <h1>My learning</h1>
          <p>
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} in progress. Everything here is stored in this
            browser only.
          </p>
        </div>
      </section>

      {resume && (
        <section className="wrap">
          <div className="resume rise">
            <div className="resume__cover">
              <Cover slug={resume.course.slug} accent={resume.course.accent} />
            </div>
            <div className="resume__body">
              <span className="resume__kicker">
                <Icon name="play" size={12} filled /> Continue where you left off
              </span>
              <h2>{resume.lesson.title}</h2>
              <p>
                {resume.course.title} · {resume.mod?.title} · {formatDuration(resume.lesson.minutes)}
              </p>
              <Progress ratio={resume.progress.ratio} showValue />
            </div>
            <div className="resume__side">
              <Ring ratio={resume.progress.ratio} size={78} stroke={6} />
              <Button to={`/learn/${resume.course.slug}?lesson=${resume.lesson.id}`} variant="brand" icon="arrow-right">
                Resume
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="section section--top">
        <div className="wrap">
          <div className="mysum">
            <div>
              <strong>{Math.round(overall * 100)}%</strong>
              <span>Overall progress</span>
            </div>
            <div>
              <strong>{totals.done}</strong>
              <span>Lessons completed</span>
            </div>
            <div>
              <strong>{totals.total - totals.done}</strong>
              <span>Lessons remaining</span>
            </div>
            <div>
              <strong>{formatDuration(totals.minutes)}</strong>
              <span>Time invested</span>
            </div>
            <div>
              <strong>{totals.complete}</strong>
              <span>Courses finished</span>
            </div>
          </div>

          <SectionHead
            title="Your courses"
            action={
              <Button to="/courses" variant="outline" size="sm" icon="plus" iconSide="left">
                Add a course
              </Button>
            }
          />

          <div className="grid grid--3">
            {courses.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} enrolledView />
            ))}
          </div>

          <p className="note">
            This is a demo of the learning experience. To join a real live batch, message Ajay on WhatsApp — or{' '}
            <Link to="/courses">browse the catalogue</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
