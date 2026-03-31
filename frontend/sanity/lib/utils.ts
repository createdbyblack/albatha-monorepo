import {stegaClean} from '@sanity/client/stega'
import {dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createDataAttribute, CreateDataAttributeProps} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {DereferencedLink} from '@/sanity/lib/types'
import type {ContentLink} from '@/sanity/lib/content-link'
import {DEFAULT_LANGUAGE, type SupportedLanguage} from '@/sanity/lib/i18n'

const builder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

function cleanSanityString(value?: string | null): string | null | undefined {
  return typeof value === 'string' ? (stegaClean(value) || value) : value
}

// Create an image URL builder using the client
// Export a function that can be used to get image URLs
function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export function resolveOpenGraphImage(
  image?: SanityImageSource | null,
  width = 1200,
  height = 627,
) {
  if (!image) return
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url()
  if (!url) return
  return {url, alt: (image as {alt?: string})?.alt || '', width, height}
}

// Depending on the type of link, we need to fetch the corresponding page or URL. Otherwise return null.
type LinkValue = {
  linkType?: 'href' | 'page'
  href?: string
  page?: string | null
  openInNewTab?: boolean
}

export function linkResolver(link: LinkValue | DereferencedLink | undefined) {
  if (!link) return null

  const linkType = cleanSanityString(link.linkType)
  const href = cleanSanityString(link.href)
  const page = cleanSanityString(link.page)

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!linkType && href) {
    link.linkType = 'href'
  }

  switch (linkType) {
    case 'href':
      return href || null
    case 'page':
      if (page && typeof page === 'string') {
        return `/${page}`
      }
    default:
      return null
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}

export function resolveContentLinkHref(link?: ContentLink): string | null {
  if (!link) {
    return null
  }

  const linkType = cleanSanityString(link.linkType)
  const internalTargetType = cleanSanityString(link.internalTargetType)
  const internalPageSlug = cleanSanityString(link.internalPageSlug)
  const internalPath = cleanSanityString(link.internalPath)
  const externalUrl = cleanSanityString(link.externalUrl)

  if (
    linkType === 'internal' &&
    (internalTargetType === 'page' || internalTargetType == null) &&
    internalPageSlug
  ) {
    return `/${internalPageSlug}`
  }

  if (linkType === 'internal' && internalPath) {
    return internalPath.startsWith('/') ? internalPath : `/${internalPath}`
  }

  if (linkType === 'external' && externalUrl) {
    return externalUrl
  }

  return null
}

export function localizeHref(
  href: string | null,
  locale: SupportedLanguage = DEFAULT_LANGUAGE,
): string | null {
  const cleanedHref = cleanSanityString(href)

  if (!cleanedHref || !cleanedHref.startsWith('/')) {
    return cleanedHref || null
  }

  if (locale === DEFAULT_LANGUAGE) {
    return cleanedHref
  }

  if (cleanedHref === '/') {
    return `/${locale}`
  }

  if (cleanedHref === `/${locale}` || cleanedHref.startsWith(`/${locale}/`)) {
    return cleanedHref
  }

  return `/${locale}${cleanedHref}`
}

export function isExternalContentLink(link?: ContentLink): boolean {
  return cleanSanityString(link?.linkType) === 'external'
}

export function normalizeInlineScript(script?: string | null): string | null {
  if (!script) {
    return null
  }
  const trimmed = script.trim()

  return trimmed.replace(/<\/?script[^>]*>/gi, '').trim()
}

export function parseJsonObject(value?: string | null): Record<string, unknown> | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export function ensureAbsoluteUrl(
  value?: string | null,
  fallback = 'http://localhost:3000',
): string {
  if (value) {
    try {
      return new URL(value).toString().replace(/\/$/, '')
    } catch {
      // Ignore invalid absolute URL and use fallback.
    }
  }

  return fallback
}
