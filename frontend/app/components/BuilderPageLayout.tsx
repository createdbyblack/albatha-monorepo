import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import StructuredDataScript from '@/app/components/StructuredDataScript'
import type {BuilderPageData} from '@/app/lib/page-types'
import PageBuilderPage from '@/app/components/PageBuilder'
import {parseJsonObject} from '@/sanity/lib/utils'

export default function BuilderPageLayout({page}: {page: BuilderPageData}) {
  const customStructuredData = parseJsonObject(page.structuredData)

  return (
    <>
      <Header variant={page.headerAppearance?.variant ?? null} />
      {customStructuredData ? <StructuredDataScript data={customStructuredData} /> : null}
      <div className="my-12 lg:my-24">
        <div className="container">
          <div className="border-b border-border pb-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl text-foreground sm:text-5xl lg:text-7xl">{page.name}</h1>
            </div>
          </div>
        </div>
        <PageBuilderPage page={page} />
      </div>
      <Footer variant={page.footerAppearance?.variant ?? null} />
    </>
  )
}
