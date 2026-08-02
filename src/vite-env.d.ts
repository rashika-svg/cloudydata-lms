/// <reference types="vite/client" />

import 'react'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    /**
     * `inert` is standard HTML but is not in React 18's typings.
     * Used to pull collapsed accordion panels out of the tab order.
     */
    inert?: '' | undefined
  }
}
