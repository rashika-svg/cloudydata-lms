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
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Cursor />
      <Header />

      {/* Keyed on pathname so each page plays its enter animation. */}
      <main id="main" key={location.pathname} className={isPlayer ? 'page page--full' : 'page'}>
        <Outlet />
      </main>

      {!isPlayer && <Footer />}
      {!isPlayer && <BackToTop />}

      <Toaster />
      <ScrollRestoration />
    </>
  )
}
