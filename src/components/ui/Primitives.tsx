/* ============================================================
   Shared display primitives — Material 3, in Tailwind utilities.

   The one exception is Cover: its six geometric layouts are pure
   positional art driven by a hash, and expressing three absolutely
   positioned spans × six variants as utilities would be far less
   readable than the stylesheet it already has.
   ============================================================ */

import { useId, useState, type ReactNode } from 'react'
import { useCountUp } from '../../hooks/motion'
import { Icon, type IconName } from './Icon'
import { photoFor, photoSrc, photoSrcSet } from '../../data/photos'
import type { Accent, LessonKind } from '../../data/courses'

/** FNV-1a. Turns a slug into a stable number so generated artwork is
    identical on every render without storing anything. */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/* ---- Badge (M3 assist chip) ------------------------------ */

type BadgeTone = 'neutral' | 'brand' | 'ok' | 'warn' | 'dark'

const BADGE_TONE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-high text-on-surface-variant',
  brand: 'bg-primary-container text-on-primary-container',
  ok: 'bg-ok-container text-ok',
  warn: 'bg-warn-container text-warn',
  dark: 'bg-inverse-surface text-inverse-on-surface',
}

export function Badge({
  children,
  tone = 'neutral',
  icon,
  className = '',
}: {
  children: ReactNode
  tone?: BadgeTone
  icon?: IconName
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium whitespace-nowrap ${BADGE_TONE[tone]} ${className}`}
    >
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}

/* ---- Section head ----------------------------------------
   Always left-aligned. Centred heads gave every section a second
   axis to read from, and next to a left-aligned card grid the two
   never lined up — the eye had to reset at each band. */

export function SectionHead({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <span className="mb-2 block font-mono text-[0.6875rem] tracking-[0.09em] text-primary uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="max-w-[24ch] text-h2">{title}</h2>
        {sub && <p className="mt-3 max-w-[62ch] text-on-surface-variant">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}

/* ---- Stars -----------------------------------------------
   A muted row with a clipped gold row over it, so 4.7 shows a genuine
   partial star instead of being rounded. */

/* The dark bands (the detail hero, the CTA) are dark in BOTH themes,
   so they cannot use --star: its light-theme cut is a dark brown that
   disappears against them. `onDark` pins the gold to its dark-scheme
   value instead. */
const GOLD = { default: 'text-star', onDark: 'text-[#f0c04f]' }
const MUTED = { default: 'text-outline-variant', onDark: 'text-white/25' }

type StarTone = keyof typeof GOLD

export function Stars({ value, size = 13, tone = 'default' }: { value: number; size?: number; tone?: StarTone }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))

  return (
    <span className="relative inline-block leading-none" style={{ height: size }} aria-hidden="true">
      <span className={`flex gap-px ${MUTED[tone]}`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Icon key={i} name="star" size={size} filled />
        ))}
      </span>
      <span className={`absolute inset-0 flex gap-px overflow-hidden ${GOLD[tone]}`} style={{ width: `${pct}%` }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Icon key={i} name="star" size={size} filled />
        ))}
      </span>
    </span>
  )
}

export function Rating({
  value,
  learners,
  tone = 'default',
}: {
  value: number
  learners?: number
  tone?: StarTone
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap">
      <strong className={`font-semibold ${tone === 'onDark' ? GOLD.onDark : 'text-warn'}`}>{value.toFixed(1)}</strong>
      <Stars value={value} tone={tone} />
      {learners !== undefined && (
        <span className={`text-xs ${tone === 'onDark' ? 'text-white/50' : 'text-outline'}`}>
          ({learners.toLocaleString('en-IN')})
        </span>
      )}
    </span>
  )
}

/* ---- Progress -------------------------------------------- */

export function Progress({
  ratio,
  showValue = false,
  size = 'md',
}: {
  ratio: number
  showValue?: boolean
  size?: 'sm' | 'md'
}) {
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100)

  return (
    <div className="flex w-full items-center gap-3">
      <div
        className={`relative flex-1 overflow-hidden rounded-full bg-surface-high ${size === 'sm' ? 'h-1' : 'h-1.5'}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* scaleX keeps every increment on the compositor. */}
        <span
          className="absolute inset-0 origin-left rounded-full bg-primary transition-transform duration-700 ease-emphasized"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
      {showValue && <span className="shrink-0 font-mono text-xs text-on-surface-variant">{pct}%</span>}
    </div>
  )
}

export function Ring({
  ratio,
  size = 64,
  stroke = 5,
  children,
}: {
  ratio: number
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const clamped = Math.max(0, Math.min(1, ratio))
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.round(clamped * 100)
  // Several rings can share a page; a fixed id would collide.
  const gid = useId()

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="fill-none stroke-surface-high" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700 ease-emphasized"
          id={gid}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="relative font-mono text-xs font-semibold">{children ?? <strong>{pct}%</strong>}</div>
      <span className="sr-only">{pct}% complete</span>
    </div>
  )
}

/* ---- Animated statistic ---------------------------------- */

export function Stat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const { ref, value: shown } = useCountUp(value)

  return (
    <div className="flex min-w-0 flex-col gap-1 text-center">
      <span
        className="bg-[image:var(--grad-brand)] bg-clip-text text-stat leading-none font-bold tracking-[-0.026em] text-transparent tabular-nums"
        ref={ref}
      >
        {shown.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="text-sm text-on-surface-variant">{label}</span>
    </div>
  )
}

/* ---- Avatar ---------------------------------------------- */

export function Avatar({
  initials,
  src,
  size = 40,
  /* A square photo in a square frame means object-position does nothing —
     there is no overflow to pan. Framing a subject who is not centred
     therefore has to be a scale about a point, which is what these two
     express. Both default to no-ops, so a properly framed headshot needs
     neither and every existing call site is unaffected. */
  zoom = 1,
  focus = '50% 50%',
}: {
  initials: string
  src?: string
  size?: number
  zoom?: number
  focus?: string
}) {
  /* Same contract as Cover: the photo sits on top of what was already
     there, and a 404 or a dead network falls back to it rather than
     leaving a hole. */
  const [failed, setFailed] = useState(false)

  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary-container font-semibold tracking-wide text-on-primary-container"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
      {src && !failed && (
        <img
          className="absolute inset-0 size-full object-cover"
          style={zoom === 1 ? undefined : { transform: `scale(${zoom})`, transformOrigin: focus }}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}

/* ---- Cover art ------------------------------------------- */

export function Cover({
  slug,
  accent,
  /** Hint the browser to fetch this one early (hero / above the fold). */
  priority = false,
}: {
  slug: string
  accent: Accent
  priority?: boolean
}) {
  const variant = hash(slug) % 6
  const rot = hash(`${slug}:r`) % 4
  const photo = photoFor(slug)

  // If the photo 404s or the network is unavailable, fall back to the
  // generated art underneath rather than showing a broken image.
  const [failed, setFailed] = useState(false)
  const showPhoto = photo && !failed

  return (
    <div className={`cover cover--${variant}`} data-accent={accent} data-rot={rot} aria-hidden="true">
      {/* Generated geometry sits underneath as placeholder and fallback,
          so there is never an empty box while loading. */}
      <span className="cover__a" />
      <span className="cover__b" />
      <span className="cover__c" />

      {showPhoto && (
        <img
          className="cover__img"
          src={photoSrc(photo.id, 800)}
          srcSet={photoSrcSet(photo.id)}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 360px"
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
        />
      )}
    </div>
  )
}

/* ---- Lesson kind ----------------------------------------- */

const KIND: Record<LessonKind, { label: string; icon: IconName; cls: string }> = {
  video: { label: 'Lesson', icon: 'play', cls: 'bg-surface-high text-on-surface-variant' },
  lab: { label: 'Lab', icon: 'flask', cls: 'bg-warn-container text-warn' },
  project: { label: 'Project', icon: 'box', cls: 'bg-primary-container text-on-primary-container' },
  quiz: { label: 'Checkpoint', icon: 'help', cls: 'bg-ok-container text-ok' },
}

export function KindTag({ kind, showLabel = false }: { kind: LessonKind; showLabel?: boolean }) {
  const meta = KIND[kind]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-xs px-1.5 py-0.5 text-[0.6875rem] font-medium ${meta.cls}`}
      title={meta.label}
    >
      <Icon name={meta.icon} size={12} filled={kind === 'video'} />
      {showLabel ? meta.label : <span className="sr-only">{meta.label}</span>}
    </span>
  )
}

export function kindLabel(kind: LessonKind): string {
  return KIND[kind].label
}

/* ---- Empty state ----------------------------------------- */

export function Empty({
  icon = 'help',
  title,
  body,
  children,
}: {
  icon?: IconName
  title: string
  body?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-12 flex flex-col items-center gap-3 rounded-lg border border-dashed border-outline-variant bg-surface-low px-6 py-16 text-center">
      <span className="grid size-13 place-items-center rounded-full bg-surface-high text-on-surface-variant">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="text-h3">{title}</h3>
      {body && <p className="max-w-[52ch] text-sm text-on-surface-variant">{body}</p>}
      {children}
    </div>
  )
}
