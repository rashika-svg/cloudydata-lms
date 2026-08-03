/* ============================================================
   Course photography — Pexels.

   Kept in its own module, keyed by course slug, so swapping the
   source (or moving to self-hosted files) is a change to this file
   alone and never touches the catalogue.

   Licence: Pexels photos are free to use commercially and attribution
   is not required, but it is requested — so the photographer is
   credited on the course page and in the colophon.

   NOTE — these are hot-linked from the Pexels CDN. That means the
   site needs a network connection to show them and will break if
   Pexels ever changes its URL scheme. `npm run fetch-photos` writes
   local copies into /public and is the better option before this
   goes anywhere real. The geometric cover art remains underneath as
   the fallback, so a failed image degrades rather than breaks.
   ============================================================ */

export interface CoursePhoto {
  /** Pexels photo id — the number in the photo's URL. */
  id: number
  by: string
  alt: string
}

/** One photo per course, chosen for subject relevance. */
export const COURSE_PHOTOS: Record<string, CoursePhoto> = {
  'data-science': {
    id: 20232363,
    by: 'Jakub Zerdzicki',
    alt: 'Statistics displayed on a monitor beside printed charts and a calculator',
  },
  'data-analytics-one-on-one': {
    id: 7693745,
    by: 'Yan Krukau',
    alt: 'Two colleagues working through charts and graphs together on a laptop',
  },
  'ai-driven-data-analytics': {
    id: 8204311,
    by: 'Kampus Production',
    alt: 'A team discussing strategy in front of a wall of live data screens',
  },
  'data-engineering': {
    id: 37730212,
    by: 'Cookiecutter',
    alt: 'Server racks in a data centre',
  },
  'digital-marketing': {
    id: 6476260,
    by: 'Mikael Blomkvist',
    alt: 'A team working on marketing campaigns across laptops and tablets',
  },
  'data-super-star': {
    id: 6829536,
    by: 'Kampus Production',
    alt: 'Colleagues reviewing business analytics on a laptop',
  },
  'data-engineering-gen-ai': {
    id: 5203849,
    by: 'Brett Sayles',
    alt: 'Fibre-optic cabling running through a modern server room',
  },
  'advanced-digital-marketing-gen-ai': {
    id: 7651801,
    by: 'Kindel Media',
    alt: 'Hands analysing marketing performance data on a laptop and printed reports',
  },
  'cyber-security-ethical-hacking': {
    id: 5380792,
    by: 'Tima Miroshnichenko',
    alt: 'Two monitors showing code in a darkened room',
  },
  'business-analytics-gen-ai': {
    id: 37685036,
    by: 'Jakub Zerdzicki',
    alt: 'A bar chart being reviewed on a tablet in an office',
  },
}

const CDN = 'https://images.pexels.com/photos'

/**
 * Flip to true after running `npm run fetch-photos`, which writes
 * public/covers/<slug>-600.jpg and -1200.jpg. Self-hosting removes the
 * dependency on someone else's CDN and lets the files be cached with
 * the rest of the build.
 */
const USE_LOCAL_PHOTOS = false

/** Reverse lookup, so local filenames can be derived from an id. */
const SLUG_BY_ID = new Map(Object.entries(COURSE_PHOTOS).map(([slug, p]) => [p.id, slug]))

/** A single rendition at a given pixel width. */
export function photoSrc(id: number, w: number): string {
  if (USE_LOCAL_PHOTOS) {
    const slug = SLUG_BY_ID.get(id)
    // Only two local widths exist; anything larger maps to the 1200.
    if (slug) return `./covers/${slug}-${w > 600 ? 1200 : 600}.jpg`
  }
  return `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
}

/**
 * Widths chosen for where covers actually render: ~300px in the
 * catalogue grid, ~360px in the sticky enrollment card, and up to
 * ~800px on wide screens — doubled for high-DPI displays.
 */
export function photoSrcSet(id: number): string {
  const widths = USE_LOCAL_PHOTOS ? [600, 1200] : [400, 600, 800, 1200]
  return widths.map((w) => `${photoSrc(id, w)} ${w}w`).join(', ')
}

export function photoFor(slug: string): CoursePhoto | undefined {
  return COURSE_PHOTOS[slug]
}
