/* ============================================================
   Icon set — inline SVG on a 24px grid, stroke-based.

   Dependency-free: each glyph is a path string, so the whole set is a
   couple of kilobytes and inherits colour and stroke weight from CSS.
   ============================================================ */

export type IconName =
  | 'home'
  | 'book'
  | 'calendar'
  | 'clipboard'
  | 'award'
  | 'certificate'
  | 'bell'
  | 'search'
  | 'settings'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'menu'
  | 'close'
  | 'play'
  | 'check'
  | 'check-circle'
  | 'circle'
  | 'clock'
  | 'user'
  | 'users'
  | 'filter'
  | 'plus'
  | 'minus'
  | 'external'
  | 'download'
  | 'chart'
  | 'layers'
  | 'sun'
  | 'moon'
  | 'panel'
  | 'more'
  | 'alert'
  | 'flask'
  | 'box'
  | 'help'
  | 'video'
  | 'flame'
  | 'target'
  | 'code'
  | 'briefcase'
  | 'spark'
  | 'shield'
  | 'rotate'
  | 'mail'
  | 'message'
  | 'star'
  | 'lock'
  | 'grid'
  | 'list'
  | 'command'
  | 'whatsapp'
  | 'linkedin'
  | 'instagram'

const P: Record<IconName, string> = {
  home: 'M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4z',
  book: 'M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3zM17 7.5h2V20H8M5 17a3 3 0 0 1 3-3h9',
  calendar: 'M4 6h16v14H4zM4 10h16M8.5 3.5v4M15.5 3.5v4M8 14h2.5',
  clipboard: 'M9 4.5h6v2.5H9zM9 5.5H6.5v15h11v-15H15M9 12h6M9 16h4',
  award: 'M12 14.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10ZM8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5',
  certificate: 'M4 5h16v11H4zM8 9h8M8 12.5h5M9 16v4l3-1.5L15 20v-4',
  bell: 'M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10ZM10 18.5a2 2 0 0 0 4 0',
  search: 'M11 18.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15ZM20.5 20.5l-4.2-4.2',
  settings:
    'M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM12 2.8l1.4 2.3 2.7-.5.6 2.6 2.4 1.3-1.2 2.4 1.2 2.4-2.4 1.3-.6 2.6-2.7-.5L12 21.2l-1.4-2.3-2.7.5-.6-2.6-2.4-1.3L6.1 13 4.9 10.6l2.4-1.3.6-2.6 2.7.5z',
  'chevron-left': 'm14 6-6 6 6 6',
  'chevron-right': 'm10 6 6 6-6 6',
  'chevron-down': 'm6 9.5 6 6 6-6',
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  play: 'M8 5.5v13l11-6.5z',
  check: 'M4.5 12.5 9.5 17.5 19.5 6.5',
  'check-circle': 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM8 12l3 3 5-6',
  circle: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z',
  clock: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM12 7v5.2l3.4 2',
  user: 'M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8ZM4.5 20.5a7.5 7.5 0 0 1 15 0',
  users: 'M15.5 20.5v-1.5a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v1.5M9.5 11a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7ZM20.5 20.5V19a4 4 0 0 0-3-3.9M16.5 4.2a4 4 0 0 1 0 6.8',
  filter: 'M4 6h16l-6 7v6l-4-2v-4z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  external: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5.5H4.5V6H10',
  download: 'M12 4v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15',
  chart: 'M4 20V4M4 20h16M8 20v-7M12.5 20V8M17 20v-4.5',
  layers: 'm12 3 8.5 4.5L12 12 3.5 7.5 12 3ZM3.5 12 12 16.5 20.5 12M3.5 16.5 12 21l8.5-4.5',
  sun: 'M12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9ZM12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8',
  moon: 'M20 14.2A8.5 8.5 0 0 1 9.8 4 7.2 7.2 0 1 0 20 14.2Z',
  panel: 'M4 5h16v14H4zM10 5v14',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  alert: 'M12 3.5 21.5 20H2.5zM12 10v4.5M12 17.5h.01',
  flask: 'M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9',
  box: 'M12 3 4 7v10l8 4 8-4V7l-8-4ZM4 7l8 4 8-4M12 21V11',
  help: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5v.4M12 17h.01',
  video: 'M3.5 6.5h11v11h-11zM14.5 10.5l6-3v9l-6-3z',
  flame: 'M12 21c3.3 0 5.5-2.2 5.5-5.2 0-3.6-3-4.6-2.4-8.8-2.2.5-3.4 2.2-3.4 4-1-.6-1.3-1.9-1-3.4C8.4 8.9 6.5 11.5 6.5 15.3 6.5 18.7 8.7 21 12 21Z',
  target: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9ZM12 13.4a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z',
  code: 'M8.5 8.5 4 12l4.5 3.5M15.5 8.5 20 12l-4.5 3.5M13.5 4.5l-3 15',
  briefcase: 'M3.5 7.5h17v12h-17zM9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17M11 11.5h2v2h-2z',
  spark: 'M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8zM18.5 4v3M17 5.5h3',
  shield: 'M12 3.5 20 6v6.1c0 4-3.2 6.7-8 8.4-4.8-1.7-8-4.4-8-8.4V6zM9 12.2l2.2 2.2 4.3-4.6',
  rotate: 'M20 12a8 8 0 1 1-2.6-5.9M20 4v4.5h-4.5',
  mail: 'M3.5 6h17v12h-17zM3.5 6.5 12 13l8.5-6.5',
  message: 'M20.5 12.5c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 21l1.4-3.6A6.9 6.9 0 0 1 3.5 12.5c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z',
  star: 'm12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.8z',
  lock: 'M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list: 'M8.5 6H20M8.5 12H20M8.5 18H20M4 6h.01M4 12h.01M4 18h.01',
  command: 'M9 6.5a2.5 2.5 0 1 0-2.5 2.5H9V6.5ZM9 9h6v6H9zM15 9h2.5A2.5 2.5 0 1 0 15 6.5V9ZM15 15v2.5A2.5 2.5 0 1 0 17.5 15H15ZM9 15H6.5A2.5 2.5 0 1 0 9 17.5V15Z',
  // Brand marks — drawn to the same 24px grid as the rest of the set.
  whatsapp:
    'M3.5 20.5l1.2-4.3A8 8 0 1 1 7.9 19.3zM9 8.4c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.5 0 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.1-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5z',
  linkedin:
    'M4.5 4.5h15v15h-15zM8 10.5v6M8 7.6v.02M11.6 16.5v-6M11.6 12.6a2.4 2.4 0 0 1 4.8 0v3.9',
  instagram:
    'M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4ZM12 15.8a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6ZM17.2 6.9v.02',
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  filled?: boolean
}

export function Icon({ name, size = 18, className, strokeWidth = 1.6, filled = false }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={P[name]} fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} />
    </svg>
  )
}
