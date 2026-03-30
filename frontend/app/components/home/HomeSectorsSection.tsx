'use client'

import {HomeSectionRenderContext} from '@/app/components/home/homeSectionRendering'
import type {HomeSectionRendererProps} from '@/app/components/home/homeSectionUtils'
import type {PageBuilderBlock} from '@/sanity/lib/types'
import {getSanityDataAttribute} from '@/sanity/lib/visual-editing'

type HomeSectorsSectionProps = HomeSectionRendererProps<
  Extract<PageBuilderBlock, {_type: 'homeSectorsSection'}>
>

export default function HomeSectorsSection({
  block,
  pageId,
  pageType,
  blockPath,
  isDraftMode,
  renderBlocks,
}: HomeSectorsSectionProps) {
  const contentPath = `${blockPath}.contents`

  return (
    <section
      id="sectors"
      className="bg-background py-20 sm:py-24 lg:py-28"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <HomeSectionRenderContext.Provider value="sectors">
        <div className="mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
          <div
            className="space-y-12 sm:space-y-16 lg:space-y-20"
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
