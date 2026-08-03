/* ============================================================
   "Find your course" — a three-question recommender.

   Ten tracks is too many to choose between cold, and the real
   CloudyData pitch is "message me and I'll tell you honestly which
   one fits". This does the first pass in the browser, then hands off
   to WhatsApp with the answers already written into the message — so
   the conversation starts with context instead of "hi".

   Scoring is transparent on purpose: each answer contributes a
   weighted nudge and the result explains itself. A black box that
   always recommends the most expensive track would be worse than no
   recommender at all.
   ============================================================ */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COURSES, formatINR, type Course } from '../data/courses'
import { Button } from './ui/Button'
import { Icon, type IconName } from './ui/Icon'
import { Cover } from './ui/Primitives'
import { Wa } from './ui/Wa'

/* Quiet tertiary action — reachable without competing with the two
   real calls to action beside it. */
const AGAIN =
  'inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant ' +
  'transition-colors duration-200 hover:text-primary'

type Level = 'new' | 'some' | 'working'
type Goal = 'analyst' | 'scientist' | 'engineer' | 'marketing' | 'security' | 'bi'
type Pace = 'short' | 'medium' | 'long'

interface Answers {
  level?: Level
  goal?: Goal
  pace?: Pace
}

const QUESTIONS: {
  key: keyof Answers
  title: string
  sub: string
  options: { value: string; label: string; hint: string; icon: IconName }[]
}[] = [
  {
    key: 'level',
    title: 'Where are you starting from?',
    sub: 'There is no wrong answer — it only changes which track is the sensible entry point.',
    options: [
      { value: 'new', label: 'Completely new', hint: 'No coding, no data experience', icon: 'user' },
      { value: 'some', label: 'Some exposure', hint: 'Excel, a little SQL or Python', icon: 'layers' },
      { value: 'working', label: 'Already working with data', hint: 'Want to go deeper or specialise', icon: 'chart' },
    ],
  },
  {
    key: 'goal',
    title: 'What job do you want next?',
    sub: 'Pick the title you would want on your offer letter.',
    options: [
      { value: 'analyst', label: 'Data Analyst', hint: 'SQL, dashboards, insight', icon: 'chart' },
      { value: 'scientist', label: 'Data Scientist', hint: 'Statistics, machine learning', icon: 'target' },
      { value: 'engineer', label: 'Data Engineer', hint: 'Pipelines, warehouses, cloud', icon: 'layers' },
      { value: 'bi', label: 'BI / Business Analyst', hint: 'Power BI, Tableau, reporting', icon: 'clipboard' },
      { value: 'marketing', label: 'Digital Marketer', hint: 'SEO, ads, growth', icon: 'flame' },
      { value: 'security', label: 'Security Analyst', hint: 'Offensive and defensive security', icon: 'lock' },
    ],
  },
  {
    key: 'pace',
    title: 'How much time can you give it?',
    sub: 'Live classes run two or three evenings a week either way.',
    options: [
      { value: 'short', label: '3 – 4 months', hint: 'Fastest route to job-ready', icon: 'clock' },
      { value: 'medium', label: 'Around 6 months', hint: 'Room to go properly deep', icon: 'calendar' },
      { value: 'long', label: '8 months or more', hint: 'The widest possible ground', icon: 'award' },
    ],
  },
]

/** Which goal maps to which course, and how strongly. */
const GOAL_WEIGHTS: Record<Goal, Record<string, number>> = {
  analyst: { 'data-analytics-one-on-one': 10, 'ai-driven-data-analytics': 9, 'data-super-star': 5 },
  scientist: { 'data-science': 10, 'data-super-star': 7, 'ai-driven-data-analytics': 4 },
  engineer: { 'data-engineering': 10, 'data-engineering-gen-ai': 8, 'data-super-star': 5 },
  bi: { 'business-analytics-gen-ai': 10, 'data-analytics-one-on-one': 6, 'ai-driven-data-analytics': 4 },
  marketing: { 'digital-marketing': 10, 'advanced-digital-marketing-gen-ai': 9 },
  security: { 'cyber-security-ethical-hacking': 12 },
}

function scoreCourse(course: Course, a: Answers): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  if (a.goal) {
    const w = GOAL_WEIGHTS[a.goal][course.slug] ?? 0
    score += w
    if (w >= 9) reasons.push('Built for exactly the role you picked')
    else if (w > 0) reasons.push('Covers a good part of that role')
  }

  if (a.level) {
    const beginnerFriendly = course.level === 'Beginner' || course.level === 'Beginner → Intermediate'
    const advanced = course.level === 'Intermediate → Advanced' || course.level === 'Advanced'

    if (a.level === 'new') {
      if (beginnerFriendly) {
        score += 4
        reasons.push('Starts from first principles — no coding assumed')
      }
      if (advanced) score -= 6
    } else if (a.level === 'working') {
      if (advanced || course.level === 'Intermediate') {
        score += 3
        reasons.push('Pitched at people already working with data')
      }
    } else if (beginnerFriendly) {
      score += 2
    }
  }

  if (a.pace) {
    const m = course.months ?? 5
    const want = a.pace === 'short' ? 4 : a.pace === 'medium' ? 6 : 8
    const gap = Math.abs(m - want)
    score += Math.max(0, 4 - gap * 1.5)
    if (gap === 0) reasons.push(`Runs ${course.durationLabel}, which matches your time`)
  }

  // A gentle nudge toward the cheaper option when two tracks tie —
  // affordability is the brand's whole argument.
  score += (1 - course.priceINR / 82000) * 0.8

  return { score, reasons: reasons.slice(0, 3) }
}

export function CourseFinder() {
  const [answers, setAnswers] = useState<Answers>({})
  const [step, setStep] = useState(0)

  const done = QUESTIONS.every((q) => answers[q.key] !== undefined)

  const ranked = useMemo(() => {
    if (!done) return []
    return COURSES.map((c) => ({ course: c, ...scoreCourse(c, answers) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
  }, [answers, done])

  const top = ranked[0]

  const pick = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setStep((s) => Math.min(s + 1, QUESTIONS.length))
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
  }

  /* Hand the answers to WhatsApp so the conversation starts with
     context rather than "hi". */
  const waMessage = () => {
    if (!top) return ''
    const levelText = QUESTIONS[0]!.options.find((o) => o.value === answers.level)?.label
    const goalText = QUESTIONS[1]!.options.find((o) => o.value === answers.goal)?.label
    const paceText = QUESTIONS[2]!.options.find((o) => o.value === answers.pace)?.label
    return `Hi Ajay, I used the course finder on your site.

Starting point: ${levelText}
Goal: ${goalText}
Time available: ${paceText}

It suggested ${top.course.title}. Does that sound right, and when is the next batch?`
  }

  const current = QUESTIONS[step]

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset shadow-e2" id="finder">
      <div className="border-b border-outline-variant px-8 pt-8 pb-6 text-center">
        <span className="mb-2 block font-mono text-[0.6875rem] tracking-[0.09em] text-primary uppercase">
          Not sure which track?
        </span>
        <h2 className="text-h2">Answer three questions.</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-sm text-on-surface-variant">
          You will get one honest recommendation — and you can take the answers straight to WhatsApp instead of starting
          the conversation from scratch.
        </p>
      </div>

      {/* Progress across the three steps. */}
      <ol
        className="flex flex-wrap justify-center gap-6 border-b border-outline-variant bg-surface-container px-6 py-4"
        aria-label="Progress"
      >
        {QUESTIONS.map((q, i) => (
          <li
            key={q.key}
            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
              answers[q.key] ? 'text-on-surface' : 'text-outline'
            }`}
            aria-current={i === step ? 'step' : undefined}
          >
            <span
              className={`grid size-5.5 place-items-center rounded-full border font-mono text-[0.6875rem] transition-[background-color,border-color,color] duration-200 ${
                answers[q.key]
                  ? 'border-primary bg-primary text-on-primary'
                  : i === step
                    ? 'border-primary text-primary'
                    : 'border-outline'
              }`}
            >
              {answers[q.key] ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
            </span>
            <span>{['Starting point', 'Goal', 'Time'][i]}</span>
          </li>
        ))}
      </ol>

      <div className="p-8">
        {!done && current && (
          /* Keyed so each question animates in rather than snapping. */
          <div className="rise text-center" key={current.key}>
            <h3 className="text-h3">{current.title}</h3>
            <p className="mx-auto mt-2 mb-6 max-w-[56ch] text-sm text-on-surface-variant">{current.sub}</p>

            <div className="mx-auto grid max-w-195 grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
              {current.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`group flex items-center gap-3 rounded-md border p-4 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-e2 ${
                    answers[current.key] === o.value ? 'border-primary bg-primary/8' : 'border-outline bg-surface-lowest'
                  }`}
                  onClick={() => pick(current.key, o.value)}
                >
                  <span className="grid size-9 flex-none place-items-center rounded-md bg-surface-container text-on-surface-variant transition-colors duration-200 group-hover:bg-primary/16 group-hover:text-primary">
                    <Icon name={o.icon} size={17} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <strong className="text-sm">{o.label}</strong>
                    <span className="text-xs text-on-surface-variant">{o.hint}</span>
                  </span>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button type="button" className={`${AGAIN} mt-6`} onClick={() => setStep((s) => s - 1)}>
                <Icon name="chevron-left" size={14} /> Back
              </button>
            )}
          </div>
        )}

        {done && top && (
          <div className="rise">
            <span className="mb-3 block font-mono text-[0.6875rem] tracking-[0.09em] text-primary uppercase">
              Best fit
            </span>

            <Link
              to={`/courses/${top.course.slug}`}
              className="grid gap-6 rounded-lg border border-primary/16 bg-primary/8 p-4 transition-colors duration-200 hover:border-primary min-[620px]:grid-cols-[200px_minmax(0,1fr)]"
            >
              <span className="overflow-hidden rounded-md">
                <Cover slug={top.course.slug} accent={top.course.accent} />
              </span>
              <span className="flex min-w-0 flex-col gap-2">
                <strong className="text-h3">{top.course.title}</strong>
                <span className="text-xs text-on-surface-variant">
                  {top.course.durationLabel} · {top.course.level} · {formatINR(top.course.priceINR)}
                </span>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                  {top.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-on-surface-variant">
                      <Icon name="check" size={13} strokeWidth={2.4} className="mt-[3px] flex-none text-ok" /> {r}
                    </li>
                  ))}
                </ul>
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button to={`/courses/${top.course.slug}`} variant="brand" icon="arrow-right">
                View this course
              </Button>
              <Wa message={waMessage()}>Check with Ajay</Wa>
              <button type="button" className={`${AGAIN} ml-auto`} onClick={restart}>
                <Icon name="rotate" size={13} /> Start again
              </button>
            </div>

            {ranked.length > 1 && (
              <div className="mt-8 border-t border-outline-variant pt-6">
                <span className="mb-3 block font-mono text-[0.6875rem] tracking-[0.09em] text-outline uppercase">
                  Also worth a look
                </span>
                <div className="flex flex-col gap-2">
                  {ranked.slice(1).map(({ course }) => (
                    <Link
                      key={course.slug}
                      to={`/courses/${course.slug}`}
                      className="flex items-center gap-3 rounded-md border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset px-4 py-3 transition-[border-color,transform] duration-200 hover:translate-x-0.5 hover:border-outline"
                    >
                      <strong className="min-w-0 flex-1 text-sm">{course.title}</strong>
                      <span className="text-xs whitespace-nowrap text-on-surface-variant">
                        {course.durationLabel} · {formatINR(course.priceINR)}
                      </span>
                      <Icon name="chevron-right" size={15} className="text-outline" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
