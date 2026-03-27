import type {Metadata, ResolvingMetadata} from 'next'

import {type RouteMatch, routePath} from '@/app/lib/catch-all-route'
import {resolveDiscoveredLanguages} from '@/app/lib/discovered-languages'
import type {BuilderPageData, LegalPageData} from '@/app/lib/page-types'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {
  getPageQuery,
  homePageLanguagesQuery,
  homePageQuery,
  legalPageBySlugQuery,
  legalPageLanguagesBySlugQuery,
  pageLanguagesBySlugQuery,
} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type ResolvedParentMetadata = Awaited<ResolvingMetadata>

function normalizePreviousImages(images: unknown) {
  if (!images) {
    return []
  }

  return Array.isArray(images) ? images : [images]
}

function resolveMetadataBase(parentMetadata: ResolvedParentMetadata) {
  return parentMetadata.metadataBase?.toString().replace(/\/$/, '')
}

function resolveBuilderPageTitle(page: BuilderPageData) {
  return page.seo?.metaTitle || page.name
}

function resolveBuilderPageDescription(page: BuilderPageData) {
  return page.seo?.metaDescription || page.name
}

function resolveLegalPageTitle(page: LegalPageData, slug: string) {
  return page.title || (slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')
}

function resolveLegalPageDescription(page: LegalPageData, slug: string) {
  return page.seo?.metaDescription || (slug === 'privacy-policy' ? 'Privacy policy' : 'Terms and conditions')
}

async function resolveHomeMetadata(match: RouteMatch, parentMetadata: ResolvedParentMetadata): Promise<Metadata> {
  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: homePageQuery,
      params: {language: match.language},
      stega: false,
    }),
    sanityFetch({
      query: homePageLanguagesQuery,
      stega: false,
    }),
  ])

  const pageWithSeo = page as BuilderPageData | null
  if (!pageWithSeo?._id) {
    return {}
  }

  const metadataBase = resolveMetadataBase(parentMetadata)
  const discoveredLanguages = resolveDiscoveredLanguages(languageRows)

  return buildSeoMetadata({
    title: resolveBuilderPageTitle(pageWithSeo),
    description: resolveBuilderPageDescription(pageWithSeo),
    seo: pageWithSeo.seo,
    previousImages: normalizePreviousImages(parentMetadata.openGraph?.images),
    newImage: resolveOpenGraphImage((pageWithSeo.seo?.ogImage as any) || undefined),
    metadataBase,
    fallbackCanonical: metadataBase || undefined,
    alternatePath: '/',
    discoveredLanguages,
    xDefault: metadataBase,
    ogType: 'website',
  })
}

async function resolveLegalMetadata(match: RouteMatch, parentMetadata: ResolvedParentMetadata): Promise<Metadata> {
  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: legalPageBySlugQuery,
      params: {slug: match.slug, language: match.language},
      stega: false,
    }),
    sanityFetch({
      query: legalPageLanguagesBySlugQuery,
      params: {slug: match.slug},
      stega: false,
    }),
  ])

  const legalPage = page as LegalPageData | null
  if (!legalPage?._id) {
    return {}
  }

  const metadataBase = resolveMetadataBase(parentMetadata)
  const discoveredLanguages = resolveDiscoveredLanguages(languageRows)

  return buildSeoMetadata({
    title: resolveLegalPageTitle(legalPage, match.slug),
    description: resolveLegalPageDescription(legalPage, match.slug),
    seo: legalPage.seo,
    previousImages: normalizePreviousImages(parentMetadata.openGraph?.images),
    newImage: resolveOpenGraphImage((legalPage.seo?.ogImage as any) || undefined),
    metadataBase,
    fallbackCanonical: metadataBase ? `${metadataBase}${routePath(match)}` : undefined,
    alternatePath: `/${match.slug}`,
    discoveredLanguages,
    xDefault: metadataBase ? `${metadataBase}/${match.slug}` : undefined,
    ogType: 'article',
  })
}

async function resolveStandardPageMetadata(
  match: RouteMatch,
  parentMetadata: ResolvedParentMetadata,
): Promise<Metadata> {
  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: {slug: match.slug, language: match.language},
      stega: false,
    }),
    sanityFetch({
      query: pageLanguagesBySlugQuery,
      params: {slug: match.slug},
      stega: false,
    }),
  ])

  const pageWithSeo = page as BuilderPageData | null
  if (!pageWithSeo?._id) {
    return {}
  }

  const metadataBase = resolveMetadataBase(parentMetadata)
  const discoveredLanguages = resolveDiscoveredLanguages(languageRows)

  return buildSeoMetadata({
    title: resolveBuilderPageTitle(pageWithSeo),
    description: resolveBuilderPageDescription(pageWithSeo),
    seo: pageWithSeo.seo,
    previousImages: normalizePreviousImages(parentMetadata.openGraph?.images),
    newImage: resolveOpenGraphImage((pageWithSeo.seo?.ogImage as any) || undefined),
    metadataBase,
    fallbackCanonical: metadataBase ? `${metadataBase}${routePath(match)}` : undefined,
    alternatePath: `/${match.slug}`,
    discoveredLanguages,
    xDefault: metadataBase ? `${metadataBase}/${match.slug}` : undefined,
    ogType: 'website',
  })
}

export async function resolvePageMetadata(
  match: RouteMatch,
  parentMetadata: ResolvedParentMetadata,
): Promise<Metadata> {
  if (match.kind === 'home') {
    return resolveHomeMetadata(match, parentMetadata)
  }

  if (match.kind === 'legal') {
    return resolveLegalMetadata(match, parentMetadata)
  }

  return resolveStandardPageMetadata(match, parentMetadata)
}
