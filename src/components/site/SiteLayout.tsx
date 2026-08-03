/* ============================================================
   Site shell — header, page, footer.

   The lesson player runs full-height and hides the footer; every
   other route is a normal website page.
   ============================================================ */

import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toaster } from '../ui/Toaster'
import { BackToTop } from './BackToTop'
import { Cursor } from './Cursor'

export function SiteLayout() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/learn/')

  return (
    <>
      {/* Off-screen until focused, so keyboard users get past the
          header without it costing anyone else a pixel. */}
      <a
        className="fixed top-3 left-3 z-1000 -translate-y-[250%] rounded-md bg-on-surface px-4 py-3 text-sm font-semibold text-surface-lowest transition-transform duration-200 focus-visible:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>

      <Cursor />
      <Header />

      {/* Keyed on pathname so each page plays its enter animation. */}
      <main
        id="main"
        key={location.pathname}
        className={isPlayer ? 'block' : 'block animate-[pagein_280ms_var(--ease)]'}
      >
        <Outlet />
      </main>

      {!isPlayer && <Footer />}
      {!isPlayer && <BackToTop />}

      <Toaster />
      <ScrollRestoration />
    </>
  )
}
