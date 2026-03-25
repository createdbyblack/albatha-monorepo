import {DEFAULT_LANGUAGE, type SupportedLanguage} from '@/sanity/lib/i18n'

export function getLocaleFromPath(pathname: string): SupportedLanguage {
  const [firstSegment] = pathname.split('/').filter(Boolean)
  return firstSegment === 'ae' ? 'ae' : DEFAULT_LANGUAGE
}

export function getLanguageToggleHref(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const locale = getLocaleFromPath(pathname)

  if (locale !== DEFAULT_LANGUAGE) {
    const englishSegments = segments.slice(1)
    return englishSegments.length ? `/${englishSegments.join('/')}` : '/'
  }

  if (pathname === '/') {
    return '/ae'
  }

  return `/ae${pathname}`
}
