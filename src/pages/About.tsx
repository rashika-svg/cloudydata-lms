/* ============================================================
   About Me.

   Written in the first person, as the real site is — CloudyData is
   one instructor, not a company with a team page.
   ============================================================ */

import { COURSES, formatINR } from '../data/courses'
import { CONTACT, DEMO_STATS, FOUNDER, PILLARS, WA_GENERAL, whatsappLink } from '../data/site'
import { Button } from '../components/ui/Button'
import { Icon, type IconName } from '../components/ui/Icon'
import { Avatar, SectionHead, Stat } from '../components/ui/Primitives'

const HOW: [string, string][] = [
  ['Pick a track', 'Ten programmes across data, engineering, marketing, security and BI. Unsure which fits? Message me — you get a straight recommendation, not the most expensive one.'],
  ['Join live classes', 'Real sessions with me present. Data Analytics runs one-on-one; the rest run as small live batches.'],
  ['Build, do not watch', 'Every concept is followed by a guided assignment, and every module by something that goes into your portfolio.'],
  ['Get unstuck daily', 'A teaching assistant is available every day for one-on-one doubt clearing, so a blocker never costs you a week.'],
  ['Interview from day one', 'CV crafting, LinkedIn, mock interviews and job search support run alongside the syllabus.'],
]

export default function About() {
  const cheapest = COURSES.reduce((min, c) => (c.priceINR < min.priceINR ? c : min), COURSES[0]!)

  return (
    <>
      <section className="phead phead--lg">
        <div className="wrap">
          <span className="shead__eyebrow">About me</span>
          <h1>
            I teach data because it changed my career — and it should not cost a fortune.
          </h1>
          <p>
            Tracks start at {formatINR(cheapest.priceINR)}, every class is live, and I teach them myself.
          </p>
        </div>
      </section>

      {/* ---- Bio -------------------------------------- */}
      <section className="section section--top">
        <div className="wrap aboutme">
          <div className="aboutme__card">
            <Avatar initials={FOUNDER.initials} size={90} />
            <strong>{FOUNDER.name}</strong>
            <span>{FOUNDER.role}</span>
            <div className="aboutme__social">
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={17} />
              </a>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Icon name="instagram" size={17} />
              </a>
              <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <Icon name="whatsapp" size={17} />
              </a>
            </div>
          </div>

          <div className="aboutme__copy">
            <blockquote>“{FOUNDER.mission}”</blockquote>
            <p>{FOUNDER.bio}</p>
            <p>{FOUNDER.teaches}</p>
            <div className="aboutme__actions">
              <Button to="/courses" variant="brand" icon="arrow-right">
                See the courses
              </Button>
              <a className="wa" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={17} />
                <span>Message me</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats ------------------------------------ */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="statband">
            {DEMO_STATS.map((s) => (
              <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
          <p className="note note--center">Figures are illustrative demo content for this front-end build.</p>
        </div>
      </section>

      {/* ---- How it works ----------------------------- */}
      <section className="section section--alt">
        <div className="wrap">
          <SectionHead eyebrow="How it works" title="Five things happen, in this order" center />
          <ol className="steps">
            {HOW.map(([step, body], i) => (
              <li key={step} className="rise" style={{ '--i': i } as React.CSSProperties}>
                <span className="steps__n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Principles ------------------------------- */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="What I hold to" title="Six principles, no exceptions" center />
          <div className="grid grid--3">
            {PILLARS.map((p, i) => (
              <article className="feature rise" key={p.title} style={{ '--i': i } as React.CSSProperties}>
                <span className="feature__icon">
                  <Icon name={p.icon as IconName} size={19} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Tell me where you are stuck.</h2>
          <p>
            Message me with your background and what you want to be doing in a year. I will point you at one track — or
            tell you honestly that none of them fit yet.
          </p>
          <div className="cta__actions">
            <a
              className="wa wa--lg wa--onDark"
              href={whatsappLink(WA_GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={19} />
              <span>Message me on WhatsApp</span>
            </a>
            <Button to="/contact" size="lg" variant="onDark">
              Other ways to reach me
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
