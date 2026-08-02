/* ============================================================
   Shared display primitives.
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

/* ---- Badge ----------------------------------------------- */

type BadgeTone = 'neutral' | 'brand' | 'ok' | 'warn' | 'dark'

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
    <span className={`badge badge--${tone} ${className}`.trim()}>
      {icon && <Icon name={icon} size={12} strokeWidth={2} />}
      {children}
    </span>
  )
}

/* ---- Section head ---------------------------------------- */

export function SectionHead({
  eyebrow,
  title,
  sub,
  action,
  center = false,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  action?: ReactNode
  center?: boolean
}) {
  return (
    <header className={`shead ${center ? 'shead--center' : ''}`}>
      <div>
        {eyebrow && <span className="shead__eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action && <div className="shead__action">{action}</div>}
    </header>
  )
}

/* ---- Stars -----------------------------------------------
   A grey row with a clipped gold row over it, so 4.7 shows a genuine
   partial star instead of being rounded. */

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))

  return (
    <span className="stars" style={{ '--size': `${size}px` } as React.CSSProperties} aria-hidden="true">
      <span className="stars__row stars__row--bg">
        {Array.from({ length: 5 }, (_, i) => (
          <Icon key={i} name="star" size={size} filled />
        ))}
      </span>
      <span className="stars__row stars__row--fg" style={{ width: `${pct}%` }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Icon key={i} name="star" size={size} filled />
        ))}
      </span>
    </span>
  )
}

export function Rating({ value, learners }: { value: number; learners?: number }) {
  return (
    <span className="rating">
      <strong>{value.toFixed(1)}</strong>
      <Stars value={value} />
      {learners !== undefined && <span className="rating__n">({learners.toLocaleString('en-IN')})</span>}
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
    <div className={`prog prog--${size}`}>
      <div className="prog__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        {/* scaleX keeps every increment on the compositor. */}
        <span className="prog__fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      {showValue && <span className="prog__val">{pct}%</span>}
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
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="ring__fill"
          id={gid}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring__mid">{children ?? <strong>{pct}%</strong>}</div>
      <span className="sr-only">{pct}% complete</span>
    </div>
  )
}

/* ---- Animated statistic ---------------------------------- */

export function Stat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const { ref, value: shown } = useCountUp(value)

  return (
    <div className="stat">
      <span className="stat__value" ref={ref}>
        {shown.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="stat__label">{label}</span>
    </div>
  )
}

/* ---- Avatar ---------------------------------------------- */

export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initials}
    </span>
  )
}

/* ---- Cover art -------------------------------------------
   No image assets in a static build, so each course gets a
   deterministic geometric cover from its slug: same course, same
   artwork, every time, no network request. */

export function Cover({
  slug,
  accent,
  label,
  /** Hint the browser to fetch this one early (hero / above the fold). */
  priority = false,
}: {
  slug: string
  accent: Accent
  label?: string
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
      {/* Generated geometry sits underneath as the placeholder and the
          fallback, so there is never an empty box while loading. */}
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

      {label && <span className="cover__label">{label}</span>}
    </div>
  )
}

/* ---- Lesson kind ----------------------------------------- */

const KIND: Record<LessonKind, { label: string; icon: IconName }> = {
  video: { label: 'Lesson', icon: 'play' },
  lab: { label: 'Lab', icon: 'flask' },
  project: { label: 'Project', icon: 'box' },
  quiz: { label: 'Checkpoint', icon: 'help' },
}

export function KindTag({ kind, showLabel = false }: { kind: LessonKind; showLabel?: boolean }) {
  const meta = KIND[kind]
  return (
    <span className={`kind kind--${kind}`} title={meta.label}>
      <Icon name={meta.icon} size={12} strokeWidth={2} filled={kind === 'video'} />
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
    <div className="empty">
      <span className="empty__icon">
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {children}
    </div>
  )
}
