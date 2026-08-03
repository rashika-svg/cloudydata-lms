/* ============================================================
   Footer.

   Four bands of decreasing weight: brand, link columns, direct
   contact, then the legal/demo base. The contact column is built
   from labelled rows rather than a fourth list of bare links —
   four identical stacks read as a sitemap dump, and the channels
   are the one thing here a visitor actually acts on.

   Social marks and the contact rows deliberately do not overlap:
   the row carries the numbers you copy, the marks carry the
   profiles you open.
   ============================================================ */

import { Link } from 'react-router-dom'
import { COURSES } from '../../data/courses'
import { CONTACT, FOUNDER, NAV, WA_GENERAL, whatsappLink } from '../../data/site'
import { Icon, type IconName } from '../ui/Icon'

const SOCIAL: { label: string; href: string; icon: IconName }[] = [
  { label: 'WhatsApp', href: whatsappLink(WA_GENERAL), icon: 'whatsapp' },
  { label: 'LinkedIn', href: CONTACT.linkedin, icon: 'linkedin' },
  { label: 'Instagram', href: CONTACT.instagram, icon: 'instagram' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__brand">
          <Link to="/" className="logo logo--light">
            <span className="logo__mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="logo__text">
              Cloudy<span>Data</span>
            </span>
          </Link>

          <p>
            The most affordable live classes in data analytics and data science — taught by {FOUNDER.name}, not a
            rotating bench of instructors.
          </p>

          <p className="foot__reply">
            <i aria-hidden="true" />
            {CONTACT.replyTime}
          </p>

          <div className="foot__social">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
            <a href={`mailto:${CONTACT.email}`} aria-label="Email" title="Email">
              <Icon name="mail" size={17} />
            </a>
          </div>
        </div>

        <nav className="foot__col" aria-label="Courses">
          <h3>Courses</h3>
          <ul>
            {COURSES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/courses/${c.slug}`}>{c.short}</Link>
              </li>
            ))}
            <li>
              <Link to="/courses" className="foot__more">
                All {COURSES.length} courses <Icon name="arrow-right" size={13} />
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="foot__col" aria-label="Site">
          <h3>CloudyData</h3>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/my-learning">My learning</Link>
            </li>
          </ul>
        </nav>

        <div className="foot__col foot__col--reach">
          <h3>Reach me</h3>

          <a className="foot__row" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
            <span className="foot__row-icon foot__row-icon--wa">
              <Icon name="whatsapp" size={16} />
            </span>
            <span className="foot__row-text">
              <em>WhatsApp</em>
              {CONTACT.phoneDisplay}
            </span>
          </a>

          <a className="foot__row" href={`mailto:${CONTACT.email}`}>
            <span className="foot__row-icon">
              <Icon name="mail" size={16} />
            </span>
            <span className="foot__row-text">
              <em>Email</em>
              {CONTACT.email}
            </span>
          </a>

          <a className="foot__row" href={`https://${CONTACT.site}`} target="_blank" rel="noopener noreferrer">
            <span className="foot__row-icon">
              <Icon name="external" size={16} />
            </span>
            <span className="foot__row-text">
              <em>Live site</em>
              {CONTACT.site}
            </span>
          </a>
        </div>
      </div>

      <div className="foot__base">
        <p>© {year} CloudyData. All rights reserved.</p>
        <p className="foot__demo">
          <span className="foot__tag">Demo</span>
          Front-end portfolio build. Course content mirrors {CONTACT.site}; enrolment, payment and class delivery are
          not implemented. Photography from{' '}
          <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
            Pexels
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
