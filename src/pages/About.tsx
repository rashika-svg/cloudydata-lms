/* ============================================================
   About Me.

   Written in the first person, as the real site is — CloudyData is
   one instructor, not a company with a team page.
   ============================================================ */

import { COURSES, formatINR } from '../data/courses'
import { CONTACT, DEMO_STATS, FOUNDER, PILLARS, WA_GENERAL, whatsappLink } from '../data/site'
import { Button } from '../components/ui/Button'
import { Icon, type IconName } from '../components/ui/Icon'
import { CtaBand, Grid, Section, Wrap } from '../components/ui/Layout'
import { Avatar, SectionHead, Stat } from '../components/ui/Primitives'
import { Wa } from '../components/ui/Wa'

const HOW: [string, string][] = [
  ['Pick a track', 'Ten programmes across data, engineering, marketing, security and BI. Unsure which fits? Message me — you get a straight recommendation, not the most expensive one.'],
  ['Join live classes', 'Real sessions with me present. Data Analytics runs one-on-one; the rest run as small live batches.'],
  ['Build, do not watch', 'Every concept is followed by a guided assignment, and every module by something that goes into your portfolio.'],
  ['Get unstuck daily', 'A teaching assistant is available every day for one-on-one doubt clearing, so a blocker never costs you a week.'],
  ['Interview from day one', 'CV crafting, LinkedIn, mock interviews and job search support run alongside the syllabus.'],
]

const SOCIAL: { label: string; href: string; icon: IconName }[] = [
  { label: 'LinkedIn', href: CONTACT.linkedin, icon: 'linkedin' },
  { label: 'Instagram', href: CONTACT.instagram, icon: 'instagram' },
  { label: 'WhatsApp', href: whatsappLink(WA_GENERAL), icon: 'whatsapp' },
]

export default function About() {
  const cheapest = COURSES.reduce((min, c) => (c.priceINR < min.priceINR ? c : min), COURSES[0]!)

  return (
    <>
      <section className="border-b border-outline-variant bg-surface-lowest pt-18 pb-12">
        <Wrap>
          <span className="mb-2 block font-mono text-[0.6875rem] font-medium tracking-[0.09em] text-outline uppercase">
            About me
          </span>
          <h1 className="max-w-[22ch] text-[clamp(1.9rem,1.3rem+2.6vw,3.1rem)]">
            I teach data because it changed my career — and it should not cost a fortune.
          </h1>
          <p className="mt-4 max-w-[64ch] text-on-surface-variant">
            Tracks start at {formatINR(cheapest.priceINR)}, every class is live, and I teach them myself.
          </p>
        </Wrap>
      </section>

      {/* ---- Bio -------------------------------------- */}
      <Section top>
        <Wrap className="grid items-center gap-12 min-[880px]:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-outline-variant bg-surface-lowest px-6 py-8 text-center shadow-e1">
            <Avatar initials={FOUNDER.initials} size={90} />
            <strong className="mt-3 text-[1.15rem]">{FOUNDER.name}</strong>
            <span className="text-xs text-on-surface-variant">{FOUNDER.role}</span>
            <div className="mt-4 flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-full border border-outline-variant text-on-surface-variant transition-[background-color,border-color,color] duration-200 hover:border-primary/20 hover:bg-primary/8 hover:text-primary"
                >
                  <Icon name={s.icon} size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <blockquote className="border-l-[3px] border-primary pl-4 text-[1.2rem] leading-snug font-semibold">
              “{FOUNDER.mission}”
            </blockquote>
            <p className="max-w-[64ch] text-on-surface-variant">{FOUNDER.bio}</p>
            <p className="max-w-[64ch] text-on-surface-variant">{FOUNDER.teaches}</p>
            <div className="flex flex-wrap gap-3">
              <Button to="/courses" variant="brand" icon="arrow-right">
                See the courses
              </Button>
              <Wa message={WA_GENERAL}>Message me</Wa>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* ---- Stats ------------------------------------ */}
      <Section tight>
        <Wrap>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-6 rounded-lg border border-outline-variant bg-surface-lowest p-8 shadow-e1">
            {DEMO_STATS.map((s) => (
              <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-outline">
            Figures are illustrative demo content for this front-end build.
          </p>
        </Wrap>
      </Section>

      {/* ---- How it works ----------------------------- */}
      <Section tone="alt">
        <Wrap>
          <SectionHead eyebrow="How it works" title="Five things happen, in this order" center />
          <ol className="mx-auto flex max-w-[860px] flex-col gap-3">
            {HOW.map(([step, body], i) => (
              <li
                key={step}
                className="rise flex gap-6 rounded-lg border border-outline-variant bg-surface-lowest p-6 transition-[transform,box-shadow] duration-300 hover:translate-x-1 hover:shadow-e2"
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="flex-none font-mono text-[1.2rem] font-semibold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="mb-1 text-[1.08rem]">{step}</h3>
                  <p className="text-sm text-on-surface-variant">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Wrap>
      </Section>

      {/* ---- Principles ------------------------------- */}
      <Section>
        <Wrap>
          <SectionHead eyebrow="What I hold to" title="Six principles, no exceptions" center />
          <Grid>
            {PILLARS.map((p, i) => (
              <article
                className="rise flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-lowest p-6 shadow-e1 transition-[transform,box-shadow] duration-300 ease-decelerate hover:-translate-y-1 hover:shadow-e3"
                key={p.title}
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="grid size-11 place-items-center rounded-md border border-outline-variant bg-surface-container text-on-surface-variant">
                  <Icon name={p.icon as IconName} size={19} />
                </span>
                <h3 className="text-[1.08rem]">{p.title}</h3>
                <p className="text-sm text-on-surface-variant">{p.body}</p>
              </article>
            ))}
          </Grid>
        </Wrap>
      </Section>

      <CtaBand
        title="Tell me where you are stuck."
        actions={
          <>
            <Wa message={WA_GENERAL} size="lg" onDark>
              Message me on WhatsApp
            </Wa>
            <Button to="/contact" size="lg" variant="onDark">
              Other ways to reach me
            </Button>
          </>
        }
      >
        Message me with your background and what you want to be doing in a year. I will point you at one track — or tell
        you honestly that none of them fit yet.
      </CtaBand>
    </>
  )
}
