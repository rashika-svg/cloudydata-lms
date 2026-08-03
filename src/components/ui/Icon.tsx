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

   Material carries no logos, so WhatsApp, LinkedIn and Instagram come
   from each company's own artwork instead — solid marks on a 24px
   grid, generated into the same file.
   ============================================================ */

import { BRAND_PATHS, ICON_PATHS, type IconCuts } from './icon-paths'

type BrandName = keyof typeof BRAND_PATHS

export type IconName = keyof typeof ICON_PATHS | BrandName

const isBrand = (name: IconName): name is BrandName => name in BRAND_PATHS

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  filled?: boolean
}

export function Icon({ name, size = 18, className, strokeWidth = 1.6, filled = false }: IconProps) {
  /* Every icon carries .mi — brand marks included — so stylesheet rules
     can address the icon set without catching the progress rings. */
  const cls = className ? `mi ${className}` : 'mi'

  if (isBrand(name)) {
    return (
      <svg
        className={cls}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d={BRAND_PATHS[name]} />
      </svg>
    )
  }

  const cuts: IconCuts = ICON_PATHS[name]
  const d = (filled && cuts.f) || (strokeWidth >= 2.2 && cuts.b) || cuts.d

  return (
    <svg
      className={cls}
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
