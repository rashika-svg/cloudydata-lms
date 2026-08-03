/* ============================================================
   WhatsApp action.

   Its own component rather than a Button variant: the green is a
   recognised brand signal, and spending it anywhere else would
   dilute what it means. WhatsApp is how the real business takes
   enquiries, so this is a genuine wa.me deep link with the message
   already written.

   M3 shape and state layer, WhatsApp's colour.
   ============================================================ */

import type { ReactNode } from 'react'
import { whatsappLink } from '../../data/site'
import { Icon } from './Icon'

type WaSize = 'sm' | 'md' | 'lg' | 'icon'

const SIZE: Record<WaSize, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
  icon: 'size-9.5 shrink-0 p-0',
}

const ICON_SIZE: Record<WaSize, number> = { sm: 16, md: 17, lg: 18, icon: 17 }

export function Wa({
  message,
  children,
  size = 'md',
  block = false,
  /** Outlined treatment for the dark CTA bands — a solid green slab
      was the loudest thing on the page. The fill arrives on hover. */
  onDark = false,
  className = '',
  ...rest
}: {
  message: string
  children?: ReactNode
  size?: WaSize
  block?: boolean
  onDark?: boolean
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const tone = onDark
    ? 'border-wa/50 bg-wa/10 text-wa hover:border-wa hover:bg-wa hover:text-wa-ink'
    : 'border-transparent bg-wa/20 text-wa-dark'

  return (
    <a
      className={`state-layer inline-flex items-center justify-center gap-2 rounded-full border font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow] duration-200 hover:shadow-e1 ${SIZE[size]} ${tone} ${block ? 'flex w-full' : ''} ${className}`}
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      <Icon name="whatsapp" size={ICON_SIZE[size]} />
      {children && <span>{children}</span>}
    </a>
  )
}
