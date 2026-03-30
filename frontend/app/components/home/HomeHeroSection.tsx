'use client'

import SanityImage from '@/app/components/SanityImage'
import FloatingSectionAction from '@/app/components/home/FloatingSectionAction'
import HeroPhraseBadge from '@/app/components/home/HeroPhraseBadge'
import {HomeSectionRenderContext} from '@/app/components/home/homeSectionRendering'
import {
  type HomeSectionRendererProps,
  resolveHeroPhrasePlacement,
  resolveImageAssetId,
  resolveLinkHref,
  resolveMediaUrls,
} from '@/app/components/home/homeSectionUtils'
import {cn} from '@/app/lib/cn'
import type {PageBuilderBlock} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type HomeHeroSectionProps = HomeSectionRendererProps<
  Extract<PageBuilderBlock, {_type: 'homeHeroSection'}>
>

export default function HomeHeroSection({
  block,
  pageId,
  pageType,
  blockPath,
  isDraftMode,
  renderBlocks,
}: HomeHeroSectionProps) {
  const backgroundMedia = resolveMediaUrls(block.backgroundMedia)
  const backgroundImageAssetId = resolveImageAssetId(block.backgroundMedia?.image?.asset)
  const floatingActionHref = resolveLinkHref(block.floatingActionLink)
  const contentPath = `${blockPath}.contents`
  const sectionId = block._key ? `home-hero-${block._key}` : 'home-hero'

  return (
    <section
      id={sectionId}
      className="relative isolate overflow-hidden bg-albatha-midnight text-white"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div className="absolute inset-0">
        {backgroundMedia.videoUrl && backgroundMedia.mediaType === 'video' ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            poster={backgroundMedia.imageUrl || undefined}
          >
            <source src={backgroundMedia.videoUrl} />
          </video>
        ) : backgroundImageAssetId ? (
          <SanityImage
            id={backgroundImageAssetId}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-black" aria-hidden="true" />
        )}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/65"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80"
        aria-hidden="true"
      />

      {(block.phrases || []).map((phrase, phraseIndex) => (
        <div
          key={phrase._key || `hero-phrase-${phraseIndex}`}
          className={cn(
            'pointer-events-none absolute z-10 hidden lg:block',
            resolveHeroPhrasePlacement(phrase.placement),
          )}
        >
          <HeroPhraseBadge
            text={phrase.text || 'Hero phrase'}
            delayMs={phraseIndex * 1000}
            data-sanity={getSanityDataAttribute(
              isDraftMode,
              {id: pageId, type: pageType},
              toArrayItemPath(`${blockPath}.phrases`, phrase._key, phraseIndex),
            )}
          />
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen items-end px-4 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:px-10 lg:pb-28 lg:pt-40 xl:px-20">
        <div className="mx-auto w-full max-w-wide">
          <HomeSectionRenderContext.Provider value="hero">
            <div
              className="space-y-8 lg:space-y-12"
              data-sanity={getSanityDataAttribute(
                isDraftMode,
                {id: pageId, type: pageType},
                contentPath,
              )}
            >
              {renderBlocks(block.contents || [], contentPath)}
            </div>
          </HomeSectionRenderContext.Provider>
        </div>
      </div>

      <FloatingSectionAction
        label={block.floatingActionLabel || 'Know More'}
        href={floatingActionHref}
        sectionId={sectionId}
        data-sanity={getSanityDataAttribute(
          isDraftMode,
          {id: pageId, type: pageType},
          block.floatingActionLink ? `${blockPath}.floatingActionLink` : `${blockPath}.floatingActionLabel`,
        )}
      />
    </section>
  )
}
