import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'

import BuilderPageLayout from '@/app/components/BuilderPageLayout'
import type {BuilderPageData, LegalPageData, RoutePageParams} from '@/app/lib/page-types'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {PageOnboarding} from '@/app/components/Onboarding'
import PortableText from '@/app/components/PortableText'
import {
  buildCatchAllStaticParams,
  resolveCatchAllRoute,
  type SitemapRow,
} from '@/app/lib/catch-all-route'
import {resolvePageMetadata} from '@/app/lib/resolve-page-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery, getPageQuery, legalPageBySlugQuery, sitemapData} from '@/sanity/lib/queries'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'

export async function generateStaticParams(): Promise<Array<{segments?: string[]}>> {
  const {data} = await sanityFetch({
    query: sitemapData,
    perspective: 'published',
    stega: false,
  })

  return buildCatchAllStaticParams((data as SitemapRow[] | null) || [])
}

export async function generateMetadata(
  props: RoutePageParams,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const match = resolveCatchAllRoute(params.segments)
  if (!match) {
    return {}
  }

  const parentMetadata = await parent

  return resolvePageMetadata(match, parentMetadata)
}

export default async function CatchAllPage(props: RoutePageParams) {
  const params = await props.params
  const match = resolveCatchAllRoute(params.segments)
  if (!match) {
    return notFound()
  }

  if (match.kind === 'home') {
    const {data: page} = await sanityFetch({
      query: homePageQuery,
      params: {language: match.language},
    })
    const pageWithSeo = page as BuilderPageData | null

    if (!pageWithSeo?._id) {
      return (
        <>
          <Header />
          <div className="py-40">
            <PageOnboarding />
          </div>
          <Footer />
        </>
      )
    }

    return <BuilderPageLayout page={pageWithSeo} />
  }

  if (match.kind === 'legal') {
    const {data} = await sanityFetch({
      query: legalPageBySlugQuery,
      params: {slug: match.slug, language: match.language},
    })
    const page = data as LegalPageData | null
    if (!page?._id) {
      return notFound()
    }

    return (
      <>
        <Header variant={page.headerAppearance?.variant ?? null} />
        <div className="container py-16 lg:py-24">
          <article className="prose prose-gray max-w-3xl">
            <h1>
              {page.title ||
                (match.slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')}
            </h1>
            {page.content?.length ? <PortableText value={page.content as any} /> : null}
          </article>
        </div>
        <Footer variant={page.footerAppearance?.variant ?? null} />
      </>
    )
  }

  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: match.slug, language: match.language},
  })
  const pageWithSeo = page as BuilderPageData | null

  if (!pageWithSeo?._id) {
    if (match.kind === 'page' && match.language === DEFAULT_LANGUAGE) {
      return (
        <>
          <Header />
          <div className="py-40">
            <PageOnboarding />
          </div>
          <Footer />
        </>
      )
    }
    return notFound()
  }

  return <BuilderPageLayout page={pageWithSeo} />
}
