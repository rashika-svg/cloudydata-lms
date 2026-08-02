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
import { useApp } from '../store/app'
import { CourseCard } from '../components/CourseCard'
import { AccordionItem } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { Icon, type IconName } from '../components/ui/Icon'
import { Avatar, SectionHead, Stat, Stars } from '../components/ui/Primitives'

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
            <span className="hero__eyebrow">
              <i aria-hidden="true" /> {HERO.eyebrow}
            </span>

            <h1>{HERO.title}</h1>
            <p className="hero__sub">{HERO.sub}</p>

            <div className="hero__actions">
              <Button to="/courses" size="lg" variant="brand" icon="arrow-right">
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
          </div>

          {/* Instructor card — the real site leads with the founder. */}
          <aside className="hero__tutor">
            <div className="tutorcard">
              <Avatar initials={FOUNDER.initials} size={84} />
              <strong>{FOUNDER.name}</strong>
              <span className="tutorcard__role">{FOUNDER.role}</span>
              <p className="tutorcard__quote">“{FOUNDER.teaches}”</p>

              <dl className="tutorcard__facts">
                <div>
                  <dt>Experience</dt>
                  <dd>{FOUNDER.experience}</dd>
                </div>
                <div>
                  <dt>Tracks</dt>
                  <dd>{COURSES.length}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>Live only</dd>
                </div>
              </dl>

              <Link to="/about" className="tutorcard__link">
                About me <Icon name="arrow-right" size={13} />
              </Link>
            </div>
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
