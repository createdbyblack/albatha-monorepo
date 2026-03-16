import type {ReactNode} from 'react'

export type ReusablePatternRenderer = () => ReactNode

export const reusablePatternRegistry: Record<string, ReusablePatternRenderer> = {}

export function ReusablePattern({patternRef}: {patternRef?: string | null}) {
  if (!patternRef) {
    return null
  }

  const renderer = reusablePatternRegistry[patternRef]
  return renderer ? <>{renderer()}</> : null
}
