/* ============================================================
   Course catalogue.

   Search, category and sort live in the URL, so any filtered view is
   linkable and the home page can deep-link into a category.
   ============================================================ */

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, COURSES, formatINR, type CategoryFilter } from '../data/courses'
import { WA_GENERAL } from '../data/site'
import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Grid, PageHead, Section, Wrap } from '../components/ui/Layout'
import { Empty } from '../components/ui/Primitives'
import { Wa } from '../components/ui/Wa'

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'duration' | 'rating'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Most popular' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'duration', label: 'Shortest first' },
  { key: 'rating', label: 'Highest rated' },
]

/* M3 filter chip: outlined at rest, tonal when selected, with the
   state layer doing the hover and press. */
const CHIP =
  'state-layer inline-flex items-center gap-1.5 rounded-sm border px-3.5 py-2 text-sm font-medium ' +
  'transition-[background-color,border-color,color] duration-200'

export default function Courses() {
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const category = (params.get('cat') as CategoryFilter | null) ?? 'All'
  const sort = (params.get('sort') as SortKey | null) ?? 'popular'

  const patch = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') p.delete(k)
      else p.set(k, v)
    }
    setParams(p, { replace: true })
  }

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()

    const filtered = COURSES.filter((c) => {
      if (category !== 'All' && c.category !== category) return false
      if (!needle) return true
      const hay = `${c.title} ${c.short} ${c.tagline} ${c.category} ${c.level} ${c.tools.join(' ')}`
      return hay.toLowerCase().includes(needle)
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.priceINR - b.priceINR)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.priceINR - a.priceINR)
        break
      case 'duration':
        // Flexible-schedule tracks have no month count — park them last.
        sorted.sort((a, b) => (a.months ?? 99) - (b.months ?? 99))
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating || b.learners - a.learners)
        break
      default:
        sorted.sort((a, b) => b.learners - a.learners)
    }
    return sorted
  }, [q, category, sort])

  const prices = COURSES.map((c) => c.priceINR)
  const active = q !== '' || category !== 'All' || sort !== 'popular'

  return (
    <>
      <PageHead
        title="Live courses"
        action={<Wa message={WA_GENERAL}>Not sure which one? Ask me on WhatsApp</Wa>}
      >
        {COURSES.length} tracks from {formatINR(Math.min(...prices))} to {formatINR(Math.max(...prices))}. Every one is
        taught live, with guided assignments, real projects and daily doubt clearing.
      </PageHead>

      <Section top>
        <Wrap>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex h-11.5 min-w-65 flex-1 items-center gap-2 rounded-full border border-outline bg-surface-lowest px-4 text-outline transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px] focus-within:shadow-primary/8">
              <Icon name="search" size={17} />
              <input
                type="search"
                value={q}
                onChange={(e) => patch({ q: e.target.value })}
                placeholder="Search a skill or tool — SQL, Power BI, Airflow…"
                aria-label="Search courses"
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => patch({ q: null })}
                  aria-label="Clear search"
                  className="grid place-items-center text-outline hover:text-on-surface"
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </div>

            <label className="relative flex items-center">
              <span className="sr-only">Sort courses</span>
              <select
                value={sort}
                onChange={(e) => patch({ sort: e.target.value })}
                className="h-11.5 cursor-pointer appearance-none rounded-full border border-outline bg-surface-lowest pr-10 pl-4 text-sm outline-none focus:border-primary"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-4 text-outline" />
            </label>
          </div>

          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${CHIP} ${
                  category === cat
                    ? 'border-transparent bg-secondary-container text-on-secondary-container'
                    : 'border-outline text-on-surface-variant'
                }`}
                aria-pressed={category === cat}
                onClick={() => patch({ cat: cat === 'All' ? null : cat })}
              >
                <span>{cat}</span>
                <span className="font-mono text-[0.6875rem] opacity-70">
                  {cat === 'All' ? COURSES.length : COURSES.filter((c) => c.category === cat).length}
                </span>
              </button>
            ))}
            {active && (
              <button
                type="button"
                className={`${CHIP} border-dashed border-primary text-primary`}
                onClick={() => setParams({}, { replace: true })}
              >
                <Icon name="rotate" size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <p className="mb-6 text-sm text-on-surface-variant" aria-live="polite">
            <strong className="text-on-surface">{results.length}</strong>{' '}
            {results.length === 1 ? 'course' : 'courses'}
            {category !== 'All' && <> in {category}</>}
            {q.trim() && <> matching “{q.trim()}”</>}
          </p>

          {results.length === 0 ? (
            <Empty
              icon="search"
              title="No courses match that"
              body="Try a broader term — every track is indexed by the tools it teaches, like “SQL”, “Spark” or “Power BI”."
            >
              <Button variant="outline" onClick={() => setParams({}, { replace: true })} icon="rotate" iconSide="left">
                Reset filters
              </Button>
            </Empty>
          ) : (
            <Grid key={`${q}-${category}-${sort}`}>
              {results.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </Grid>
          )}
        </Wrap>
      </Section>
    </>
  )
}
