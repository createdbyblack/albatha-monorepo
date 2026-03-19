const INVISIBLE_CHARACTERS = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g

export function sanitizeDomPropValue(value: string | null | undefined): string {
  return (value || '').replace(INVISIBLE_CHARACTERS, '').trim().toLowerCase()
}

export function sanitizeAllowedDomProp<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  const sanitized = sanitizeDomPropValue(value)

  return allowed.includes(sanitized as T) ? (sanitized as T) : fallback
}
