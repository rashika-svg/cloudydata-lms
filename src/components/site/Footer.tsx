/* ============================================================
   Footer.

   A brand block and three link columns on one rhythm. The contact
   column lists the values themselves — a phone number, an address,
   a domain are self-describing, so labelling each one only adds a
   second typographic voice to a column that does not need it.

   The social marks are the footer's only boxed element. Everything
   else is text on a line.

   COLOUR: this is a dark band in BOTH themes, so it cannot use the
   surface roles — they flip. The accent is pinned to the dark-scheme
   cyan and the ink levels are opacity steps down from --on-dark.
   ============================================================ */

import { Link } from 'react-router-dom'
import { COURSES } from '../../data/courses'
import { CONTACT, FOUNDER, NAV, WA_GENERAL, whatsappLink } from '../../data/site'
import { Icon, type IconName } from '../ui/Icon'
import { Logo } from './Logo'

/* Each mark hovers to its own brand. Transient, so the resting row
   stays neutral and only the pointed-at tile carries colour. */
const SOCIAL: { label: string; href: string; icon: IconName; hover: string }[] = [
  { label: 'WhatsApp', href: whatsappLink(WA_GENERAL), icon: 'whatsapp', hover: 'hover:border-wa hover:bg-wa hover:text-wa-ink' },
  { label: 'LinkedIn', href: CONTACT.linkedin, icon: 'linkedin', hover: 'hover:border-li hover:bg-li hover:text-white' },
  { label: 'Instagram', href: CONTACT.instagram, icon: 'instagram', hover: 'hover:border-ig hover:bg-ig hover:text-white' },
]

/** #4fd8eb — the dark-scheme cyan, pinned so it survives light mode. */
const ACCENT = 'text-[#4fd8eb]'
const RULE = 'border-on-dark/12'
const LINK = 'inline-block text-on-dark/75 transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-[#4fd8eb]'
const COL_HEAD = `mb-4 font-mono text-[0.6875rem] font-medium tracking-[0.09em] uppercase ${ACCENT}`

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={`relative border-t bg-dark text-on-dark ${RULE}`}>
      {/* Seam. Cyan into the tertiary violet — the two ends of the
          scheme, at 1px, so it reads as a drawn edge, not a wash. */}
      <span
        className="absolute inset-x-0 -top-px h-px opacity-55"
        style={{ background: 'linear-gradient(90deg, #4fd8eb, #bac6ea 45%, transparent 85%)' }}
        aria-hidden="true"
      />

      {/* The brand column is wider because a paragraph needs the
          measure; past ~36ch the extra space reads as a hole, so the
          three link columns are equal and the slack falls at the right
          edge. Below 1040px the paragraph gets its measure back by
          spanning the full row above the links. */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-12 px-(--pad) py-12 min-[400px]:grid-cols-2 min-[620px]:gap-y-8 min-[620px]:grid-cols-3 wide:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
        <div className="max-wide:col-span-full">
          <Logo light />

          <p className="mt-4 max-w-[34ch] text-sm text-on-dark/75">
            The most affordable live classes in data analytics and data science — taught by {FOUNDER.name}, not a
            rotating bench of instructors.
          </p>

          {/* Availability signal. Static dot — the site already pulses
              one in the hero and on live course cards, and a third
              would be noise. */}
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-wa/12 py-[5px] pr-[11px] pl-[9px] font-mono text-[0.6875rem] tracking-[0.02em] text-[color-mix(in_srgb,var(--wa)_78%,#fff)]">
            <i className="size-1.5 flex-none rounded-full bg-wa shadow-[0_0_0_3px] shadow-wa/20" aria-hidden="true" />
            {CONTACT.replyTime}
          </p>

          <div className="mt-6 flex gap-2.5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className={`grid size-9.5 place-items-center rounded-md border bg-on-dark/4 text-on-dark/75 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4fd8eb] ${RULE} ${s.hover}`}
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
            <a
              href={`mailto:${CONTACT.email}`}
              aria-label="Email"
              title="Email"
              className={`grid size-9.5 place-items-center rounded-md border bg-on-dark/4 text-on-dark/75 transition-colors duration-200 hover:border-[#4fd8eb] hover:bg-[#4fd8eb] hover:text-[#00363f] ${RULE}`}
            >
              <Icon name="mail" size={17} />
            </a>
          </div>
        </div>

        <nav aria-label="Courses">
          <h3 className={COL_HEAD}>Courses</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {COURSES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/courses/${c.slug}`} className={LINK}>
                  {c.short}
                </Link>
              </li>
            ))}
            <li>
              {/* The one link here that leads somewhere new rather
                  than sideways, so it gets weight the list does not. */}
              <Link
                to="/courses"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#4fd8eb]/13 px-3 py-[5px] text-xs font-medium text-[#4fd8eb] transition-colors duration-200 hover:bg-[#4fd8eb] hover:text-[#00363f]"
              >
                All {COURSES.length} courses <Icon name="arrow-right" size={13} />
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Site">
          <h3 className={COL_HEAD}>CloudyData</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className={LINK}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/my-learning" className={LINK}>
                My learning
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className={COL_HEAD}>Reach me</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer" className={LINK}>
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className={LINK}>
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`https://${CONTACT.site}`} target="_blank" rel="noopener noreferrer" className={LINK}>
                {CONTACT.site}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Both blocks set left. Right-aligning the disclaimer leaves a
          ragged left edge mid-footer, which is most of what made the
          previous bar look unresolved. */}
      <div
        className={`mx-auto flex max-w-7xl flex-col flex-wrap items-start gap-x-12 gap-y-3 border-t px-(--pad) pt-6 pb-8 text-xs text-on-dark/55 wide:flex-row wide:justify-between ${RULE}`}
      >
        <p>© {year} CloudyData. All rights reserved.</p>
        <p className="max-w-[68ch]">
          {/* Amber, not neutral: this is a caveat about what the build
              is, and a grey pill would read as decoration and get
              skipped. */}
          <span className="mr-2 inline-block rounded-full bg-[#f0c04f]/15 px-2 py-0.5 font-mono text-[0.6875rem] font-medium tracking-[0.09em] text-[#f0c04f] uppercase">
            Demo
          </span>
          Front-end portfolio build. Course content mirrors {CONTACT.site}; enrollment, payment and class delivery are
          not implemented. Photography from{' '}
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-dark/75 underline underline-offset-2 hover:text-[#4fd8eb]"
          >
            Pexels
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
