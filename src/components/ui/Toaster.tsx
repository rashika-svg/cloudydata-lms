/* ============================================================
   Toaster — flat ink blocks, bottom right.

   No icons. A mono status code does the work an icon would, and the
   auto-dismiss timer is drawn as a rule that retracts. Live region so
   the confirmation is announced without moving focus.
   ============================================================ */

import { useEffect, useState } from 'react'
import { useApp, type Toast } from '../../store/app'

const CODE: Record<Toast['tone'], string> = {
  info: 'INFO',
  success: 'DONE',
  warn: 'NOTE',
}

/** The left rule and the code share one colour per tone. */
const TONE: Record<Toast['tone'], { rule: string; code: string }> = {
  info: { rule: 'border-l-outline', code: 'text-outline' },
  success: { rule: 'border-l-ok', code: 'text-ok' },
  warn: { rule: 'border-l-warn', code: 'text-warn' },
}

export function Toaster() {
  const { toasts, dismissToast } = useApp()

  return (
    <div
      className="pointer-events-none fixed right-6 bottom-6 z-900 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [entered, setEntered] = useState(false)

  // Mount at the start state, flip on the next frame so the transition
  // has two distinct values to move between.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const tone = TONE[toast.tone]

  return (
    <div
      className={`pointer-events-auto relative flex flex-col gap-0.5 overflow-hidden rounded-md border border-l-4 border-outline-variant bg-surface-lowest p-4 pr-8 shadow-e3 transition-[opacity,transform] duration-300 ${tone.rule} ${
        entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <span className={`font-mono text-[0.6875rem] tracking-[0.09em] ${tone.code}`}>{CODE[toast.tone]}</span>
      <button
        type="button"
        className="absolute top-2 right-2 text-xs leading-none text-outline hover:text-on-surface"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
      <strong className="text-sm">{toast.message}</strong>
      {toast.detail && <span className="text-xs leading-snug text-on-surface-variant">{toast.detail}</span>}
      <span
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left animate-[toasttimer_4.6s_linear_forwards] bg-outline-variant"
        aria-hidden="true"
      />
    </div>
  )
}
