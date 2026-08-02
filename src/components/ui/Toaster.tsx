/* ============================================================
   Toaster — flat ink blocks, bottom-left.

   No icons, no rounded corners, no shadow. A mono status code does the
   work an icon would, and the auto-dismiss timer is drawn as a rule
   that retracts. Live region so the confirmation is announced without
   moving focus.
   ============================================================ */

import { useEffect, useState } from 'react'
import { useApp, type Toast } from '../../store/app'

const CODE: Record<Toast['tone'], string> = {
  info: 'INFO',
  success: 'DONE',
  warn: 'NOTE',
}

export function Toaster() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="toaster" role="status" aria-live="polite">
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

  return (
    <div className={`toast toast--${toast.tone} ${entered ? 'is-in' : ''}`}>
      <div className="toast__head">
        <span className="toast__code">{CODE[toast.tone]}</span>
        <button type="button" className="toast__close" onClick={onDismiss} aria-label="Dismiss notification">
          ✕
        </button>
      </div>
      <strong className="toast__msg">{toast.message}</strong>
      {toast.detail && <span className="toast__detail">{toast.detail}</span>}
      <span className="toast__timer" aria-hidden="true" />
    </div>
  )
}
