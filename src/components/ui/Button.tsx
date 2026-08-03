/* ============================================================
   Button — Material 3, in Tailwind utilities.

   Every variant shares one interaction model: a state layer at 8%
   hover / 10% focus / 10% press, applied by the `state-layer`
   component class rather than a hand-picked hover colour per variant.

   Magnetic pull and ripple stay as component classes because both are
   driven by custom properties written from hooks at pointer speed.
   ============================================================ */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic, useRipple } from '../../hooks/motion'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'brand' | 'outline' | 'ghost' | 'subtle' | 'danger' | 'onDark'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'state-layer magnetic group/btn inline-flex items-center justify-center gap-2 rounded-full ' +
  'border border-transparent font-semibold leading-tight whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow] duration-200 ' +
  'disabled:cursor-not-allowed disabled:bg-on-surface/12 disabled:text-on-surface/40 ' +
  'disabled:border-transparent disabled:shadow-none'

const VARIANT: Record<Variant, string> = {
  /* Filled — highest emphasis. */
  brand: 'bg-primary text-on-primary hover:not-disabled:shadow-e1',
  /* Filled, neutral. */
  primary: 'bg-on-surface text-surface',
  /* Filled tonal — the M3 workhorse. */
  subtle: 'bg-secondary-container text-on-secondary-container',
  outline: 'border-outline text-primary',
  ghost: 'text-primary',
  danger: 'bg-error-container text-on-error-container',
  onDark: 'border-white/40 text-white',
}

const SIZE: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconSide?: 'left' | 'right'
  block?: boolean
  /** Disable the magnetic pull — useful in dense toolbars. */
  magnetic?: boolean
  children?: ReactNode
  className?: string
}

interface AsButton extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  to?: undefined
  href?: undefined
}

interface AsLink extends CommonProps {
  to: string
  href?: undefined
  onClick?: () => void
  title?: string
  'aria-label'?: string
}

interface AsAnchor extends CommonProps {
  href: string
  to?: undefined
  target?: string
  rel?: string
  onClick?: () => void
  'aria-label'?: string
}

export type ButtonProps = AsButton | AsLink | AsAnchor

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, _ref) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconSide = 'right',
    block = false,
    magnetic = true,
    children,
    className = '',
    ...rest
  } = props as CommonProps & Record<string, unknown>

  const magRef = useMagnetic<HTMLElement>(magnetic ? 0.3 : 0, 10)
  const { ripples, spawn, clear } = useRipple()

  const classes = [
    BASE,
    VARIANT[variant],
    SIZE[size],
    variant === 'ghost' ? 'px-3' : '',
    block ? 'flex w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const glyph = icon ? (
    <Icon
      name={icon}
      size={size === 'lg' ? 18 : 16}
      className="shrink-0 transition-transform duration-200 group-hover/btn:not-disabled:translate-x-0.5"
    />
  ) : null

  const inner = (
    <>
      {iconSide === 'left' && glyph}
      {children && <span>{children}</span>}
      {iconSide === 'right' && glyph}

      {/* Ripples self-expire on animationend — nothing accumulates. */}
      <span className="ripple-host" aria-hidden="true">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            onAnimationEnd={() => clear(r.id)}
          />
        ))}
      </span>
    </>
  )

  const shared = { className: classes, onPointerDown: spawn, ...rest }

  if ('to' in props && props.to !== undefined) {
    return (
      <Link ref={magRef as React.Ref<HTMLAnchorElement>} {...shared} to={props.to}>
        {inner}
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    return (
      <a ref={magRef as React.Ref<HTMLAnchorElement>} {...shared} href={props.href}>
        {inner}
      </a>
    )
  }

  return (
    <button ref={magRef as React.Ref<HTMLButtonElement>} type="button" {...shared}>
      {inner}
    </button>
  )
})
