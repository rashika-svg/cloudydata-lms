/* ============================================================
   Site header.

   WhatsApp is the primary channel on the real site, so it is the
   header's primary action here — a real wa.me deep link with the
   message pre-filled, not a form.

   Below 940px the links collapse into a drawer; the breakpoint is
   named `nav` in the theme so that decision reads in the markup.
   ============================================================ */

import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CONTACT, NAV, WA_GENERAL } from '../../data/site'
import { useApp } from '../../store/app'
import { useScrollProgress, useScrolled } from '../../hooks/motion'
import { useLockBodyScroll, useMediaQuery } from '../../hooks/util'
import { Icon } from '../ui/Icon'
import { Logo } from './Logo'
import { Wa } from '../ui/Wa'
import { CommandPalette } from '../ui/CommandPalette'

/* The underline grows from the left on hover and stays put when the
   route is active — one rule, two states, no layout cost. */
const LINK =
  'relative inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors duration-200 ' +
  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-sm ' +
  'after:bg-primary after:transition-transform after:duration-200 hover:text-on-surface hover:after:scale-x-100'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `${LINK} ${isActive ? 'text-on-surface after:scale-x-100' : 'text-on-surface-variant after:scale-x-0'}`

export function Header() {
  const location = useLocation()
  const scrolled = useScrolled(8)
  const progress = useScrollProgress()
  const { enrolled, theme, toggleTheme } = useApp()

  const isDesktop = useMediaQuery('(min-width: 900px)')
  const [open, setOpen] = useState(false)

  useLockBodyScroll(open && !isDesktop)
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className={`sticky top-0 z-100 border-b backdrop-blur-lg transition-[border-color,box-shadow] duration-300 ${
        scrolled ? 'border-outline-variant shadow-e1' : 'border-transparent'
      }`}
      style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }}
    >
      <div className="mx-auto flex h-17 max-w-7xl items-center gap-6 px-(--pad)">
        <Logo />

        <nav className="ml-auto hidden items-center gap-6 nav:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/my-learning" className={linkClass}>
            My learning
            {enrolled.length > 0 && (
              /* Not white — the accent is light in dark mode, so the
                 foreground has to flip with it. */
              <span className="inline-grid h-4.5 min-w-4.5 place-items-center rounded-full bg-primary px-1.5 font-mono text-[10px] font-medium text-on-primary">
                {enrolled.length}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="flex flex-none items-center gap-3 max-nav:ml-auto">
          <CommandPalette />

          <button
            type="button"
            className="grid size-9 place-items-center rounded-md border border-transparent text-on-surface-variant transition-[background-color,border-color,color] duration-200 hover:border-outline-variant hover:bg-surface-lowest hover:text-on-surface"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>

          <Wa message={WA_GENERAL} size="sm" className="max-[520px]:hidden">
            WhatsApp
          </Wa>

          <button
            type="button"
            className="p-1.5 text-on-surface nav:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="grid w-5 gap-1" aria-hidden="true">
              <i
                className={`block h-0.5 rounded-sm bg-current transition-transform duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`}
              />
              <i className={`block h-0.5 rounded-sm bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <i
                className={`block h-0.5 rounded-sm bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Reading progress — scaleX, so scrolling never triggers layout. */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden" aria-hidden="true">
        <span
          className="block h-full origin-left bg-primary"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div
        className={`fixed inset-x-0 top-17 z-100 border-b border-outline-variant bg-surface-lowest px-(--pad) pt-4 pb-8 shadow-e2 transition-[transform,opacity] duration-300 nav:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2.5 opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {[...NAV, { label: 'My learning', to: '/my-learning' }].map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={{ '--i': i } as React.CSSProperties}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-outline-variant py-4 text-[1.05rem] font-medium transition-[opacity,transform,color] duration-300 delay-[calc(var(--i)*45ms*var(--motion))] ${
                  open ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                } ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`
              }
            >
              {item.label}
              <Icon name="chevron-right" size={16} />
            </NavLink>
          ))}
        </nav>

        <Wa message={WA_GENERAL} size="md" block className="mt-6">
          Get details on WhatsApp
        </Wa>
        <p className="mt-3 text-center font-mono text-sm text-on-surface-variant">{CONTACT.phoneDisplay}</p>
      </div>

      {open && !isDesktop && (
        <div
          className="fixed inset-0 top-17 z-99 animate-[fade_200ms_var(--ease)] bg-black/45"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
