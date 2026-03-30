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
      className="relative isolate overflow-hidden bg-albatha-midnight pb-10 pt-24 text-white sm:pb-12 sm:pt-28 lg:pb-10 lg:pt-32"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div className="absolute inset-0">
        {backgroundImageAssetId ? (
          <SanityImage
            id={backgroundImageAssetId}
            alt=""
            width={1920}
            height={1085}
            className="h-full w-full object-cover"
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
        <div className="relative z-10 mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
          <div
            className="space-y-12 sm:space-y-14 lg:space-y-[3.75rem]"
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
