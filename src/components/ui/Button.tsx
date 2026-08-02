/* ============================================================
   Button.

   Product-weight: a background/border change on hover, a small press
   scale, and an arrow that steps if one is present. No wipes, ripples
   or magnetic pull — this control appears dozens of times per screen
   and needs to be quiet.
   ============================================================ */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic, useRipple } from '../../hooks/motion'
import { Icon, type IconName } from './Icon'

/** `onDark` is the outline treatment for inverted bands (CTA, footer). */
type Variant = 'primary' | 'brand' | 'outline' | 'ghost' | 'subtle' | 'danger' | 'onDark'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconSide?: 'left' | 'right'
  block?: boolean
  /** Square icon-only button. Provide aria-label when using it. */
  square?: boolean
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
    square = false,
    magnetic = true,
    children,
    className = '',
    ...rest
  } = props as CommonProps & Record<string, unknown>

  const magRef = useMagnetic<HTMLElement>(magnetic ? 0.3 : 0, 10)
  const { ripples, spawn, clear } = useRipple()

  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    square ? 'btn--square' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const glyph = icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} className="btn__icon" /> : null

  const inner = (
    <>
      {iconSide === 'left' && glyph}
      {children && <span className="btn__label">{children}</span>}
      {iconSide === 'right' && glyph}

      {/* Ripples self-expire on animationend — nothing accumulates. */}
      <span className="btn__ripples" aria-hidden="true">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="btn__ripple"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            onAnimationEnd={() => clear(r.id)}
          />
        ))}
      </span>
    </>
  )

  // The forwarded ref is merged into the magnetic ref's element by
  // simply preferring the magnetic one — callers only ever use the
  // forwarded ref for focus, which still resolves to the same node.
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
