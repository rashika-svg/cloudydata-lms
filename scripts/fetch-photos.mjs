/* ============================================================
   Download the course photography from Pexels into /public.

   Hot-linking works, but it makes the site depend on someone else's
   CDN: no offline, no control over caching, and it breaks silently if
   Pexels changes its URL scheme. Run this once, then flip
   USE_LOCAL_PHOTOS in src/data/photos.ts.

     npm run fetch-photos

   Re-running skips files that already exist; pass --force to refetch.
   ============================================================ */

import { mkdir, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'public', 'covers')
const FORCE = process.argv.includes('--force')

/* Kept in step with src/data/photos.ts. */
const PHOTOS = {
  'data-science': 20232363,
  'data-analytics-one-on-one': 7693745,
  'ai-driven-data-analytics': 8204311,
  'data-engineering': 37730212,
  'digital-marketing': 6476260,
  'data-super-star': 6829536,
  'data-engineering-gen-ai': 5203849,
  'advanced-digital-marketing-gen-ai': 7651801,
  'cyber-security-ethical-hacking': 5380792,
  'business-analytics-gen-ai': 37685036,
}

/** Two widths is enough: a 1x grid card and a 2x retina rendition. */
const WIDTHS = [600, 1200]

const url = (id, w) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const exists = (p) =>
  access(p)
    .then(() => true)
    .catch(() => false)

async function download(slug, id, w) {
  const file = join(OUT, `${slug}-${w}.jpg`)

  if (!FORCE && (await exists(file))) {
    console.log(`skip  ${slug}-${w}.jpg`)
    return { ok: true, skipped: true }
  }

  try {
    const res = await fetch(url(id, w))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const buf = Buffer.from(await res.arrayBuffer())
    // A truncated or error-page response is worse than no file at all,
    // because it fails at render time instead of here.
    if (buf.length < 4096) throw new Error(`suspiciously small (${buf.length} bytes)`)

    await writeFile(file, buf)
    console.log(`ok    ${slug}-${w}.jpg  ${(buf.length / 1024).toFixed(0)} KB`)
    return { ok: true }
  } catch (err) {
    console.error(`FAIL  ${slug}-${w}.jpg  ${err instanceof Error ? err.message : err}`)
    return { ok: false }
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })

  const jobs = []
  for (const [slug, id] of Object.entries(PHOTOS)) {
    for (const w of WIDTHS) jobs.push(download(slug, id, w))
  }

  const results = await Promise.all(jobs)
  const failed = results.filter((r) => !r.ok).length

  console.log('')
  if (failed) {
    console.error(`${failed} of ${results.length} downloads failed — photos.ts still points at the CDN.`)
    process.exitCode = 1
  } else {
    console.log(`All ${results.length} files in public/covers.`)
    console.log('Now set USE_LOCAL_PHOTOS = true in src/data/photos.ts.')
  }
}

main()
