/* ============================================================
   Icon set — Google Material Symbols (Rounded), inline SVG.

   The glyphs come from Google's own SVGs, shipped by the
   @material-symbols/svg-400 and -600 packages and pulled into
   icon-paths.ts by `npm run icons`. Only the icons listed in
   scripts/build-icons.mjs are generated, so the bundle carries this
   set and nothing else — no icon font, no network request, no FOUT.

   The name map lives in that script; edit it there and regenerate.

   Two props select a cut of the glyph:
     filled       the filled artwork, where one was generated
     strokeWidth  kept from the old hand-drawn set — ≥ 2.2 picks the
                  weight 600 cut, so the call sites that asked for a
                  heavier tick still get one

   Material has no brand marks, so WhatsApp, LinkedIn and Instagram
   stay hand-drawn on the original 24px grid.
   ============================================================ */

import { ICON_PATHS, type IconCuts } from './icon-paths'

type BrandName = 'whatsapp' | 'linkedin' | 'instagram'

export type IconName = keyof typeof ICON_PATHS | BrandName

/* Brand marks — drawn to the same 24px grid as the rest of the set. */
const BRAND: Record<BrandName, string> = {
  whatsapp:
    'M3.5 20.5l1.2-4.3A8 8 0 1 1 7.9 19.3zM9 8.4c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.5 0 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.1-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5z',
  linkedin: 'M4.5 4.5h15v15h-15zM8 10.5v6M8 7.6v.02M11.6 16.5v-6M11.6 12.6a2.4 2.4 0 0 1 4.8 0v3.9',
  instagram:
    'M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4ZM12 15.8a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6ZM17.2 6.9v.02',
}

const isBrand = (name: IconName): name is BrandName => name in BRAND

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  filled?: boolean
}

export function Icon({ name, size = 18, className, strokeWidth = 1.6, filled = false }: IconProps) {
  if (isBrand(name)) {
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
        <path d={BRAND[name]} />
      </svg>
    )
  }

  const cuts: IconCuts = ICON_PATHS[name]
  const d = (filled && cuts.f) || (strokeWidth >= 2.2 && cuts.b) || cuts.d

  return (
    <svg
      className={className ? `mi ${className}` : 'mi'}
      width={size}
      height={size}
      /* Material draws on a 960 grid with the origin at the baseline. */
      viewBox="0 -960 960 960"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}
