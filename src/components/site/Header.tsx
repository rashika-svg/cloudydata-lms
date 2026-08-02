/* ============================================================
   Site header.

   WhatsApp is the primary channel on the real site, so it is the
   header's primary action here — a real wa.me deep link with the
   message pre-filled, not a form.
   ============================================================ */

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CONTACT, NAV, WA_GENERAL, whatsappLink } from '../../data/site'
import { useApp } from '../../store/app'
import { useScrollProgress, useScrolled } from '../../hooks/motion'
import { useLockBodyScroll, useMediaQuery } from '../../hooks/util'
import { Icon } from '../ui/Icon'
import { CommandPalette } from '../ui/CommandPalette'

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
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="logo" aria-label="CloudyData home">
          <span className="logo__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="logo__text">
            Cloudy<span>Data</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'is-active' : '')} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/my-learning" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            My learning
            {enrolled.length > 0 && <span className="nav__pip">{enrolled.length}</span>}
          </NavLink>
        </nav>

        <div className="nav__end">
          <CommandPalette />

          <button
            type="button"
            className="nav__icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>

          <a
            className="wa wa--sm nav__wa"
            href={whatsappLink(WA_GENERAL)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" size={16} />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            className="nav__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`burger ${open ? 'is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      {/* Reading progress — scaleX, so scrolling never triggers layout. */}
      <div className="nav__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className={`drawer ${open ? 'is-open' : ''}`}>
        <nav aria-label="Mobile">
          {[...NAV, { label: 'My learning', to: '/my-learning' }].map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={{ '--i': i } as React.CSSProperties}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {item.label}
              <Icon name="chevron-right" size={16} />
            </NavLink>
          ))}
        </nav>

        <a className="wa wa--block" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={18} />
          <span>Get details on WhatsApp</span>
        </a>
        <p className="drawer__num">{CONTACT.phoneDisplay}</p>
      </div>

      {open && !isDesktop && <div className="drawer__scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </header>
  )
}
