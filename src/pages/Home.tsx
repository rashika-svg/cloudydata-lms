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
} from '../data/site'
import { useEffect, useState } from 'react'
import { useApp } from '../store/app'
import { useReducedMotion, useTilt } from '../hooks/motion'
import { CourseCard } from '../components/CourseCard'
import { CourseFinder } from '../components/CourseFinder'
import { PillarCard } from '../components/PillarCard'
import { AccordionItem } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { CtaBand, Grid, Section, Wrap } from '../components/ui/Layout'
import { Avatar, Ring, SectionHead, Stat, Stars } from '../components/ui/Primitives'
import { Wa } from '../components/ui/Wa'

/* A rule, then the label. Used once per section, so the eye learns
   where a new idea starts without another heading level. */
const EYEBROW =
  "inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.09em] text-primary uppercase " +
  "before:h-px before:w-5.5 before:bg-current before:opacity-60 before:content-['']"

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

   Descenders ('g' in Engineer, 'y' in Analyst) drop below the 1.02em
   line box, and two separate things used to eat them. The mask window
   sheared them off, so it now overhangs 0.2em with a negative margin
   handing that overhang back to the line — nothing moves. And the
   gradient is painted through bg-clip-text, which only paints inside
   the element's own box, so a 1.02em-tall role left its tail unpainted
   even once the mask was open. Hence roles at 1.32em: taller than the
   line box they render, so the gradient reaches the tail.

   Those two numbers are load-bearing together. 1.32em is also the
   slide step, which keeps the next role's ascenders below the 1.22em
   window; widen the window or shrink a role and the neighbour peeks in.
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
    <span
      className="relative inline-block h-[1.22em] mb-[-0.2em] overflow-hidden align-bottom"
      aria-label={ROLES.join(', ')}
    >
      {/* Invisible longest string reserves the width so the line never jumps. */}
      <span className="block h-[1.02em] whitespace-nowrap invisible" aria-hidden="true">
        Data Scientist
      </span>
      <span
        className="absolute inset-0 flex flex-col transition-transform duration-600 ease-spring"
        style={
          {
            '--rot-i': index,
            transform: 'translateY(calc(var(--rot-i) * -1.32em))',
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        {ROLES.map((role) => (
          <span
            className="block h-[1.32em] flex-none bg-[image:var(--grad-brand)] bg-clip-text leading-[1.02] whitespace-nowrap text-transparent"
            key={role}
          >
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
    <div
      className="tilt relative animate-[rise_600ms_var(--ease-out)_140ms_backwards]"
      ref={tiltRef}
      data-cursor="card"
    >
      <span
        className="pointer-events-none absolute -inset-[18%] -z-1 animate-[pulse-glow_6s_var(--ease)_infinite] bg-[radial-gradient(50%_50%_at_50%_50%,var(--brand-a15),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-0 z-2 rounded-lg bg-[radial-gradient(18rem_18rem_at_var(--px,50%)_var(--py,50%),rgb(255_255_255/0.08),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-lg border border-outline bg-[image:var(--grad-surface)] shadow-e3">
        <div className="flex items-center gap-3 border-b border-outline-variant bg-surface-lowest px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.25 rounded-full bg-surface-high" />
            <i className="size-2.25 rounded-full bg-surface-high" />
            <i className="size-2.25 rounded-full bg-surface-high" />
          </span>
          <span className="font-mono text-[0.6875rem] text-outline">my-learning · data-science</span>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-4">
            <Ring ratio={0.62} size={78} stroke={7}>
              <strong>62%</strong>
            </Ring>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-mono text-[0.6875rem] tracking-[0.09em] text-primary uppercase">
                Current module
              </span>
              <strong className="text-[1.15rem]">{ML_MODULE.title}</strong>
              <span className="text-xs text-on-surface-variant">{lessons[3]?.title}</span>
            </div>
          </div>

          <ul className="flex flex-col gap-0.5">
            {lessons.map((l, i) => {
              const isDone = i < 3
              return (
                <li
                  key={l.id}
                  className={`flex animate-[console-row_400ms_var(--ease-out)_backwards] items-center gap-3 rounded-md px-2.5 py-2 text-sm [animation-delay:calc(400ms+var(--i)*90ms)] ${
                    isDone
                      ? 'text-on-surface-variant line-through decoration-outline'
                      : 'bg-primary/8 text-on-surface'
                  }`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span
                    className={`grid size-4.5 flex-none place-items-center rounded-full border ${
                      isDone ? 'border-ok bg-ok-container text-ok' : 'border-outline text-transparent'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon name="check" size={12} strokeWidth={2.6} />
                  </span>
                  {l.title}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-outline-variant pt-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-warn">
              <Icon name="flame" size={14} /> 12-day streak
            </span>
            <span className="inline-flex items-center gap-1.5 text-primary">
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
    [
      'data-science',
      'data-analytics-one-on-one',
      'ai-driven-data-analytics',
      'data-engineering',
      'data-super-star',
      'business-analytics-gen-ai',
    ].includes(c.slug),
  )

  const inProgress = enrolled
    .map((slug) => COURSES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c) => !progressFor(c.slug).complete)
    .slice(0, 3)

  return (
    <>
      {/* ---- Hero ------------------------------------- */}
      <section className="border-b border-outline-variant bg-surface-lowest">
        <Wrap className="grid items-center gap-12 pt-[clamp(3rem,6vw,6.5rem)] pb-12 min-[880px]:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="flex flex-col items-start gap-6">
            <span className={EYEBROW}>{HERO.eyebrow}</span>

            <h1 className="text-display leading-[1.02] font-bold tracking-[-0.035em]">
              Become a <RotatingWord />
              <br />
              <span className="text-on-surface-variant">without going broke.</span>
            </h1>

            <p className="max-w-[58ch] text-lede text-on-surface-variant">
              {HERO.sub}
            </p>

            <div className="flex flex-wrap gap-3">
              {/* The only gradient button on the site. */}
              <Button to="/courses" size="lg" variant="brand" icon="arrow-right" className="btn--gradient">
                Explore courses
              </Button>
              <Wa message={WA_GENERAL} size="lg">
                Get details on WhatsApp
              </Wa>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-surface-variant">
              {[
                `Starts at ${formatINR(cheapest.priceINR)}`,
                'Daily 1-on-1 doubt clearing',
                'Interview prep from day one',
              ].map((point) => (
                <li key={point} className="inline-flex items-center gap-2">
                  <Icon name="check-circle" size={15} className="text-ok" /> {point}
                </li>
              ))}
            </ul>

            {/* Keeps the one-instructor brand present even though the
                panel, not the founder, now leads the hero. */}
            <p className="text-xs text-on-surface-variant">
              Every class taught by{' '}
              <Link
                to="/about"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline hover:underline-offset-[3px]"
              >
                {FOUNDER.name} <Icon name="arrow-right" size={12} />
              </Link>
            </p>
          </div>

          {/* The v1 hero visual: a mock of the product itself. The
              drift is on this wrapper, not the panel — the panel has
              its own entrance animation and one element cannot run
              both. */}
          <aside className="hero-drift [perspective:1400px]">
            <HeroPanel />
          </aside>
        </Wrap>

        {/* Marquee of the tools taught, masked at both ends so it
            fades rather than clipping mid-word. */}
        <div
          className="group flex select-none overflow-hidden border-t border-outline-variant bg-surface-container py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
          aria-hidden="true"
        >
          <div className="flex flex-none animate-[ticker_38s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[0, 1].map((pass) => (
              <span className="flex flex-none gap-8 pr-8" key={pass}>
                {TOOL_MARQUEE.map((t) => (
                  <span key={`${pass}-${t}`} className="font-mono text-xs whitespace-nowrap text-outline">
                    {t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Continue learning ------------------------ */}
      {inProgress.length > 0 && (
        <Section tight>
          <Wrap>
            <SectionHead
              eyebrow="Pick up where you left off"
              title="Continue learning"
              action={
                <Button to="/my-learning" variant="outline" size="sm" icon="arrow-right">
                  My learning
                </Button>
              }
            />
            <Grid>
              {inProgress.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} enrolledView />
              ))}
            </Grid>
          </Wrap>
        </Section>
      )}

      {/* ---- Course finder ---------------------------- */}
      <Section tight>
        <Wrap>
          <CourseFinder />
        </Wrap>
      </Section>

      {/* ---- Courses ---------------------------------- */}
      <Section>
        <Wrap>
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

          <Grid>
            {featured.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </Grid>
        </Wrap>
      </Section>

      {/* ---- Why -------------------------------------- */}
      <Section tone="alt">
        <Wrap>
          <SectionHead
            eyebrow="Learn by doing"
            title="Not a recorded course you never finish"
            sub="Concepts land through guided assignments and real projects, in live sessions where you can interrupt and ask."
          />

          <Grid>
            {PILLARS.map((p, i) => (
              <PillarCard key={p.title} pillar={p} index={i} />
            ))}
          </Grid>
        </Wrap>
      </Section>

      {/* ---- Projects ---------------------------------
          Real project lessons pulled from the curricula, not invented
          marketing examples. */}
      <Section>
        <Wrap>
          <SectionHead
            eyebrow="Learn by doing"
            title="Things you will actually build"
            sub="Every track ends with work that goes into your portfolio. These are real projects from the syllabus, not illustrations."
          />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-3">
            {PROJECTS.map((p, i) => (
              <Link
                to={`/courses/${p.slug}`}
                className="group rise flex items-center gap-4 rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset px-6 py-4 transition-[border-color,box-shadow] duration-500 ease-decelerate hover:border-primary/16 hover:shadow-e1"
                key={`${p.slug}-${p.title}`}
                style={{ '--i': Math.min(i, 6) } as React.CSSProperties}
              >
                <span className="flex-none font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <strong className="text-sm">{p.title}</strong>
                  <span className="text-xs text-outline">{p.course}</span>
                </span>
                <Icon
                  name="arrow-up-right"
                  size={15}
                  className="flex-none -translate-x-1 translate-y-1 text-outline opacity-0 transition-[opacity,transform,color] duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* ---- Stats ------------------------------------ */}
      <Section tight>
        <Wrap>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-6 rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset p-8 shadow-e1">
            {DEMO_STATS.map((s) => (
              <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
          <p className="mt-6 text-xs text-outline">
            Figures are illustrative demo content for this front-end build.
          </p>
        </Wrap>
      </Section>

      {/* ---- About me --------------------------------- */}
      <Section>
        <Wrap className="grid items-center gap-12 min-[880px]:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset px-6 py-8 text-center shadow-e1">
            <Avatar initials={FOUNDER.initials} size={72} />
            <strong className="mt-3 text-[1.15rem]">{FOUNDER.name}</strong>
            <span className="text-xs text-on-surface-variant">{FOUNDER.role}</span>
          </div>
          <div className="flex flex-col items-start gap-4">
            <span className="font-mono text-[0.6875rem] font-medium tracking-[0.09em] text-outline uppercase">
              About me
            </span>
            <h2 className="text-h2">Why I started CloudyData</h2>
            <blockquote className="border-l-[3px] border-primary pl-4 text-[1.2rem] leading-snug font-semibold">
              “{FOUNDER.mission}”
            </blockquote>
            <p className="max-w-[64ch] text-on-surface-variant">{FOUNDER.bio}</p>
            <div className="flex flex-wrap gap-3">
              <Button to="/about" variant="outline" icon="arrow-right">
                More about me
              </Button>
              <Wa message={WA_GENERAL}>Message me</Wa>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* ---- Testimonials ----------------------------- */}
      <Section tone="alt">
        <Wrap>
          <SectionHead eyebrow="Learner stories" title="Where people end up" />

          <Grid min={320}>
            {DEMO_TESTIMONIALS.map((t, i) => (
              <figure
                className="rise m-0 flex flex-col gap-4 rounded-lg border border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset p-6"
                key={t.name}
                style={{ '--i': i } as React.CSSProperties}
              >
                <Stars value={5} size={14} />
                <blockquote className="flex-1 text-sm leading-relaxed text-on-surface-variant">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3 border-t border-outline-variant pt-4">
                  <Avatar initials={t.initials} size={38} />
                  <span className="flex flex-col">
                    <strong className="text-sm">{t.name}</strong>
                    <span className="text-xs text-outline">
                      {t.role} · {t.course}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Grid>

          <p className="mt-6 text-xs text-outline">
            Testimonials are demo content written for this front-end build.
          </p>
        </Wrap>
      </Section>

      {/* ---- FAQ -------------------------------------- */}
      <Section>
        <Wrap narrow>
          <SectionHead eyebrow="Questions" title="Before you enroll" />
          <div className="flex flex-col">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* ---- CTA -------------------------------------- */}
      <CtaBand
        title="Not sure which track fits you?"
        actions={
          <>
            <Wa message={WA_GENERAL} size="lg" onDark>
              Message me on WhatsApp
            </Wa>
            <Button to="/courses" size="lg" variant="onDark">
              Browse all courses
            </Button>
          </>
        }
      >
        Message me on WhatsApp with where you are now and where you want to be. You will get an honest recommendation —
        including “none of these yet” if that is the true answer.
      </CtaBand>
    </>
  )
}
