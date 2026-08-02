/* ============================================================
   Application state.

   No backend: enrolments, lesson progress, the resume point and the
   colour theme live in localStorage and sync across tabs.

   Enrolment here is a demo action. On the real site you enrol by
   messaging Ajay on WhatsApp — the button that does that is a real
   deep link; this state only powers the student area.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { COURSE_BY_SLUG, allLessons, lessonCount } from '../data/courses'
import { usePersistentState } from '../hooks/util'

export type ToastTone = 'info' | 'success' | 'warn'

export interface Toast {
  id: number
  message: string
  detail?: string
  tone: ToastTone
}

export interface CourseProgress {
  done: number
  total: number
  ratio: number
  pct: number
  complete: boolean
}

type Theme = 'light' | 'dark'

interface AppValue {
  enrolled: string[]
  isEnrolled: (slug: string) => boolean
  enrol: (slug: string) => void
  leave: (slug: string) => void

  completed: Record<string, string[]>
  isLessonDone: (slug: string, lessonId: string) => boolean
  toggleLesson: (slug: string, lessonId: string) => void
  setLessonDone: (slug: string, lessonId: string, done: boolean) => void
  resetCourse: (slug: string) => void
  progressFor: (slug: string) => CourseProgress
  lastLessonFor: (slug: string) => string | undefined
  noteLastLesson: (slug: string, lessonId: string) => void

  theme: Theme
  toggleTheme: () => void

  toasts: Toast[]
  pushToast: (message: string, opts?: { detail?: string; tone?: ToastTone }) => void
  dismissToast: (id: number) => void
}

const AppContext = createContext<AppValue | null>(null)

const KEY = {
  enrolled: 'cd.enrolled.v5',
  completed: 'cd.completed.v5',
  last: 'cd.last.v5',
  // Bumped so the restored data-lab theme is what you land on, rather
  // than a previously-persisted light preference.
  theme: 'cd.theme.v6',
} as const

const TOAST_MS = 4600

export function AppProvider({ children }: { children: ReactNode }) {
  const [enrolled, setEnrolled] = usePersistentState<string[]>(KEY.enrolled, [])
  const [completed, setCompleted] = usePersistentState<Record<string, string[]>>(KEY.completed, {})
  const [lastLesson, setLastLesson] = usePersistentState<Record<string, string>>(KEY.last, {})
  const [theme, setTheme] = usePersistentState<Theme>(KEY.theme, 'dark')

  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, number>())

  /* ---- Theme ------------------------------------------- */

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#101118' : '#faf9f6')
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [setTheme])

  /* ---- Toasts ------------------------------------------ */

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const pushToast = useCallback<AppValue['pushToast']>((message, { detail, tone = 'info' } = {}) => {
    const id = nextId.current++
    // Cap the stack — three is the most anyone reads.
    setToasts((prev) => [...prev.slice(-2), { id, message, detail, tone }])
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      timers.current.delete(id)
    }, TOAST_MS)
    timers.current.set(id, timer)
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((t) => window.clearTimeout(t))
      pending.clear()
    }
  }, [])

  /* ---- Enrolment --------------------------------------- */

  const isEnrolled = useCallback((slug: string) => enrolled.includes(slug), [enrolled])

  const enrol = useCallback(
    (slug: string) => setEnrolled((prev) => (prev.includes(slug) ? prev : [...prev, slug])),
    [setEnrolled],
  )

  const leave = useCallback(
    (slug: string) => setEnrolled((prev) => prev.filter((s) => s !== slug)),
    [setEnrolled],
  )

  /* ---- Progress ---------------------------------------- */

  const isLessonDone = useCallback(
    (slug: string, lessonId: string) => Boolean(completed[slug]?.includes(lessonId)),
    [completed],
  )

  const setLessonDone = useCallback<AppValue['setLessonDone']>(
    (slug, lessonId, done) => {
      setCompleted((prev) => {
        const current = prev[slug] ?? []
        const has = current.includes(lessonId)
        if (done === has) return prev
        return {
          ...prev,
          [slug]: done ? [...current, lessonId] : current.filter((id) => id !== lessonId),
        }
      })
    },
    [setCompleted],
  )

  const toggleLesson = useCallback<AppValue['toggleLesson']>(
    (slug, lessonId) => {
      setCompleted((prev) => {
        const current = prev[slug] ?? []
        return {
          ...prev,
          [slug]: current.includes(lessonId)
            ? current.filter((id) => id !== lessonId)
            : [...current, lessonId],
        }
      })
    },
    [setCompleted],
  )

  const resetCourse = useCallback(
    (slug: string) => setCompleted((prev) => ({ ...prev, [slug]: [] })),
    [setCompleted],
  )

  const progressFor = useCallback(
    (slug: string): CourseProgress => {
      const course = COURSE_BY_SLUG.get(slug)
      const total = course ? lessonCount(course) : 0
      // Guard against ids left from an earlier data shape.
      const valid = new Set(course ? allLessons(course).map((l) => l.id) : [])
      const done = (completed[slug] ?? []).filter((id) => valid.has(id)).length
      const ratio = total === 0 ? 0 : done / total
      return { done, total, ratio, pct: Math.round(ratio * 100), complete: total > 0 && done === total }
    },
    [completed],
  )

  const lastLessonFor = useCallback((slug: string) => lastLesson[slug], [lastLesson])

  const noteLastLesson = useCallback<AppValue['noteLastLesson']>(
    (slug, lessonId) => {
      setLastLesson((prev) => (prev[slug] === lessonId ? prev : { ...prev, [slug]: lessonId }))
    },
    [setLastLesson],
  )

  const value = useMemo<AppValue>(
    () => ({
      enrolled, isEnrolled, enrol, leave,
      completed, isLessonDone, toggleLesson, setLessonDone, resetCourse,
      progressFor, lastLessonFor, noteLastLesson,
      theme, toggleTheme,
      toasts, pushToast, dismissToast,
    }),
    [
      enrolled, isEnrolled, enrol, leave,
      completed, isLessonDone, toggleLesson, setLessonDone, resetCourse,
      progressFor, lastLessonFor, noteLastLesson,
      theme, toggleTheme,
      toasts, pushToast, dismissToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
