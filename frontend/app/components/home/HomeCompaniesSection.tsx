'use client'

import SanityImage from '@/app/components/SanityImage'
import {HomeSectionRenderContext} from '@/app/components/home/homeSectionRendering'
import {
  type HomeSectionRendererProps,
  resolveImageAssetId,
} from '@/app/components/home/homeSectionUtils'
import type {PageBuilderBlock} from '@/sanity/lib/types'
import {getSanityDataAttribute} from '@/sanity/lib/visual-editing'

type HomeCompaniesSectionProps = HomeSectionRendererProps<
  Extract<PageBuilderBlock, {_type: 'homeCompaniesSection'}>
>

export default function HomeCompaniesSection({
  block,
  pageId,
  pageType,
  blockPath,
  isDraftMode,
  renderBlocks,
}: HomeCompaniesSectionProps) {
  const contentPath = `${blockPath}.contents`
  const backgroundImageAssetId = resolveImageAssetId(block.backgroundImage?.asset)

  return (
    <section
      id="companies"
      className="relative isolate overflow-hidden bg-albatha-midnight text-white min-h-[67.813rem] "
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div className="absolute inset-0 -top-32">
        {backgroundImageAssetId ? (
          <SanityImage
            id={backgroundImageAssetId}
            alt=""
            width={1920}
            height={1085}
            className="h-full w-full object-cover min-h-[67.813rem]"
          />
        ) : (
          <div className="h-full w-full bg-albatha-midnight" aria-hidden="true" />
        )}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-albatha-midnight/15 via-albatha-midnight/40 to-albatha-midnight"
        aria-hidden="true"
      />

      <HomeSectionRenderContext.Provider value="companies">
        <div className="absolute bottom-10 z-10 w-full px-4 sm:px-8 lg:px-10 xl:px-20">
          <div
            className="mx-auto max-w-wide space-y-12 sm:space-y-14 lg:space-y-[3.75rem]"
            data-sanity={getSanityDataAttribute(
              isDraftMode,
              {id: pageId, type: pageType},
              contentPath,
            )}
          >
            {renderBlocks(block.contents || [], contentPath)}
          </div>
        </div>
      </HomeSectionRenderContext.Provider>
    </section>
  )
}
