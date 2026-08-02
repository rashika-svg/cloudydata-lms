/* ============================================================
   Home — the CloudyData landing page.
   ============================================================ */

import { Link } from 'react-router-dom'
import { COURSES, formatINR } from '../data/courses'
import {
  DEMO_STATS,
  DEMO_TESTIMONIALS,
  FAQS,
  FOUNDER,
  HERO,
  PILLARS,
  TOOL_MARQUEE,
  WA_GENERAL,
  whatsappLink,
} from '../data/site'
import { useEffect, useState } from 'react'
import { useApp } from '../store/app'
import { useReducedMotion, useTilt } from '../hooks/motion'
import { CourseCard } from '../components/CourseCard'
import { CourseFinder } from '../components/CourseFinder'
import { AccordionItem } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { Icon, type IconName } from '../components/ui/Icon'
import { Avatar, Ring, SectionHead, Stat, Stars } from '../components/ui/Primitives'

/* One project per course, taken from the real curriculum rather than
   written for the marketing page. Computed once at module load. */
const PROJECTS = COURSES.flatMap((c) => {
  const project = c.curriculum
    .flatMap((m) => m.lessons)
    .find((l) => l.kind === 'project' && !l.title.startsWith('Build:'))
  return project ? [{ slug: c.slug, course: c.short, title: project.title.replace(/^Project:\s*/, '') }] : []
}).slice(0, 8)

/* ----------------------------------------------------------
   RotatingWord — the headline's changing noun.

   Slides on a masked track rather than typing. A typewriter destroys
   and rebuilds the word each cycle, which reflows the line and drags
   the eye; a masked slide keeps the baseline dead still — which
   matters when the type is this large.
   ---------------------------------------------------------- */

const ROLES = ['Data Scientist', 'Data Analyst', 'Data Engineer', 'BI Analyst']

function RotatingWord() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2600)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <span className="rot" aria-label={ROLES.join(', ')}>
      {/* Invisible longest string reserves the width so the line never jumps. */}
      <span className="rot__ghost" aria-hidden="true">
        Data Scientist
      </span>
      <span className="rot__track" style={{ '--rot-i': index } as React.CSSProperties} aria-hidden="true">
        {ROLES.map((role) => (
          <span className="rot__word grad-text" key={role}>
            {role}
          </span>
        ))}
      </span>
    </span>
  )
}

/* ----------------------------------------------------------
   HeroPanel — a mock learner console.

   Doubles as a product screenshot and as the showcase for the tilt
   and sheen, so the first thing a visitor touches already responds
   to them. Content is pulled from the real Data Science syllabus.
   ---------------------------------------------------------- */

const DS = COURSES.find((c) => c.slug === 'data-science')!
const ML_MODULE = DS.curriculum.find((m) => m.title === 'Machine Learning') ?? DS.curriculum[0]!

function HeroPanel() {
  const tiltRef = useTilt<HTMLDivElement>(8)
  const lessons = ML_MODULE.lessons.slice(0, 5)

  return (
    <div className="hero__panel" ref={tiltRef} data-cursor="card">
      <span className="hero__panelglow" aria-hidden="true" />
      <span className="hero__panelsheen" aria-hidden="true" />

      <div className="console">
        <div className="console__bar">
          <span className="console__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="console__title">my-learning · data-science</span>
        </div>

        <div className="console__body">
          <div className="console__row">
            <Ring ratio={0.62} size={78} stroke={7}>
              <strong>62%</strong>
            </Ring>
            <div className="console__meta">
              <span className="console__eyebrow">Current module</span>
              <strong>{ML_MODULE.title}</strong>
              <span className="console__sub">{lessons[3]?.title}</span>
            </div>
          </div>

          <ul className="console__list">
            {lessons.map((l, i) => (
              <li key={l.id} className={i < 3 ? 'is-done' : ''} style={{ '--i': i } as React.CSSProperties}>
                <span className="console__check" aria-hidden="true">
                  <Icon name="check" size={12} strokeWidth={2.6} />
                </span>
                {l.title}
              </li>
            ))}
          </ul>

          <div className="console__foot">
            <span className="console__streak">
              <Icon name="flame" size={14} /> 12-day streak
            </span>
            <span className="console__next">
              Next live class · Thu 8pm <Icon name="arrow-right" size={13} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { enrolled, progressFor } = useApp()

  const cheapest = COURSES.reduce((min, c) => (c.priceINR < min.priceINR ? c : min), COURSES[0]!)
  const featured = COURSES.filter((c) =>
    ['data-science', 'data-analytics-one-on-one', 'ai-driven-data-analytics', 'data-engineering', 'data-super-star', 'business-analytics-gen-ai'].includes(
      c.slug,
    ),
  )

  const inProgress = enrolled
    .map((slug) => COURSES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c) => !progressFor(c.slug).complete)
    .slice(0, 3)

  return (
    <>
      {/* ---- Hero ------------------------------------- */}
      <section className="hero">
        <div className="wrap hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">{HERO.eyebrow}</span>

            <h1 className="hero__title">
              Become a <RotatingWord />
              <br />
              <span className="hero__quiet">without going broke.</span>
            </h1>

            <p className="hero__sub">{HERO.sub}</p>

            <div className="hero__actions">
              {/* The only gradient button on the site. */}
              <Button to="/courses" size="lg" variant="brand" icon="arrow-right" className="btn--gradient">
                Explore courses
              </Button>
              <a className="wa wa--lg" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={19} />
                <span>Get details on WhatsApp</span>
              </a>
            </div>

            <ul className="hero__proof">
              <li>
                <Icon name="check-circle" size={15} /> Starts at {formatINR(cheapest.priceINR)}
              </li>
              <li>
                <Icon name="check-circle" size={15} /> Daily 1-on-1 doubt clearing
              </li>
              <li>
                <Icon name="check-circle" size={15} /> Interview prep from day one
              </li>
            </ul>

            {/* Keeps the one-instructor brand present even though the
                panel, not the founder, now leads the hero. */}
            <p className="hero__by">
              Every class taught by{' '}
              <Link to="/about">
                {FOUNDER.name} <Icon name="arrow-right" size={12} />
              </Link>
            </p>
          </div>

          {/* The v1 hero visual: a mock of the product itself. */}
          <aside className="hero__visual">
            <HeroPanel />
          </aside>
        </div>

        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            {[0, 1].map((pass) => (
              <span className="ticker__set" key={pass}>
                {TOOL_MARQUEE.map((t) => (
                  <span key={`${pass}-${t}`}>{t}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Continue learning ------------------------ */}
      {inProgress.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <SectionHead
              eyebrow="Pick up where you left off"
              title="Continue learning"
              action={
                <Button to="/my-learning" variant="outline" size="sm" icon="arrow-right">
                  My learning
                </Button>
              }
            />
            <div className="grid grid--3">
              {inProgress.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} enrolledView />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Course finder ---------------------------- */}
      <section className="section section--tight">
        <div className="wrap">
          <CourseFinder />
        </div>
      </section>

      {/* ---- Courses ---------------------------------- */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Live batches"
            title="Pick the career you want"
            sub="Ten live tracks across data, engineering, marketing, security and business intelligence — every one taught live, with real projects."
            action={
              <Button to="/courses" variant="outline" icon="arrow-right">
                All {COURSES.length} courses
              </Button>
            }
          />

          <div className="grid grid--3">
            {featured.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Why -------------------------------------- */}
      <section className="section section--alt">
        <div className="wrap">
          <SectionHead
            eyebrow="Learn by doing"
            title="Not a recorded course you never finish"
            sub="Concepts land through guided assignments and real projects, in live sessions where you can interrupt and ask."
            center
          />

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

      {/* ---- Projects ---------------------------------
          Real project lessons pulled from the curricula, not invented
          marketing examples. */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Learn by doing"
            title="Things you will actually build"
            sub="Every track ends with work that goes into your portfolio. These are real projects from the syllabus, not illustrations."
            center
          />

          <div className="projects">
            {PROJECTS.map((p, i) => (
              <Link
                to={`/courses/${p.slug}`}
                className="project rise"
                key={`${p.slug}-${p.title}`}
                style={{ '--i': Math.min(i, 6) } as React.CSSProperties}
              >
                <span className="project__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="project__body">
                  <strong>{p.title}</strong>
                  <span>{p.course}</span>
                </span>
                <Icon name="arrow-up-right" size={15} className="project__go" />
              </Link>
            ))}
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

      {/* ---- About me --------------------------------- */}
      <section className="section">
        <div className="wrap aboutme">
          <div className="aboutme__card">
            <Avatar initials={FOUNDER.initials} size={72} />
            <strong>{FOUNDER.name}</strong>
            <span>{FOUNDER.role}</span>
          </div>
          <div className="aboutme__copy">
            <span className="shead__eyebrow">About me</span>
            <h2>Why I started CloudyData</h2>
            <blockquote>“{FOUNDER.mission}”</blockquote>
            <p>{FOUNDER.bio}</p>
            <div className="aboutme__actions">
              <Button to="/about" variant="outline" icon="arrow-right">
                More about me
              </Button>
              <a className="wa" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={17} />
                <span>Message me</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Testimonials ----------------------------- */}
      <section className="section section--alt">
        <div className="wrap">
          <SectionHead eyebrow="Learner stories" title="Where people end up" center />

          <div className="grid grid--2">
            {DEMO_TESTIMONIALS.map((t, i) => (
              <figure className="quote rise" key={t.name} style={{ '--i': i } as React.CSSProperties}>
                <Stars value={5} size={14} />
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <Avatar initials={t.initials} size={38} />
                  <span>
                    <strong>{t.name}</strong>
                    <span>
                      {t.role} · {t.course}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="note note--center">Testimonials are demo content written for this front-end build.</p>
        </div>
      </section>

      {/* ---- FAQ -------------------------------------- */}
      <section className="section">
        <div className="wrap wrap--narrow">
          <SectionHead eyebrow="Questions" title="Before you enrol" center />
          <div className="faq">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA -------------------------------------- */}
      <section className="cta">
        <div className="wrap">
          <h2>Not sure which track fits you?</h2>
          <p>
            Message me on WhatsApp with where you are now and where you want to be. You will get an honest
            recommendation — including “none of these yet” if that is the true answer.
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
            <Button to="/courses" size="lg" variant="onDark">
              Browse all courses
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
