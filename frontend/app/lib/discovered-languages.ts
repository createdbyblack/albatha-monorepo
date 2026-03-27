import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'

type LanguageRow = {
  language?: string
}

export function resolveDiscoveredLanguages(languageRows: unknown) {
  const rawLanguageRows = (languageRows as LanguageRow[] | null) || []

  return rawLanguageRows.map((row) => row.language || DEFAULT_LANGUAGE)
}
