/* ============================================================
   Wordmark.

   Three bars of decreasing length and opacity — a data table read
   sideways. Shared by the header and the footer so the two can never
   drift apart.
   ============================================================ */

import { Link } from 'react-router-dom'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`inline-flex flex-none items-center gap-2.5 text-[1.15rem] font-bold tracking-[-0.026em] ${
        light ? 'text-on-dark' : ''
      }`}
      aria-label="CloudyData home"
    >
      <span className="grid size-7.5 content-center gap-[3px] rounded-md bg-primary p-[7px]" aria-hidden="true">
        <i className="block h-0.5 w-full rounded-sm bg-white" />
        <i className="block h-0.5 w-[65%] rounded-sm bg-white/85" />
        <i className="block h-0.5 w-[85%] rounded-sm bg-white/70" />
      </span>
      <span>
        {/* On the dark band the primary role is the light cut in dark
            mode but the dark cut in light mode, so it is pinned. */}
        Cloudy<span className={light ? 'text-[#4fd8eb]' : 'text-primary'}>Data</span>
      </span>
    </Link>
  )
}
