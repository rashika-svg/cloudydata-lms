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
import { whatsappLink } from '../data/site'
import { Icon, type IconName } from './ui/Icon'
import { Cover } from './ui/Primitives'

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
    <div className="finder" id="finder">
      <div className="finder__head">
        <span className="finder__eyebrow">Not sure which track?</span>
        <h2>Answer three questions.</h2>
        <p>
          You will get one honest recommendation — and you can take the answers straight to WhatsApp instead of
          starting the conversation from scratch.
        </p>
      </div>

      {/* Progress across the three steps. */}
      <ol className="finder__steps" aria-label="Progress">
        {QUESTIONS.map((q, i) => (
          <li
            key={q.key}
            className={`${answers[q.key] ? 'is-done' : ''} ${i === step ? 'is-current' : ''}`}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="finder__stepnum">{answers[q.key] ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}</span>
            <span className="finder__steplabel">{['Starting point', 'Goal', 'Time'][i]}</span>
          </li>
        ))}
      </ol>

      <div className="finder__body">
        {!done && current && (
          /* Keyed so each question animates in rather than snapping. */
          <div className="finder__q" key={current.key}>
            <h3>{current.title}</h3>
            <p>{current.sub}</p>

            <div className="finder__opts">
              {current.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`finder__opt ${answers[current.key] === o.value ? 'is-on' : ''}`}
                  onClick={() => pick(current.key, o.value)}
                >
                  <span className="finder__opticon">
                    <Icon name={o.icon} size={17} />
                  </span>
                  <span>
                    <strong>{o.label}</strong>
                    <span>{o.hint}</span>
                  </span>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button type="button" className="finder__back" onClick={() => setStep((s) => s - 1)}>
                <Icon name="chevron-left" size={14} /> Back
              </button>
            )}
          </div>
        )}

        {done && top && (
          <div className="finder__result">
            <div className="finder__pick">
              <span className="finder__picklabel">Best fit</span>

              <Link to={`/courses/${top.course.slug}`} className="finder__pickcard">
                <span className="finder__pickcover">
                  <Cover slug={top.course.slug} accent={top.course.accent} />
                </span>
                <span className="finder__pickbody">
                  <strong>{top.course.title}</strong>
                  <span className="finder__pickmeta">
                    {top.course.durationLabel} · {top.course.level} · {formatINR(top.course.priceINR)}
                  </span>
                  <ul className="finder__why">
                    {top.reasons.map((r) => (
                      <li key={r}>
                        <Icon name="check" size={13} strokeWidth={2.4} /> {r}
                      </li>
                    ))}
                  </ul>
                </span>
              </Link>

              <div className="finder__actions">
                <Link to={`/courses/${top.course.slug}`} className="btn btn--brand">
                  View this course
                  <Icon name="arrow-right" size={15} className="btn__icon" />
                </Link>
                <a
                  className="wa"
                  href={whatsappLink(waMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="whatsapp" size={17} />
                  <span>Check with Ajay</span>
                </a>
                <button type="button" className="finder__again" onClick={restart}>
                  <Icon name="rotate" size={13} /> Start again
                </button>
              </div>
            </div>

            {ranked.length > 1 && (
              <div className="finder__alts">
                <span className="finder__altlabel">Also worth a look</span>
                {ranked.slice(1).map(({ course }) => (
                  <Link key={course.slug} to={`/courses/${course.slug}`} className="finder__alt">
                    <strong>{course.title}</strong>
                    <span>
                      {course.durationLabel} · {formatINR(course.priceINR)}
                    </span>
                    <Icon name="chevron-right" size={15} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
