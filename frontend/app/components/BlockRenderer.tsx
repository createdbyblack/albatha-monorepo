'use client'

import Link from 'next/link'
import {createContext, useContext} from 'react'
import {stegaClean} from '@sanity/client/stega'

import CTA from '@/app/components/Cta'
import SanityImage from '@/app/components/SanityImage'
import CompanyFeatureLink from '@/app/components/home/CompanyFeatureLink'
import HomeBlogPostCard from '@/app/components/home/HomeBlogPostCard'
import CountUpText from '@/app/components/home/CountUpText'
import FloatingSectionAction from '@/app/components/home/FloatingSectionAction'
import HeroPhraseBadge from '@/app/components/home/HeroPhraseBadge'
import SectionArrowCta from '@/app/components/home/SectionArrowCta'
import SectionArrowIconButton from '@/app/components/home/SectionArrowIconButton'
import InfoSection from '@/app/components/InfoSection'
import {useLayoutSettings} from '@/app/components/LayoutSettingsProvider'
import CustomPortableText from '@/app/components/PortableText'
import {cn} from '@/app/lib/cn'
import type {PortableTextBlock} from 'next-sanity'
import {Button} from '@/app/components/atoms/button'
import {Heading} from '@/app/components/atoms/heading'
import {Html} from '@/app/components/atoms/html'
import {Image} from '@/app/components/atoms/image'
import {ListItem} from '@/app/components/atoms/list-item'
import {NavigationLink} from '@/app/components/atoms/navigation-link'
import {Paragraph} from '@/app/components/atoms/paragraph'
import {Shortcode} from '@/app/components/atoms/shortcode'
import {SiteLogo} from '@/app/components/atoms/site-logo'
import {Video} from '@/app/components/atoms/video'
import {Buttons} from '@/app/components/molecules/buttons'
import {Column} from '@/app/components/molecules/column'
import {Group} from '@/app/components/molecules/group'
import {List} from '@/app/components/molecules/list'
import {Navigation} from '@/app/components/molecules/navigation'
import {BlockSlot} from '@/app/components/organisms/block-slot'
import {Columns} from '@/app/components/organisms/columns'
import {Cover} from '@/app/components/organisms/cover'
import {ReusablePattern} from '@/app/components/organisms/reusable-pattern'
import {
  type CbBlock,
  type CbButton,
  type CbColumn,
  type CbColumns,
  type CbCover,
  type CbGroup,
  type CbLink,
  type CbMedia,
  type CbNavigationLink,
  type HomeCompanyItem,
  type HomeCompanyItemsBlock,
  type HomeAboutStat,
  type PostPreview,
  type HomeHeroPhrase,
  type HomeSectorItem,
  type HomeSectorListBlock,
  type HomeSectorListItem,
  type PageBuilderBlock,
} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type BlockRendererProps = {
  block: PageBuilderBlock
  index: number
  pageType: string
  pageId: string
  blockPath: string
  isDraftMode: boolean
}

type NestedArrayFieldName = 'contents' | 'children' | 'content'

type RenderableListItem = {
  _key?: string
  content?: string | null
  path: string
}

type HomeSectionRenderContextValue = 'hero' | 'about' | 'sectors' | 'companies' | 'blog-posts' | null

type HomeColumnVariant =
  | 'hero-heading'
  | 'hero-copy'
  | 'about-image'
  | 'about-copy'
  | 'about-stats'
  | 'sectors-heading'
  | 'sectors-list'
  | 'sectors-featured'
  | 'companies-copy'
  | 'companies-grid'
  | 'blog-heading'
  | 'blog-copy'
  | null

const HomeSectionRenderContext = createContext<HomeSectionRenderContextValue>(null)
const HomeColumnVariantContext = createContext<HomeColumnVariant>(null)

function resolveNestedArray(
  block: {
    contents?: PageBuilderBlock[] | null
    children?: PageBuilderBlock[] | null
    content?: PageBuilderBlock[] | null
  },
  preferredField: NestedArrayFieldName,
): {items: PageBuilderBlock[]; fieldName: NestedArrayFieldName} {
  const arraysByField: Partial<
    Record<NestedArrayFieldName, PageBuilderBlock[] | null | undefined>
  > = {
    contents: block.contents,
    children: block.children,
    content: block.content,
  }

  const preferredItems = arraysByField[preferredField]
  if (preferredItems?.length) {
    return {items: preferredItems, fieldName: preferredField}
  }

  for (const fieldName of ['contents', 'children', 'content'] as const) {
    const items = arraysByField[fieldName]
    if (items?.length) {
      return {items, fieldName}
    }
  }

  return {items: preferredItems || [], fieldName: preferredField}
}

function resolveColumnItems(column: CbColumn) {
  return resolveNestedArray(column, 'contents').items
}

function columnIncludesBlockType(column: CbColumn, ...blockTypes: string[]) {
  const columnItems = resolveColumnItems(column)
  return columnItems.some((item) => blockTypes.includes(item._type))
}

function rowIncludesColumnBlockType(row: CbColumns, ...blockTypes: string[]) {
  return (row.columns || []).some((column) => columnIncludesBlockType(column, ...blockTypes))
}

function resolveHomeSectionRowClassName(
  section: HomeSectionRenderContextValue,
  row: CbColumns,
) {
  switch (section) {
    case 'hero':
      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph') ? 'justify-between' : undefined
    case 'about':
      return rowIncludesColumnBlockType(row, 'homeAboutImageBlock')
        ? 'items-center gap-10 lg:gap-16'
        : undefined
    case 'sectors':
      if (rowIncludesColumnBlockType(row, 'homeSectorListBlock', 'homeSectorItem')) {
        return 'items-end gap-8 lg:gap-16 xl:gap-24'
      }

      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph')
        ? 'max-w-4xl gap-6'
        : undefined
    case 'companies':
      if (rowIncludesColumnBlockType(row, 'homeCompanyItemsBlock')) {
        return 'gap-6'
      }

      return rowIncludesColumnBlockType(row, 'cbParagraph')
        ? 'mx-auto max-w-6xl justify-center'
        : undefined
    case 'blog-posts':
      if (rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph', 'cbButton')) {
        return 'items-end gap-8 lg:gap-16'
      }

      return undefined
    default:
      return undefined
  }
}

function resolveHomeSectionColumnVariant(
  section: HomeSectionRenderContextValue,
  column: CbColumn,
): HomeColumnVariant {
  if (columnIncludesBlockType(column, 'cbHeading')) {
    if (section === 'hero') {
      return 'hero-heading'
    }

    if (section === 'sectors') {
      return 'sectors-heading'
    }
  }

  if (columnIncludesBlockType(column, 'homeAboutImageBlock')) {
    return 'about-image'
  }

  if (columnIncludesBlockType(column, 'homeAboutStatsBlock')) {
    return 'about-stats'
  }

  if (columnIncludesBlockType(column, 'homeSectorListBlock')) {
    return 'sectors-list'
  }

  if (columnIncludesBlockType(column, 'homeSectorItem')) {
    return 'sectors-featured'
  }

  if (columnIncludesBlockType(column, 'homeCompanyItemsBlock')) {
    return 'companies-grid'
  }

  if (columnIncludesBlockType(column, 'cbButton', 'cbParagraph')) {
    if (section === 'hero') {
      return 'hero-copy'
    }

    if (section === 'about') {
      return 'about-copy'
    }

    if (section === 'companies') {
      return 'companies-copy'
    }

    if (section === 'blog-posts') {
      return 'blog-copy'
    }
  }

  if (section === 'blog-posts' && columnIncludesBlockType(column, 'cbHeading')) {
    return 'blog-heading'
  }

  return null
}

function resolveHomeSectionColumnClassName(columnVariant: HomeColumnVariant) {
  switch (columnVariant) {
    case 'hero-heading':
      return 'max-w-[54rem] [&_h1]:text-[4.75rem] [&_h1]:font-normal [&_h1]:leading-[0.92] [&_h1]:tracking-[-0.03em] sm:[&_h1]:text-[6rem] lg:[&_h1]:max-w-[8.2ch] lg:[&_h1]:text-[8.75rem]'
    case 'hero-copy':
      return 'max-w-xl lg:ml-auto lg:max-w-[32.3125rem] lg:pb-2 [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-[1.35] [&_p]:text-white sm:[&_p]:text-xl lg:[&_p]:text-[1.875rem] lg:[&_p]:leading-[1.3]'
    case 'about-image':
      return 'lg:-ml-24 xl:-ml-40'
    case 'about-copy':
      return 'max-w-3xl space-y-6 [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-snug [&_h2]:text-albatha-midnight sm:[&_h2]:text-5xl [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-snug [&_p]:text-albatha-midnight/90 sm:[&_p]:text-xl lg:[&_p]:text-2xl'
    case 'sectors-heading':
      return 'space-y-4 [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-albatha-midnight sm:[&_h2]:text-5xl lg:[&_h2]:text-[2.5rem]'
    case 'sectors-list':
      return 'order-2 lg:order-1'
    case 'sectors-featured':
      return 'order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none'
    case 'companies-copy':
      return 'space-y-4 [&_p]:mt-0 [&_p]:text-center [&_p]:text-xl [&_p]:leading-snug [&_p]:text-white sm:[&_p]:text-2xl lg:[&_p]:text-[2.1875rem] lg:[&_p]:leading-[1.2857142857]'
    case 'blog-heading':
      return 'max-w-3xl [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-white sm:[&_h2]:text-5xl lg:[&_h2]:text-[2.5rem]'
    case 'blog-copy':
      return 'max-w-2xl lg:ml-auto [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-snug [&_p]:text-white/80 sm:[&_p]:text-xl lg:[&_p]:text-[1.625rem]'
    default:
      return undefined
  }
}

function resolveHomeSectionRowVerticalAlignment(
  section: HomeSectionRenderContextValue,
  row: CbColumns,
) {
  if (row.verticalAlignment) {
    return row.verticalAlignment
  }

  switch (section) {
    case 'hero':
      return 'bottom'
    case 'about':
      return rowIncludesColumnBlockType(row, 'homeAboutImageBlock') ? 'center' : 'top'
    case 'sectors':
      return rowIncludesColumnBlockType(row, 'homeSectorListBlock', 'homeSectorItem')
        ? 'bottom'
        : 'top'
    case 'companies':
      return rowIncludesColumnBlockType(row, 'homeCompanyItemsBlock') ? 'bottom' : 'center'
    case 'blog-posts':
      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph', 'cbButton')
        ? 'bottom'
        : 'top'
    default:
      return 'top'
  }
}

function resolveHomeSectionColumnVerticalAlignment(
  section: HomeSectionRenderContextValue,
  columnVariant: HomeColumnVariant,
  column: CbColumn,
) {
  if (column.verticalAlignment) {
    return column.verticalAlignment
  }

  switch (section) {
    case 'hero':
      return 'bottom'
    case 'about':
      return columnVariant === 'about-image' || columnVariant === 'about-copy' ? 'center' : 'top'
    case 'sectors':
      return columnVariant === 'sectors-list' || columnVariant === 'sectors-featured'
        ? 'bottom'
        : 'top'
    case 'companies':
      return columnVariant === 'companies-copy' ? 'center' : 'bottom'
    case 'blog-posts':
      return columnVariant === 'blog-copy' ? 'bottom' : 'top'
    default:
      return 'top'
  }
}

function renderBlockArray(
  blocks: PageBuilderBlock[],
  blockPath: string,
  pageId: string,
  pageType: string,
  isDraftMode: boolean,
) {
  return blocks.map((child, childIndex) => (
    <BlockRenderer
      key={child._key || `${child._type}-${childIndex}`}
      block={child}
      index={childIndex}
      pageId={pageId}
      pageType={pageType}
      blockPath={toArrayItemPath(blockPath, child._key, childIndex)}
      isDraftMode={isDraftMode}
    />
  ))
}

function resolveLinkHref(link?: CbLink | null, fallbackUrl?: string | null): string | null {
  if (
    link?.linkType === 'internal' &&
    (link.internalTargetType === 'page' || link.internalTargetType == null) &&
    link.internalPageSlug
  ) {
    return `/${link.internalPageSlug}`
  }

  if (link?.linkType === 'internal' && link.internalPath) {
    return link.internalPath.startsWith('/') ? link.internalPath : `/${link.internalPath}`
  }

  if (link?.linkType === 'external' && link.externalUrl) {
    return link.externalUrl
  }

  return fallbackUrl || null
}

function resolveLinkTarget(
  explicitTarget?: '_self' | '_blank' | string | null,
  openInNewTab?: boolean | null,
): '_self' | '_blank' | undefined {
  if (explicitTarget === '_blank') {
    return '_blank'
  }

  if (openInNewTab) {
    return '_blank'
  }

  return explicitTarget === '_self' ? '_self' : undefined
}

function normalizeHeadingLevel(
  level?: string | number | null,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  if (typeof level === 'string') {
    if (
      level === 'h1' ||
      level === 'h2' ||
      level === 'h3' ||
      level === 'h4' ||
      level === 'h5' ||
      level === 'h6'
    ) {
      return level
    }
    return 'h2'
  }

  if (typeof level === 'number' && level >= 1 && level <= 6) {
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

  return 'h2'
}

function imageAssetRefToUrl(ref?: string | null): string | null {
  if (!ref) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    return null
  }

  const match = ref.match(/^image-([^-]+-\d+x\d+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function imageAssetToUrl(
  asset?: {url?: string | null; _ref?: string | null; _id?: string | null} | null,
) {
  if (asset?.url) {
    return asset.url
  }

  return imageAssetRefToUrl(asset?._ref || asset?._id)
}

function fileAssetRefToUrl(ref?: string | null): string | null {
  if (!ref) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    return null
  }

  const match = ref.match(/^file-([^-]+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function fileAssetToUrl(
  asset?: {url?: string | null; _ref?: string | null; _id?: string | null} | null,
) {
  if (asset?.url) {
    return asset.url
  }

  return fileAssetRefToUrl(asset?._ref || asset?._id)
}

function resolveMediaUrls(media?: CbMedia | null) {
  return {
    imageUrl: imageAssetToUrl(media?.image?.asset),
    videoUrl: fileAssetToUrl(media?.videoFile?.asset),
    alt: media?.image?.alt || '',
    mediaType: media?.mediaType || 'image',
  }
}

function resolveImageAssetId(asset?: {_ref?: string | null; _id?: string | null} | null) {
  return asset?._ref || asset?._id || null
}

function resolveHeroPhrasePlacement(placement?: HomeHeroPhrase['placement'] | null) {
  switch (stegaClean(placement) || placement) {
    case 'middleRight':
      return 'right-4 top-72 sm:right-8 sm:top-80 lg:right-10 lg:top-80 xl:right-32 xl:top-64'
    case 'lowerLeft':
      return 'left-4 bottom-28 sm:left-8 sm:bottom-36 lg:left-12 xl:left-32'
    case 'upperLeft':
    default:
      return 'left-4 top-28 sm:left-8 sm:top-36 lg:left-12 lg:top-44 xl:left-80 xl:top-56'
  }
}

function formatPostDate(publishedAt?: string | null) {
  if (!publishedAt) {
    return 'No date'
  }

  const parsedDate = new Date(publishedAt)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate)
}

function resolvePostHref(post: PostPreview) {
  return post.seo?.canonicalUrl || null
}

function resolvePostExcerpt(post: PostPreview) {
  const summary = post.seo?.metaDescription || post.seo?.ogDescription || null
  if (!summary) {
    return null
  }

  return stegaClean(summary) || summary
}

function renderHomeHeroSection(
  block: Extract<PageBuilderBlock, {_type: 'homeHeroSection'}>,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
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
              {renderBlockArray(block.contents || [], contentPath, pageId, pageType, isDraftMode)}
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
          block.floatingActionLink
            ? `${blockPath}.floatingActionLink`
            : `${blockPath}.floatingActionLabel`,
        )}
      />
    </section>
  )
}

function resolveAboutStatToneClasses(tone?: HomeAboutStat['tone'] | null) {
  switch (stegaClean(tone) || tone) {
    case 'blue':
      return {
        card: 'border border-transparent bg-albatha-blue text-white',
        label: 'text-albatha-midnight',
      }
    case 'outlineDark':
      return {
        card: 'border border-albatha-midnight bg-transparent text-albatha-midnight',
        label: 'text-albatha-blue',
      }
    case 'dark':
    default:
      return {
        card: 'border border-transparent bg-albatha-midnight text-white',
        label: 'text-albatha-blue',
      }
  }
}

function resolveAboutStatHeightClass(height?: HomeAboutStat['height'] | null) {
  switch (stegaClean(height) || height) {
    case 'sm':
      return 'min-h-52'
    case 'lg':
      return 'min-h-80'
    case 'md':
    default:
      return 'min-h-72'
  }
}

function renderAboutStatCard(
  stat: HomeAboutStat,
  statPath: string,
  pageId: string,
  pageType: string,
  isDraftMode: boolean,
) {
  const tone = resolveAboutStatToneClasses(stat.tone)

  return (
    <article
      key={stat._key || statPath}
      className={cn(
        'flex flex-col justify-center gap-4 rounded-[1.25rem] px-8 py-10 text-center backdrop-blur-sm transition-transform duration-300 ease-out hover:-translate-y-1',
        resolveAboutStatHeightClass(stat.height),
        tone.card,
      )}
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, statPath)}
    >
      <p className="text-5xl font-normal leading-none tracking-tight md:text-6xl xl:text-7xl">
        <CountUpText value={stat.value || ''} />
      </p>
      <p className={cn('text-xl leading-snug md:text-2xl', tone.label)}>{stat.label || ''}</p>
    </article>
  )
}

function renderHomeAboutSection(
  block: Extract<PageBuilderBlock, {_type: 'homeAboutSection'}>,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
  const contentPath = `${blockPath}.contents`

  return (
    <section
      id="about-us"
      className="bg-background py-20 sm:py-24 lg:py-28"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <HomeSectionRenderContext.Provider value="about">
        <div className="mx-auto w-full max-w-wide overflow-hidden px-4 sm:px-8 lg:px-10 xl:px-20">
          <div
            className="space-y-12 sm:space-y-16 lg:space-y-20"
            data-sanity={getSanityDataAttribute(
              isDraftMode,
              {id: pageId, type: pageType},
              contentPath,
            )}
          >
            {renderBlockArray(block.contents || [], contentPath, pageId, pageType, isDraftMode)}
          </div>
        </div>
      </HomeSectionRenderContext.Provider>
    </section>
  )
}

function resolveSectorListItemClasses(itemIndex: number, highlightedIndex: number) {
  const distanceFromHighlight =
    highlightedIndex >= 0 ? Math.abs(itemIndex - highlightedIndex) : itemIndex

  switch (distanceFromHighlight) {
    case 0:
      return 'text-5xl text-albatha-blue sm:text-6xl lg:text-7xl xl:text-8xl'
    case 1:
      return 'text-4xl text-albatha-midnight/60 blur-xs sm:text-5xl lg:text-6xl xl:text-7xl'
    case 2:
      return 'text-3xl text-albatha-midnight/45 blur-sm sm:text-4xl lg:text-5xl xl:text-6xl'
    default:
      return 'text-2xl text-albatha-midnight/30 blur-md sm:text-3xl lg:text-4xl xl:text-5xl'
  }
}

function renderSectorListItem(
  item: HomeSectorListItem,
  itemIndex: number,
  highlightedIndex: number,
  itemPath: string,
  pageId: string,
  pageType: string,
  isDraftMode: boolean,
) {
  const href = resolveLinkHref(item.link)
  const target = resolveLinkTarget(undefined, item.link?.openInNewTab)
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined
  const textClasses = cn(
    'font-brand block uppercase leading-none tracking-tight transition-all duration-300 ease-out hover:text-albatha-blue hover:blur-none focus-visible:text-albatha-blue focus-visible:blur-none focus-visible:outline-none',
    item.isHighlighted && 'relative z-10',
    resolveSectorListItemClasses(itemIndex, highlightedIndex),
  )
  const content = (
    <span
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, itemPath)}
      className={textClasses}
    >
      {item.title || 'Sector'}
    </span>
  )

  if (!href) {
    return content
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} target={target} rel={rel} className="inline-block">
      {content}
    </Link>
  )
}

function renderHomeSectorListBlock(
  block: HomeSectorListBlock,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
  const items = block.items || []
  const highlightedIndex = items.findIndex((item) => item.isHighlighted)

  return (
    <div
      className="relative overflow-hidden py-6 sm:py-8 lg:py-10"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-background via-background/85 to-transparent sm:h-14"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-background via-background/85 to-transparent sm:h-16"
        aria-hidden="true"
      />
      <nav aria-label="Albatha sectors">
        <ul className="flex flex-col -space-y-1 sm:-space-y-2 lg:-space-y-3">
          {items.map((item, itemIndex) => {
            const itemPath = toArrayItemPath(`${blockPath}.items`, item._key, itemIndex)

            return (
              <li key={item._key || `sector-list-item-${itemIndex}`}>
                {renderSectorListItem(
                  item,
                  itemIndex,
                  highlightedIndex,
                  itemPath,
                  pageId,
                  pageType,
                  isDraftMode,
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

function renderHomeSectorItem(
  block: HomeSectorItem,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
  const href = resolveLinkHref(block.link)
  const target = resolveLinkTarget(undefined, block.link?.openInNewTab)
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined
  const imageAssetId = resolveImageAssetId(block.image?.asset)
  const linkLabel = `${block.ctaLabel || 'Learn More'}: ${block.title || 'Sector'}`
  const content = (
    <article className="group relative isolate overflow-hidden rounded-[1.75rem] bg-albatha-midnight shadow-2xl shadow-black/10">
      {imageAssetId ? (
        <SanityImage
          id={imageAssetId}
          alt={block.image?.alt || block.title || ''}
          width={1034}
          height={1212}
          className="h-full min-h-[22rem] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:min-h-[26rem] lg:min-h-[36rem]"
        />
      ) : (
        <div
          className="min-h-[22rem] bg-albatha-midnight sm:min-h-[26rem] lg:min-h-[36rem]"
          aria-hidden="true"
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-albatha-midnight/80 via-albatha-midnight/5 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
        <div className="max-w-[12rem] space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/75 sm:text-sm">
            {block.title || 'Sector'}
          </p>
        </div>
        <SectionArrowIconButton
          decorative
          className="shrink-0 shadow-lg shadow-black/25 group-hover:translate-x-1"
        />
      </div>
    </article>
  )

  if (!href) {
    return (
      <div
        data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
      >
        {content}
      </div>
    )
  }

  const sharedClassName =
    'block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-albatha-blue focus-visible:ring-offset-4 focus-visible:ring-offset-background'

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={linkLabel}
        data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
        className={sharedClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={linkLabel}
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
      className={sharedClassName}
    >
      {content}
    </Link>
  )
}

function renderHomeSectorsSection(
  block: Extract<PageBuilderBlock, {_type: 'homeSectorsSection'}>,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
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
            {renderBlockArray(block.contents || [], contentPath, pageId, pageType, isDraftMode)}
          </div>
        </div>
      </HomeSectionRenderContext.Provider>
    </section>
  )
}

function renderHomeCompanyItem(
  item: HomeCompanyItem,
  itemIndex: number,
  itemPath: string,
  pageId: string,
  pageType: string,
  isDraftMode: boolean,
) {
  const href = resolveLinkHref(item.link)
  const target = resolveLinkTarget(undefined, item.link?.openInNewTab)
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  return (
    <CompanyFeatureLink
      key={item._key || `company-item-${itemIndex}`}
      name={item.name || 'Company'}
      category={item.category}
      href={href}
      target={target}
      rel={rel}
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, itemPath)}
    />
  )
}

function renderHomeCompanyItemsBlock(
  block: HomeCompanyItemsBlock,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
  const items = block.items || []

  return (
    <div data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}>
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item, itemIndex) =>
          renderHomeCompanyItem(
            item,
            itemIndex,
            toArrayItemPath(`${blockPath}.items`, item._key, itemIndex),
            pageId,
            pageType,
            isDraftMode,
          ),
        )}
      </div>
    </div>
  )
}

function renderHomeCompaniesSection(
  block: Extract<PageBuilderBlock, {_type: 'homeCompaniesSection'}>,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
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
            {renderBlockArray(block.contents || [], contentPath, pageId, pageType, isDraftMode)}
          </div>
        </div>
      </HomeSectionRenderContext.Provider>
    </section>
  )
}

function renderHomeBlogPostsSection(
  block: Extract<PageBuilderBlock, {_type: 'homeBlogPostsSection'}>,
  pageId: string,
  pageType: string,
  blockPath: string,
  isDraftMode: boolean,
) {
  const sectionId = 'blog-posts'
  const contentPath = `${blockPath}.contents`
  const postsPath = `${blockPath}.posts`
  const floatingActionHref = resolveLinkHref(block.floatingActionLink) || '/#top'
  const posts = block.posts || []
  const featuredPost = posts[0]
  const supportingPosts = posts.slice(1, 4)

  return (
    <section
      id={sectionId}
      className="relative isolate bg-albatha-midnight pb-20 pt-10 text-white sm:pb-24 sm:pt-12 lg:pb-[7.5rem] lg:pt-10"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <HomeSectionRenderContext.Provider value="blog-posts">
        <div className="mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {block.contents?.length ? (
              <div
                className="space-y-6 lg:space-y-8"
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  contentPath,
                )}
              >
                {renderBlockArray(block.contents, contentPath, pageId, pageType, isDraftMode)}
              </div>
            ) : null}

            {featuredPost ? (
              <div
                className="space-y-7 sm:space-y-8"
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  postsPath,
                )}
              >
                <HomeBlogPostCard
                  variant="featured"
                  title={stegaClean(featuredPost.title) || featuredPost.title || 'Featured post'}
                  publishedLabel={formatPostDate(featuredPost.publishedAt)}
                  excerpt={resolvePostExcerpt(featuredPost)}
                  href={resolvePostHref(featuredPost)}
                  imageAssetId={resolveImageAssetId(featuredPost.image?.asset)}
                  imageAlt={featuredPost.image?.alt || featuredPost.title || 'Featured post'}
                  data-sanity={getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(postsPath, featuredPost._key, 0),
                  )}
                />

                {supportingPosts.length ? (
                  <div className="grid gap-6 lg:grid-cols-3">
                    {supportingPosts.map((post, postIndex) => (
                      <HomeBlogPostCard
                        key={post._key || post._id || `blog-post-${postIndex + 1}`}
                        title={stegaClean(post.title) || post.title || 'Post'}
                        publishedLabel={formatPostDate(post.publishedAt)}
                        href={resolvePostHref(post)}
                        data-sanity={getSanityDataAttribute(
                          isDraftMode,
                          {id: pageId, type: pageType},
                          toArrayItemPath(postsPath, post._key, postIndex + 1),
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </HomeSectionRenderContext.Provider>

      <FloatingSectionAction
        label={block.floatingActionLabel || 'Back to Top'}
        href={floatingActionHref}
        direction="up"
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

function renderButton(button: CbButton, key?: string) {
  const text = button.label || button.text || 'Button'
  const href = resolveLinkHref(button.link, button.url)
  const target = resolveLinkTarget(button.linkTarget, button.link?.openInNewTab)
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined

  if (button.actionType === 'link' || href) {
    return (
      <NavigationLink
        key={key}
        href={href || '#'}
        className="inline-flex"
        target={target}
        rel={rel}
      >
        <Button size={button.size || 'md'} variant={button.variant || 'primary'}>
          {text}
        </Button>
      </NavigationLink>
    )
  }

  return (
    <Button key={key} size={button.size || 'md'} variant={button.variant || 'primary'}>
      {text}
    </Button>
  )
}

function resolveNavigationLinkTarget(link: CbNavigationLink): '_self' | '_blank' | undefined {
  return resolveLinkTarget(undefined, link.opensInNewTab || link.link?.openInNewTab)
}

function renderColumnContent(
  column: CbColumn,
  pageId: string,
  pageType: string,
  columnPath: string,
  isDraftMode: boolean,
) {
  const {items, fieldName} = resolveNestedArray(column, 'contents')
  const contentsPath = `${columnPath}.${fieldName}`

  return (
    <div
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)}
    >
      {items.map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${column._key || 'column'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(contentsPath, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderGroupContent(
  group: CbGroup,
  pageId: string,
  pageType: string,
  groupPath: string,
  isDraftMode: boolean,
) {
  const {items, fieldName} = resolveNestedArray(group, 'contents')
  const contentsPath = `${groupPath}.${fieldName}`

  return (
    <div
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)}
    >
      {items.map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${group._key || 'group'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(contentsPath, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderCoverContent(
  cover: CbCover,
  pageId: string,
  pageType: string,
  coverPath: string,
  isDraftMode: boolean,
) {
  const {items, fieldName} = resolveNestedArray(cover, 'contents')
  const contentsPath = `${coverPath}.${fieldName}`

  return (
    <div
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)}
    >
      {items.map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${cover._key || 'cover'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(contentsPath, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

export default function BlockRenderer({
  block,
  index,
  pageType,
  pageId,
  blockPath,
  isDraftMode,
}: BlockRendererProps) {
  const layoutSettings = useLayoutSettings()
  const homeSection = useContext(HomeSectionRenderContext)
  const homeColumnVariant = useContext(HomeColumnVariantContext)
  const shouldUseUnstyledBlockSlot = homeSection !== null
  const key = block._key || `${block._type}-${index}`
  const blockDataAttr = isDraftMode
    ? getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)
    : undefined

  switch (block._type) {
    case 'cbBlock':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <ReusablePattern patternRef={(block as CbBlock).ref} />
        </BlockSlot>
      )
    case 'cbHeading': {
      const as = normalizeHeadingLevel(block.level)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
          data-placeholder={block.placeholder || undefined}
        >
          <Heading
            as={as}
            textAlign={block.textAlign || 'left'}
            unstyled={shouldUseUnstyledBlockSlot}
          >
            {block.content || ''}
          </Heading>
        </BlockSlot>
      )
    }
    case 'cbParagraph':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
          data-placeholder={block.placeholder || undefined}
        >
          <Paragraph
            html={block.content || ''}
            dropCap={block.dropCap || false}
            textAlign={block.textAlign || 'left'}
            fontSize={block.fontSize || 'md'}
            unstyled={shouldUseUnstyledBlockSlot}
          />
        </BlockSlot>
      )
    case 'cbWysiwyg':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <div className="prose">
            <CustomPortableText
              value={Array.isArray(block.content) ? (block.content as PortableTextBlock[]) : []}
            />
          </div>
        </BlockSlot>
      )
    case 'cbHtml':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Html html={block.content || ''} />
        </BlockSlot>
      )
    case 'cbImage': {
      const resolvedImage = resolveMediaUrls(block.media)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Image
            src={resolvedImage.imageUrl || block.url || ''}
            alt={resolvedImage.alt || block.alt || ''}
            caption={block.caption || undefined}
            href={block.href || undefined}
            linkTarget={block.linkTarget || '_self'}
            aspectRatio={block.aspectRatio || 'auto'}
            scale={block.scale || 'cover'}
          />
        </BlockSlot>
      )
    }
    case 'cbButton':
      if (homeSection === 'about' && homeColumnVariant === 'about-copy') {
        const href = resolveLinkHref(block.link, block.url) || '#'
        const target = resolveLinkTarget(block.linkTarget, block.link?.openInNewTab)

        return (
          <SectionArrowCta
            href={href}
            label={block.label || block.text || 'Learn More'}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            data-sanity={blockDataAttr}
          />
        )
      }

      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          {renderButton(block)}
        </BlockSlot>
      )
    case 'cbButtons':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Buttons align={block.align || 'left'} orientation={block.orientation || 'horizontal'}>
            {(block.items || []).map((item, i) => (
              <span
                key={item._key || `${key}-${i}`}
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  toArrayItemPath(`${blockPath}.items`, item._key, i),
                )}
              >
                {renderButton(item, item._key || `${key}-${i}`)}
              </span>
            ))}
          </Buttons>
        </BlockSlot>
      )
    case 'cbList': {
      const listItems: RenderableListItem[] =
        block.items && block.items.length
          ? block.items.map((item, i) => ({
              _key: item._key,
              content: item.content,
              path: toArrayItemPath(`${blockPath}.items`, item._key, i),
            }))
          : (block.values || []).map((value, i) => ({
              content: value,
              path: `${blockPath}.values[${i}]`,
            }))

      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <List
            kind={block.ordered ? 'ordered' : 'unordered'}
            start={block.ordered ? block.start || 1 : undefined}
            reversed={block.ordered ? block.reversed || false : undefined}
          >
            {listItems.map((item, i) => (
              <ListItem
                key={item._key || `${key}-${i}`}
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  item.path,
                )}
              >
                {item.content || ''}
              </ListItem>
            ))}
          </List>
        </BlockSlot>
      )
    }
    case 'cbNavigation':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Navigation
            overlayMenu={block.overlayMenu || 'mobile'}
            icon={block.icon || 'menu'}
            layout={block.layout || 'horizontal'}
          >
            <div className="contents">
              {(block.links || []).map((link, i) => (
                <NavigationLink
                  key={link._key || `${key}-${i}`}
                  data-sanity={getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(`${blockPath}.links`, link._key, i),
                  )}
                  href={resolveLinkHref(link.link, link.url) || '#'}
                  target={resolveNavigationLinkTarget(link)}
                  rel={
                    resolveNavigationLinkTarget(link) === '_blank'
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  title={link.description || undefined}
                  className="inline-flex items-center"
                >
                  {link.label || 'Link'}
                </NavigationLink>
              ))}
            </div>
          </Navigation>
        </BlockSlot>
      )
    case 'cbGroup':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Group
            as={block.tagName || 'div'}
            layout={block.layout || 'default'}
            align={block.align || 'left'}
          >
            {renderGroupContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Group>
        </BlockSlot>
      )
    case 'cbColumn':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Column
            className={cn('space-y-gutenberg-gap-md', isDraftMode && 'min-h-4 p-1')}
            width={block.width || 'auto'}
            verticalAlignment={block.verticalAlignment || 'top'}
          >
            {renderColumnContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Column>
        </BlockSlot>
      )
    case 'cbColumns': {
      const rowClassName = resolveHomeSectionRowClassName(homeSection, block)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={homeSection !== null}
        >
          <Columns
            gap={block.gap || (homeSection ? 'lg' : 'md')}
            verticalAlignment={resolveHomeSectionRowVerticalAlignment(homeSection, block)}
            isStackedOnMobile={block.isStackedOnMobile ?? true}
            className={rowClassName}
          >
            {(block.columns || []).map((column, i) => {
              const columnPath = toArrayItemPath(`${blockPath}.columns`, column._key, i)
              const columnVariant = resolveHomeSectionColumnVariant(homeSection, column)

              return (
                <HomeColumnVariantContext.Provider
                  key={column._key || `${key}-${i}`}
                  value={columnVariant}
                >
                  <Column
                    className={cn(
                      'space-y-gutenberg-gap-md',
                      isDraftMode && 'min-h-4 m-1 p-1',
                      resolveHomeSectionColumnClassName(columnVariant),
                    )}
                    width={column.width || 'auto'}
                    verticalAlignment={resolveHomeSectionColumnVerticalAlignment(
                      homeSection,
                      columnVariant,
                      column,
                    )}
                    stackedOnMobile={block.isStackedOnMobile ?? true}
                    data-sanity={getSanityDataAttribute(
                      isDraftMode,
                      {id: pageId, type: pageType},
                      columnPath,
                    )}
                  >
                    {renderColumnContent(column, pageId, pageType, columnPath, isDraftMode)}
                  </Column>
                </HomeColumnVariantContext.Provider>
              )
            })}
          </Columns>
        </BlockSlot>
      )
    }
    case 'cbCover': {
      const coverMedia = resolveMediaUrls(block.backgroundMedia)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Cover
            backgroundMedia={
              coverMedia.videoUrl
                ? {mediaType: 'video', url: coverMedia.videoUrl}
                : coverMedia.imageUrl
                  ? {mediaType: 'image', url: coverMedia.imageUrl}
                  : block.url
                    ? {mediaType: block.backgroundType || 'image', url: block.url}
                    : undefined
            }
            imageUrl={block.url || undefined}
            alt={block.alt || coverMedia.alt}
            dimRatio={block.dimRatio ?? 50}
            overlayColor={block.overlayColor || '#000000'}
            contentPosition={block.contentPosition || 'center-center'}
            minHeight={block.minHeight || 'md'}
            hasParallax={block.hasParallax || false}
            contentClassName="space-y-gutenberg-gap-md text-white"
          >
            {renderCoverContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Cover>
        </BlockSlot>
      )
    }
    case 'cbShortcode':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Shortcode value={block.text || ''} />
        </BlockSlot>
      )
    case 'cbSiteLogo': {
      const logoRef = layoutSettings?.logo?.asset?._ref
      const logoSrc = imageAssetRefToUrl(logoRef)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <SiteLogo
            src={logoSrc || undefined}
            alt={layoutSettings?.logo?.alt || layoutSettings?.title || 'Site logo'}
            fallbackLabel={layoutSettings?.title || 'Site logo'}
            widthPreset={block.width || 'md'}
            isLink={block.isLink ?? true}
            href={(block.isLink ?? true) ? '/' : undefined}
            linkTarget={block.linkTarget || '_self'}
          />
        </BlockSlot>
      )
    }
    case 'cbVideo':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <Video
            src={block.src || undefined}
            poster={block.poster || undefined}
            caption={block.caption || undefined}
            autoPlay={block.autoplay || false}
            loop={block.loop || false}
            muted={block.muted || false}
            controls={block.controls ?? true}
            playsInline={block.playsInline || false}
          />
        </BlockSlot>
      )
    case 'callToAction':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled={shouldUseUnstyledBlockSlot}
        >
          <CTA block={block as never} index={index} pageId={pageId} pageType={pageType} />
        </BlockSlot>
      )
    case 'infoSection':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <InfoSection block={block as never} index={index} pageId={pageId} pageType={pageType} />
        </BlockSlot>
      )
    case 'homeAboutImageBlock': {
      const imageAssetId = resolveImageAssetId(block.image?.asset)

      return (
        <div data-sanity={blockDataAttr}>
          <div className="overflow-hidden rounded-r-[1.875rem] bg-surface shadow-xl shadow-black/8">
            {imageAssetId ? (
              <SanityImage
                id={imageAssetId}
                alt={block.image?.alt || ''}
                width={1200}
                height={900}
                className="h-full min-h-[20rem] w-full object-cover sm:min-h-[26rem] lg:min-h-[40rem]"
              />
            ) : null}
          </div>
        </div>
      )
    }
    case 'homeAboutStatsBlock': {
      const stats = block.stats || []
      const statPairs = [stats.slice(0, 2), stats.slice(2, 4), stats.slice(4, 6)].filter(
        (pair) => pair.length > 0,
      )

      return (
        <div data-sanity={blockDataAttr}>
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {stats.map((stat, statIndex) =>
              renderAboutStatCard(
                stat,
                toArrayItemPath(`${blockPath}.stats`, stat._key, statIndex),
                pageId,
                pageType,
                isDraftMode,
              ),
            )}
          </div>
          <div className="hidden gap-5 lg:grid lg:grid-cols-3">
            {statPairs.map((pair, pairIndex) => (
              <div
                key={`about-stat-pair-${pairIndex}`}
                className={cn('flex flex-col gap-5', pairIndex === 1 && 'pt-20')}
              >
                {pair.map((stat) => {
                  const statIndex = stats.findIndex((item) => item._key === stat._key)

                  return renderAboutStatCard(
                    stat,
                    toArrayItemPath(`${blockPath}.stats`, stat._key, statIndex),
                    pageId,
                    pageType,
                    isDraftMode,
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'homeCompanyItemsBlock':
      return renderHomeCompanyItemsBlock(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeSectorListBlock':
      return renderHomeSectorListBlock(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeSectorItem':
      return renderHomeSectorItem(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeHeroSection':
      return renderHomeHeroSection(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeAboutSection':
      return renderHomeAboutSection(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeSectorsSection':
      return renderHomeSectorsSection(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeCompaniesSection':
      return renderHomeCompaniesSection(block, pageId, pageType, blockPath, isDraftMode)
    case 'homeBlogPostsSection':
      return renderHomeBlogPostsSection(block, pageId, pageType, blockPath, isDraftMode)
    default:
      return null
  }
}
