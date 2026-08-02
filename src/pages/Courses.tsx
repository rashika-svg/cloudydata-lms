/* ============================================================
   Course catalogue.

   Search, category and sort live in the URL, so any filtered view is
   linkable and the home page can deep-link into a category.
   ============================================================ */

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, COURSES, formatINR, type CategoryFilter } from '../data/courses'
import { WA_GENERAL, whatsappLink } from '../data/site'
import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Empty } from '../components/ui/Primitives'

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'duration' | 'rating'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Most popular' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'duration', label: 'Shortest first' },
  { key: 'rating', label: 'Highest rated' },
]

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
      <section className="phead">
        <div className="wrap">
          <h1>Live courses</h1>
          <p>
            {COURSES.length} tracks from {formatINR(Math.min(...prices))} to {formatINR(Math.max(...prices))}. Every one
            is taught live, with guided assignments, real projects and daily doubt clearing.
          </p>
          <a className="wa" href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={17} />
            <span>Not sure which one? Ask me on WhatsApp</span>
          </a>
        </div>
      </section>

      <section className="section section--top">
        <div className="wrap">
          <div className="toolbar">
            <div className="toolbar__search">
              <Icon name="search" size={17} />
              <input
                type="search"
                value={q}
                onChange={(e) => patch({ q: e.target.value })}
                placeholder="Search a skill or tool — SQL, Power BI, Airflow…"
                aria-label="Search courses"
              />
              {q && (
                <button type="button" onClick={() => patch({ q: null })} aria-label="Clear search">
                  <Icon name="close" size={15} />
                </button>
              )}
            </div>

            <label className="toolbar__sort">
              <span className="sr-only">Sort courses</span>
              <select value={sort} onChange={(e) => patch({ sort: e.target.value })}>
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={15} />
            </label>
          </div>

          <div className="chips" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${category === cat ? 'is-on' : ''}`}
                aria-pressed={category === cat}
                onClick={() => patch({ cat: cat === 'All' ? null : cat })}
              >
                {cat}
                <span>{cat === 'All' ? COURSES.length : COURSES.filter((c) => c.category === cat).length}</span>
              </button>
            ))}
            {active && (
              <button type="button" className="chip chip--clear" onClick={() => setParams({}, { replace: true })}>
                <Icon name="rotate" size={13} /> Reset
              </button>
            )}
          </div>

          <p className="results" aria-live="polite">
            <strong>{results.length}</strong> {results.length === 1 ? 'course' : 'courses'}
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
            <div className="grid grid--3" key={`${q}-${category}-${sort}`}>
              {results.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
