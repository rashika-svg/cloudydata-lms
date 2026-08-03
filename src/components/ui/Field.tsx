/* ============================================================
   Form fields — M3 outlined.

   One control style shared by input, select and textarea, so the
   three never drift. The error state is on the control itself rather
   than a wrapper class, which keeps the invalid styling attached to
   the thing that is actually invalid.
   ============================================================ */

import { useId, type ReactNode } from 'react'
import { Icon } from './Icon'

const CONTROL =
  'w-full rounded-xs border bg-transparent px-4 py-3 text-on-surface outline-none ' +
  'placeholder:text-outline transition-[border-color,box-shadow] duration-200 ' +
  'focus:shadow-[inset_0_0_0_1px_currentColor]'

const OK = 'border-outline focus:border-primary focus:text-primary'
const BAD = 'border-error focus:border-error focus:text-error'

function shell(error?: string) {
  return `${CONTROL} ${error ? BAD : OK}`
}

interface Base {
  label: string
  error?: string
  children?: never
}

export function TextField({
  label,
  error,
  textarea = false,
  ...rest
}: Base & { textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} className={`${shell(error)} min-h-28 resize-y leading-relaxed`} {...rest} />
      ) : (
        <input id={id} className={shell(error)} {...rest} />
      )}
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}

export function SelectField({
  label,
  error,
  children,
  ...rest
}: Omit<Base, 'children'> & { children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative flex items-center">
        <select id={id} className={`${shell(error)} cursor-pointer appearance-none pr-9`} {...rest}>
          {children}
        </select>
        <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 text-outline" />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
