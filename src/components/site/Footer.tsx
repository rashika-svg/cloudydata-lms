import { Link } from 'react-router-dom'
import { COURSES } from '../../data/courses'
import { CONTACT, FOUNDER, NAV, WA_GENERAL, whatsappLink } from '../../data/site'
import { Icon } from '../ui/Icon'

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

          <div className="foot__social" aria-label="Social links">
            <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <Icon name="whatsapp" size={17} />
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Icon name="linkedin" size={17} />
            </a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Icon name="instagram" size={17} />
            </a>
            <a href={`mailto:${CONTACT.email}`} aria-label="Email">
              <Icon name="mail" size={17} />
            </a>
          </div>
        </div>

        <div className="foot__col">
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
        </div>

        <div className="foot__col">
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
        </div>

        <div className="foot__col">
          <h3>Reach me</h3>
          <ul>
            <li>
              <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="foot__base">
        <p>© {year} CloudyData — front-end demo build.</p>
        <p>
          A portfolio project. Course content mirrors {CONTACT.site}; enrolment, payment and class delivery are not
          implemented here. Course photography from{' '}
          <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
            Pexels
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
