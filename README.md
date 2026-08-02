# CloudyData — live data-training website

A static front-end for [cloudydata.in](https://cloudydata.in): a one-instructor
training brand selling live classes in data analytics, data science and
engineering directly to individual learners.

It is built the way the real site works — **WhatsApp is the primary channel**,
"Enroll NOW" and "Get details on WhatsApp" are the paired calls to action, and
the copy is first person, because CloudyData is one person, not a company.

> **No UI library. No animation library. No CSS framework.**
> React, TypeScript, Vite and `react-router-dom`. Everything else is hand-written.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the production build
npm run typecheck
```

`dist/` must be served over HTTP (`npm run preview`), not opened from disk — ES
modules are blocked on `file://`. Hash routing plus `base: './'` means it drops
onto GitHub Pages, Netlify, S3 or a sub-directory with no server rewrites.

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero with the instructor card, tool ticker, featured courses, the "learn by doing" pillars, stats, About-me block, testimonials, FAQ, WhatsApp CTA |
| `/courses` | Catalogue with search, category filter and sort — **all held in the URL**, so any filtered view is linkable |
| `/courses/:slug` | Dark hero, what-you-will-learn, tools, full curriculum accordion, instructor bio, sticky enrolment card |
| `/my-learning` | Resume banner pointing at the exact lesson you left on, progress summary, your course cards |
| `/learn/:slug` | Lesson player — curriculum outline, video stage, notes, keyboard navigation |
| `/about` | About Me, first person, with the mission quote and social links |
| `/contact` | WhatsApp-first channel list with copy-to-clipboard, plus a validating form |

Every WhatsApp button is a **real `wa.me` deep link** with the message
pre-filled — course cards send *"I would like details about the Data Engineering
course — batch dates, fees and what is covered."*

---

## Typography

**Plus Jakarta Sans** for everything, **JetBrains Mono** for figures and labels.

Jakarta is a humanist geometric — rounder and wider than a grotesque — so the
tracking tokens are deliberately looser than a tight industrial face would want.
Over-tightening closes its counters and costs exactly the warmth that is the
reason for choosing it. Display and body track independently via
`--track-display` and `--track-h`.

---

## Scrolling and motion

**Native smooth scrolling**, plus `scroll-padding-top` so anchored jumps clear
the sticky header.

Deliberately *not* transform-based momentum scrolling (the Lenis-style lerp): it
requires translating a wrapper, which disables `position: sticky` — and the
header, enrolment card, contact channels and player outline all depend on it.

**Scroll-driven reveals use native CSS** (`animation-timeline: view()`), gated
behind `@supports` and `prefers-reduced-motion: no-preference`. If the feature is
missing, nothing applies and the content simply shows. An earlier build used an
IntersectionObserver that set `opacity: 0` until it fired; when it did not fire,
the whole page rendered blank. Entrances now cannot fail closed, and the built
CSS is audited for exactly that.

### Microinteractions

Collected in [`styles/micro.css`](src/styles/micro.css) so the interaction
language is reviewable in one place:

- **Reading progress bar** under the header — `scaleX`, never touches layout
- **Back to top** whose ring fills with scroll progress, so it reports position as
  well as offering an exit; leaves the tab order while invisible
- **WhatsApp glyph tilts** like a handset being picked up — only on the one
  action the whole site points at
- **Enrol confirmation** flashes in place before the card swaps state, so the
  click is acknowledged where you clicked it
- **Copy the number**: glyph and label swap to a tick, then revert on their own
- **Logo bars stagger**, **lesson rows nudge** toward their link, **play control
  has a pulsing halo**, **live dots pulse**
- Completing a lesson **draws** its tick via `stroke-dashoffset`
- Curriculum accordions animate a *measured* height — `height: auto` is not
  animatable, so the panel measures itself, drives pixels, then releases

All of it collapses through one `--motion` token under reduced-motion; the
infinite loops stop outright rather than running fast.

---

## Look

Warm off-white paper with a **subtle grain overlay** — faithful to the real
site's texture treatment, and it stops large light areas reading as flat digital
fill. Sits behind content, never blended over it, so body text is not muddied.

Depth comes from **layered shadows** (tight contact + wide ambient + an inset top
highlight) rather than one blurred drop, which reads flat.

Brand red for actions; **WhatsApp green used only on WhatsApp actions**, because
the recognisability is the point and spending it elsewhere would dilute it.

---

## Structure

```
src/
  data/         courses.ts (catalogue + curricula), site.ts (contact, copy)
  hooks/        motion.ts (inView, countUp, scroll progress, copy, measured height)
                util.ts   (persistent state, hotkeys, media query, scroll lock)
  store/        app.tsx — enrolments, progress, theme, toasts
  components/
    site/       Header, Footer, SiteLayout, BackToTop
    ui/         Button, Icon, Primitives, Accordion, Toaster
    CourseCard.tsx
  pages/        Home, Courses, CourseDetail, About, Contact,
                MyLearning, Learn, NotFound
  styles/       tokens.css → base.css → components.css → pages.css → micro.css
```

No backend. `localStorage` holds enrolments, completed lessons, the resume point
and theme, synced across tabs. Course covers are generated — each slug hashes
into one of six geometric layouts in the course's accent colour, so there are
zero image assets.

## Accessibility

Skip link, one focus-visible treatment, scroll lock on the mobile drawer, `inert`
on collapsed accordion panels, `aria-live` on result counts, `aria-pressed` on
filters, and keyboard shortcuts (`J` `K` `M`, arrows) that never fire from inside
a text field.

## Bundle

~103 KB gzipped on first load (68 KB of that is React + router). Routes are
code-split at 0.4–2.6 KB gzipped each.

---

## Content accuracy

Course titles, durations, prices, tools, the founder's bio and mission, the
contact numbers and social links all mirror cloudydata.in.

**Two caveats worth knowing:**

1. **Prices need verifying.** Two separate fetches of the live site disagreed on
   whether Data Science is ₹82,000 or ₹27,000 (with AI-Driven Analytics taking
   the other). This build uses ₹82,000 for Data Science, since an 8-month
   combined track at ₹54,000 makes the alternative incoherent — but check it.
2. **Ratings, learner counts and testimonials are invented.** The live site
   publishes none of these. They are `DEMO_STATS` / `DEMO_TESTIMONIALS` in
   `src/data/site.ts` and are labelled as illustrative in the UI.

Lesson-level syllabi are derived from the tools each track advertises, since the
public site lists modules but not lessons. Enrolment, payment and class delivery
are not implemented — this is a front-end demo, not an affiliated product.
