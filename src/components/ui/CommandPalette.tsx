/* ============================================================
   Command palette — ⌘K / Ctrl-K.

   Searches courses, pages and actions from one input. Ranking is a
   small hand-written scorer rather than a fuzzy-search dependency:
   exact prefix beats word-boundary beats substring, and a course you
   are already enrolled in floats above one you are not.
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COURSES, formatINR } from '../../data/courses'
import { WA_GENERAL, whatsappLink } from '../../data/site'
import { useApp } from '../../store/app'
import { useFocusTrap, useHotkey, useLockBodyScroll } from '../../hooks/util'
import { Icon, type IconName } from './Icon'

interface Command {
  id: string
  label: string
  hint?: string
  group: 'Courses' | 'Go to' | 'Actions'
  icon: IconName
  keywords?: string
  run: () => void
}

function score(haystack: string, needle: string): number {
  if (!needle) return 1
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase()
  if (h === n) return 100
  if (h.startsWith(n)) return 80
  // Word-boundary match — "eng" should find "Data Engineering".
  if (new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(h)) return 60
  if (h.includes(n)) return 40
  return 0
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const navigate = useNavigate()
  const { enrolled, isEnrolled, theme, toggleTheme, pushToast } = useApp()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const trapRef = useFocusTrap<HTMLDivElement>(open)

  useLockBodyScroll(open)

  useHotkey('k', (e) => { e.preventDefault(); setOpen((o) => !o) }, { meta: true, allowInInput: true })
  useHotkey('Escape', () => setOpen(false), { allowInInput: true })

  const commands = useMemo<Command[]>(() => {
    const courses: Command[] = COURSES.map((c) => ({
      id: `course-${c.slug}`,
      label: c.title,
      hint: isEnrolled(c.slug) ? 'Enrolled' : `${c.durationLabel} · ${formatINR(c.priceINR)}`,
      group: 'Courses',
      icon: 'book',
      keywords: `${c.short} ${c.category} ${c.tools.join(' ')}`,
      run: () => navigate(isEnrolled(c.slug) ? `/learn/${c.slug}` : `/courses/${c.slug}`),
    }))

    const pages: Command[] = [
      { id: 'p-home', label: 'Home', group: 'Go to', icon: 'home', run: () => navigate('/') },
      { id: 'p-courses', label: 'All courses', group: 'Go to', icon: 'layers', run: () => navigate('/courses') },
      {
        id: 'p-mine',
        label: 'My learning',
        hint: enrolled.length ? `${enrolled.length} joined` : undefined,
        group: 'Go to',
        icon: 'chart',
        keywords: 'progress dashboard',
        run: () => navigate('/my-learning'),
      },
      { id: 'p-about', label: 'About Me', group: 'Go to', icon: 'user', run: () => navigate('/about') },
      { id: 'p-contact', label: 'Contact', group: 'Go to', icon: 'mail', run: () => navigate('/contact') },
    ]

    const actions: Command[] = [
      {
        id: 'a-wa',
        label: 'Message Ajay on WhatsApp',
        group: 'Actions',
        icon: 'whatsapp',
        keywords: 'enroll enroll ask help contact',
        run: () => window.open(whatsappLink(WA_GENERAL), '_blank', 'noopener'),
      },
      {
        id: 'a-resume',
        label: 'Resume last lesson',
        hint: enrolled[0] ? undefined : 'Join a course first',
        group: 'Actions',
        icon: 'play',
        keywords: 'continue learning',
        run: () => {
          const first = enrolled[0]
          if (first) navigate(`/learn/${first}`)
          else pushToast('Nothing to resume', { detail: 'Join a course to start.', tone: 'warn' })
        },
      },
      {
        id: 'a-theme',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        group: 'Actions',
        icon: theme === 'dark' ? 'sun' : 'moon',
        keywords: 'appearance dark light',
        run: toggleTheme,
      },
    ]

    return [...courses, ...pages, ...actions]
  }, [navigate, enrolled, isEnrolled, theme, toggleTheme, pushToast])

  const results = useMemo(() => {
    const q = query.trim()
    const scored = commands
      .map((c) => {
        const best = Math.max(score(c.label, q), score(c.keywords ?? '', q) * 0.7)
        const bonus = c.id.startsWith('course-') && isEnrolled(c.id.slice(7)) ? 5 : 0
        return { command: c, rank: best + bonus }
      })
      .filter((r) => r.rank > 0)

    scored.sort((a, b) => b.rank - a.rank)
    return scored.slice(0, 9).map((r) => r.command)
  }, [commands, query, isEnrolled])

  // Any change to the result set returns the highlight to the top row.
  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    // Focus after the panel starts opening, so the caret does not
    // appear before the panel does.
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (cmd: Command | undefined) => {
    if (!cmd) return
    setOpen(false)
    cmd.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      /* This handler sits on the container and so sees Enter from every
         focusable inside it. If a button has focus, Enter belongs to that
         button: preventDefault here would suppress its activation and run
         the highlighted result instead — pressing Enter on the close chip
         would navigate somewhere rather than close.

         Nothing is lost by deferring. The result rows are buttons that
         already run themselves on click, and the input is not a button,
         so the ordinary case — typing, then Enter — still lands here. */
      if ((e.target as HTMLElement).closest('button')) return
      e.preventDefault()
      run(results[active])
    }
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-outline-variant bg-surface-lowest px-3 text-xs text-outline transition-[border-color,color] duration-200 hover:border-outline hover:text-on-surface-variant max-nav:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Icon name="search" size={15} />
        <span className="min-w-15 text-left">Search</span>
        <kbd className="rounded-xs border border-outline-variant px-1.5 py-px font-mono text-[10px]">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-300 grid place-items-start justify-center pt-[clamp(2rem,12vh,8rem)]" onKeyDown={onKeyDown}>
          <div
            className="absolute inset-0 animate-[fade_200ms_var(--ease)] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Spring easing — the panel should feel like it snaps into place. */}
          <div
            className="relative flex max-h-[min(70vh,560px)] w-[min(600px,calc(100vw-3rem))] animate-[cmdk-in_280ms_var(--ease-spring)] flex-col overflow-hidden rounded-lg border border-outline bg-surface-lowest shadow-e3"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            ref={trapRef}
          >
            <div className="flex items-center gap-3 border-b border-outline-variant p-4 text-outline">
              <Icon name="search" size={17} />
              <input
                ref={inputRef}
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-outline"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, pages, actions…"
                aria-label="Search"
                autoComplete="off"
                spellCheck={false}
              />
              {/* The chip sits top-right of a dialog and is drawn as a
                  bordered pill, which is where and how a close button
                  looks — so it should close. It is also the only pointer
                  affordance besides the backdrop, and on a touch device
                  there is no Esc key for the label to refer to.

                  -m-2/p-2 grows the hit area past 24px without moving the
                  chip: the negative margin and the padding cancel, so the
                  kbd lands exactly where it did before. */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="group -m-2 shrink-0 p-2"
              >
                <kbd className="block rounded-xs border border-outline-variant px-1.5 py-px font-mono text-[10px] transition-colors duration-[var(--t2)] group-hover:border-outline group-hover:text-on-surface">
                  esc
                </kbd>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2" ref={listRef}>
              {results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-on-surface-variant">
                  Nothing matches <strong>{query}</strong>
                </p>
              )}

              {results.map((cmd, i) => {
                const showGroup = i === 0 || results[i - 1]?.group !== cmd.group
                const isActive = i === active
                return (
                  <div key={cmd.id}>
                    {showGroup && (
                      <div className="px-3 pt-3 pb-2 font-mono text-[0.6875rem] tracking-[0.09em] text-outline uppercase">
                        {cmd.group}
                      </div>
                    )}
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors duration-100 ${
                        isActive ? 'bg-surface-container text-on-surface' : 'text-on-surface-variant'
                      }`}
                      data-active={isActive}
                      onPointerMove={() => setActive(i)}
                      onClick={() => run(cmd)}
                    >
                      <Icon
                        name={cmd.icon}
                        size={15}
                        className={`flex-none transition-colors duration-100 ${isActive ? 'text-primary' : 'text-outline'}`}
                      />
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{cmd.label}</span>
                      {cmd.hint && (
                        <span className="flex-none font-mono text-[0.6875rem] whitespace-nowrap text-outline">
                          {cmd.hint}
                        </span>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            <footer className="flex gap-4 border-t border-outline-variant bg-surface-container px-4 py-3 font-mono text-[0.6875rem] text-outline">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </footer>
          </div>
        </div>
      )}
    </>
  )
}
