import type {Metadata, ResolvingMetadata} from 'next'

import BuilderPageLayout from '@/app/components/BuilderPageLayout'
import Footer from '@/app/components/Footer'
import {resolvePageMetadata} from '@/app/lib/resolve-page-metadata'
import type {BuilderPageData} from '@/app/lib/page-types'
import Header from '@/app/components/Header'
import {PageOnboarding} from '@/app/components/Onboarding'
import {sanityFetch} from '@/sanity/lib/live'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {homePageQuery} from '@/sanity/lib/queries'

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent

  return resolvePageMetadata(
    {kind: 'home', language: DEFAULT_LANGUAGE, slug: 'home'},
    parentMetadata,
  )
}

export default async function HomePage() {
  const {data: page} = await sanityFetch({
    query: homePageQuery,
    params: {language: DEFAULT_LANGUAGE},
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
