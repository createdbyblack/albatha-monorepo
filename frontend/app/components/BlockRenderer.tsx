'use client'

import Link from 'next/link'
import {stegaClean} from '@sanity/client/stega'

import CTA from '@/app/components/Cta'
import SanityImage from '@/app/components/SanityImage'
import CompanyFeatureLink from '@/app/components/home/CompanyFeatureLink'
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
  type CbCover,
  type CbGroup,
  type CbLink,
  type CbMedia,
  type CbNavigationLink,
  type HomeCompanyItem,
  type HomeCompanyItemsBlock,
  type HomeAboutStat,
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

function resolveNestedArray(
  block: {contents?: PageBuilderBlock[] | null; children?: PageBuilderBlock[] | null; content?: PageBuilderBlock[] | null},
  preferredField: NestedArrayFieldName,
): {items: PageBuilderBlock[]; fieldName: NestedArrayFieldName} {
  const arraysByField: Partial<Record<NestedArrayFieldName, PageBuilderBlock[] | null | undefined>> = {
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

function imageAssetToUrl(asset?: {url?: string | null; _ref?: string | null; _id?: string | null} | null) {
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

function fileAssetToUrl(asset?: {url?: string | null; _ref?: string | null; _id?: string | null} | null) {
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

function resolveImageAssetId(asset?: { _ref?: string | null; _id?: string | null } | null) {
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

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/65" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" aria-hidden="true" />

      {(block.phrases || []).map((phrase, phraseIndex) => (
        <div
          key={phrase._key || `hero-phrase-${phraseIndex}`}
          className={cn('pointer-events-none absolute z-10 hidden lg:block', resolveHeroPhrasePlacement(phrase.placement))}
        >
          <HeroPhraseBadge
            text={phrase.text || 'Hero phrase'}
            delayMs={phraseIndex * 1000}
            data-sanity={
              getSanityDataAttribute(
                isDraftMode,
                {id: pageId, type: pageType},
                toArrayItemPath(`${blockPath}.phrases`, phrase._key, phraseIndex),
              )
            }
          />
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen items-end px-4 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:px-10 lg:pb-28 lg:pt-40 xl:px-20">
        <div className="mx-auto w-full max-w-wide">
          <div
            className="space-y-8 lg:space-y-12"
            data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentPath)}
          >
            {(block.contents || []).map((row, rowIndex) => (
              (() => {
                const rowPath = toArrayItemPath(contentPath, row._key, rowIndex)

                return (
                  <Columns
                    key={row._key || `hero-row-${rowIndex}`}
                    gap={row.gap || 'lg'}
                    verticalAlignment={row.verticalAlignment || 'bottom'}
                    isStackedOnMobile={row.isStackedOnMobile ?? true}
                    className="justify-between"
                    data-sanity={
                      getSanityDataAttribute(
                        isDraftMode,
                        {id: pageId, type: pageType},
                        rowPath,
                      )
                    }
                  >
                    {(row.columns || []).map((column, columnIndex) => {
                      const columnPath = toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex)

                      return (
                        <Column
                          key={column._key || `hero-column-${columnIndex}`}
                          className={cn(
                            'space-y-gutenberg-gap-md',
                            isDraftMode && 'min-h-4 m-1 p-1',
                            columnIndex === 0 &&
                              'max-w-4xl [&_h1]:text-6xl [&_h1]:font-normal [&_h1]:leading-none [&_h1]:tracking-tight sm:[&_h1]:text-7xl lg:[&_h1]:text-8xl xl:[&_h1]:text-9xl',
                            columnIndex === 1 &&
                              'max-w-xl lg:ml-auto lg:pb-2 [&_p]:text-lg [&_p]:leading-snug [&_p]:text-white/90 sm:[&_p]:text-xl lg:[&_p]:text-3xl',
                          )}
                          width={column.width || 'auto'}
                          verticalAlignment={column.verticalAlignment || 'bottom'}
                          data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, columnPath)}
                        >
                          {renderColumnContent(
                            column,
                            pageId,
                            pageType,
                            columnPath,
                            isDraftMode,
                          )}
                        </Column>
                      )
                    })}
                  </Columns>
                )
              })()
            ))}
          </div>
        </div>
      </div>

      <FloatingSectionAction
        label={block.floatingActionLabel || 'Know More'}
        href={floatingActionHref}
        sectionId={sectionId}
        data-sanity={
          getSanityDataAttribute(
            isDraftMode,
            {id: pageId, type: pageType},
            block.floatingActionLink ? `${blockPath}.floatingActionLink` : `${blockPath}.floatingActionLabel`,
          )
        }
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

function renderAboutColumnContent(
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
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)
      }
    >
      {items.map((child, childIndex) => {
        const childPath = toArrayItemPath(contentsPath, child._key, childIndex)

        if (child._type === 'cbButton') {
          const href = resolveLinkHref(child.link, child.url) || '#'
          const target = resolveLinkTarget(child.linkTarget, child.link?.openInNewTab)

          return (
            <SectionArrowCta
              key={child._key || `about-cta-${childIndex}`}
              href={href}
              label={child.label || child.text || 'Learn More'}
              target={target}
              rel={target === '_blank' ? 'noopener noreferrer' : undefined}
              data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, childPath)}
            />
          )
        }

        return (
          <BlockRenderer
            key={child._key || `${column._key || 'column'}-${childIndex}`}
            block={child}
            index={childIndex}
            pageId={pageId}
            pageType={pageType}
            blockPath={childPath}
            isDraftMode={isDraftMode}
          />
        )
      })}
    </div>
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
      <div className="space-y-12 overflow-hidden sm:space-y-16 lg:space-y-20">
        {(block.contents || []).map((row, rowIndex) => {
          const rowPath = toArrayItemPath(contentPath, row._key, rowIndex)

          if (rowIndex === 0) {
            return (
              <div key={row._key || `about-row-${rowIndex}`} className="mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
                <Columns
                  gap={row.gap || 'lg'}
                  verticalAlignment={row.verticalAlignment || 'center'}
                  isStackedOnMobile={row.isStackedOnMobile ?? true}
                  className="items-center gap-10 lg:gap-16"
                  data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}
                >
                  {(row.columns || []).map((column, columnIndex) => {
                    const columnPath = toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex)

                    return (
                      <Column
                        key={column._key || `about-column-${columnIndex}`}
                        width={column.width || 'auto'}
                        verticalAlignment={column.verticalAlignment || 'center'}
                        className={cn(
                          'min-w-0',
                          columnIndex === 0 && 'lg:-ml-24 xl:-ml-40',
                          columnIndex === 1 &&
                            'max-w-3xl space-y-6 [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-snug [&_h2]:text-albatha-midnight sm:[&_h2]:text-5xl [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-snug [&_p]:text-albatha-midnight/90 sm:[&_p]:text-xl lg:[&_p]:text-2xl',
                        )}
                        data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, columnPath)}
                      >
                        {renderAboutColumnContent(
                          column,
                          pageId,
                          pageType,
                          columnPath,
                          isDraftMode,
                        )}
                      </Column>
                    )
                  })}
                </Columns>
              </div>
            )
          }

          return (
            <div key={row._key || `about-row-${rowIndex}`} className="mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
              <div data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}>
                {(row.columns || []).map((column, columnIndex) => (
                  <div
                    key={column._key || `about-stats-column-${columnIndex}`}
                    data-sanity={
                      getSanityDataAttribute(
                        isDraftMode,
                        {id: pageId, type: pageType},
                        toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex),
                      )
                    }
                  >
                    {renderColumnContent(
                      column,
                      pageId,
                      pageType,
                      toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex),
                      isDraftMode,
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function resolveSectorListItemClasses(
  itemIndex: number,
  highlightedIndex: number,
) {
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
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-background via-background/85 to-transparent sm:h-14" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-background via-background/85 to-transparent sm:h-16" aria-hidden="true" />
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
        <div className="min-h-[22rem] bg-albatha-midnight sm:min-h-[26rem] lg:min-h-[36rem]" aria-hidden="true" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-albatha-midnight/80 via-albatha-midnight/5 to-transparent" aria-hidden="true" />
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
      <div data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}>
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
      <div className="mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {(block.contents || []).map((row, rowIndex) => {
            const rowPath = toArrayItemPath(contentPath, row._key, rowIndex)

            if (rowIndex === 0) {
              return (
                <div key={row._key || `sectors-row-${rowIndex}`} className="max-w-4xl">
                  <Columns
                    gap={row.gap || 'lg'}
                    verticalAlignment={row.verticalAlignment || 'top'}
                    isStackedOnMobile={row.isStackedOnMobile ?? true}
                    className="gap-6"
                    data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}
                  >
                    {(row.columns || []).map((column, columnIndex) => {
                      const columnPath = toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex)

                      return (
                        <Column
                          key={column._key || `sectors-heading-column-${columnIndex}`}
                          width={column.width || 'auto'}
                          verticalAlignment={column.verticalAlignment || 'top'}
                          className="space-y-4 [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-albatha-midnight sm:[&_h2]:text-5xl lg:[&_h2]:text-[2.5rem]"
                          data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, columnPath)}
                        >
                          {renderColumnContent(column, pageId, pageType, columnPath, isDraftMode)}
                        </Column>
                      )
                    })}
                  </Columns>
                </div>
              )
            }

            return (
              <Columns
                key={row._key || `sectors-row-${rowIndex}`}
                gap={row.gap || 'lg'}
                verticalAlignment={row.verticalAlignment || 'bottom'}
                isStackedOnMobile={row.isStackedOnMobile ?? true}
                className="items-end gap-8 lg:gap-16 xl:gap-24"
                data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}
              >
                {(row.columns || []).map((column, columnIndex) => {
                  const columnPath = toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex)

                  return (
                    <Column
                      key={column._key || `sectors-column-${columnIndex}`}
                      width={column.width || 'auto'}
                      verticalAlignment={column.verticalAlignment || 'bottom'}
                      className={cn(
                        'min-w-0',
                        columnIndex === 0 && 'order-2 lg:order-1',
                        columnIndex === 1 && 'order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none',
                      )}
                      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, columnPath)}
                    >
                      {renderColumnContent(column, pageId, pageType, columnPath, isDraftMode)}
                    </Column>
                  )
                })}
              </Columns>
            )
          })}
        </div>
      </div>
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

      <div className="relative z-10 mx-auto w-full max-w-wide px-4 sm:px-8 lg:px-10 xl:px-20">
        <div className="space-y-12 sm:space-y-14 lg:space-y-[3.75rem]">
          {(block.contents || []).map((row, rowIndex) => {
            const rowPath = toArrayItemPath(contentPath, row._key, rowIndex)

            if (rowIndex === 0) {
              return (
                <div key={row._key || `companies-row-${rowIndex}`} className="mx-auto max-w-6xl">
                  <Columns
                    gap={row.gap || 'lg'}
                    verticalAlignment={row.verticalAlignment || 'center'}
                    isStackedOnMobile={row.isStackedOnMobile ?? true}
                    className="justify-center"
                    data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}
                  >
                    {(row.columns || []).map((column, columnIndex) => {
                      const columnPath = toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex)

                      return (
                        <Column
                          key={column._key || `companies-copy-column-${columnIndex}`}
                          width={column.width || 'auto'}
                          verticalAlignment={column.verticalAlignment || 'center'}
                          className="space-y-4 [&_p]:mt-0 [&_p]:text-center [&_p]:text-xl [&_p]:leading-snug [&_p]:text-white sm:[&_p]:text-2xl lg:[&_p]:text-[2.1875rem] lg:[&_p]:leading-[1.2857142857]"
                          data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, columnPath)}
                        >
                          {renderColumnContent(column, pageId, pageType, columnPath, isDraftMode)}
                        </Column>
                      )
                    })}
                  </Columns>
                </div>
              )
            }

            return (
              <div key={row._key || `companies-row-${rowIndex}`}>
                <Columns
                  gap={row.gap || 'lg'}
                  verticalAlignment={row.verticalAlignment || 'bottom'}
                  isStackedOnMobile={row.isStackedOnMobile ?? true}
                  className="gap-6"
                  data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, rowPath)}
                >
                  {(row.columns || []).map((column, columnIndex) => {
                    const columnPath = toArrayItemPath(`${rowPath}.columns`, column._key, columnIndex)

                    return (
                      <Column
                        key={column._key || `companies-column-${columnIndex}`}
                        width={column.width || 'auto'}
                        verticalAlignment={column.verticalAlignment || 'bottom'}
                        data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, columnPath)}
                      >
                        {renderColumnContent(column, pageId, pageType, columnPath, isDraftMode)}
                      </Column>
                    )
                  })}
                </Columns>
              </div>
            )
          })}
        </div>
      </div>
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
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)
      }
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
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)
      }
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
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, contentsPath)
      }
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
  const key = block._key || `${block._type}-${index}`
  const blockDataAttr = isDraftMode
    ? getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)
    : undefined

  switch (block._type) {
    case 'cbBlock':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType} data-sanity={blockDataAttr}>
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
          data-placeholder={block.placeholder || undefined}
        >
          <Heading as={as} textAlign={block.textAlign || 'left'}>
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
          data-placeholder={block.placeholder || undefined}
        >
          <Paragraph
            html={block.content || ''}
            dropCap={block.dropCap || false}
            textAlign={block.textAlign || 'left'}
            fontSize={block.fontSize || 'md'}
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
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
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
        >
          <Buttons align={block.align || 'left'} orientation={block.orientation || 'horizontal'}>
            {(block.items || []).map((item, i) => (
              <span
                key={item._key || `${key}-${i}`}
                data-sanity={
                  getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(`${blockPath}.items`, item._key, i),
                  )
                }
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
        >
          <List
            kind={block.ordered ? 'ordered' : 'unordered'}
            start={block.ordered ? block.start || 1 : undefined}
            reversed={block.ordered ? block.reversed || false : undefined}
          >
            {listItems.map((item, i) => (
              <ListItem
                key={item._key || `${key}-${i}`}
                data-sanity={
                  getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    item.path,
                  )
                }
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
                  data-sanity={
                    getSanityDataAttribute(
                      isDraftMode,
                      {id: pageId, type: pageType},
                      toArrayItemPath(`${blockPath}.links`, link._key, i),
                    )
                  }
                  href={resolveLinkHref(link.link, link.url) || '#'}
                  target={resolveNavigationLinkTarget(link)}
                  rel={resolveNavigationLinkTarget(link) === '_blank' ? 'noopener noreferrer' : undefined}
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
    case 'cbColumns':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Columns
            gap={block.gap || 'md'}
            verticalAlignment={block.verticalAlignment || 'top'}
            isStackedOnMobile={block.isStackedOnMobile ?? true}
          >
            {(block.columns || []).map((column, i) => (
              <Column
                key={column._key || `${key}-${i}`}
                className={cn('space-y-gutenberg-gap-md', isDraftMode && 'min-h-4 m-1 p-1')}
                width={column.width || 'auto'}
                verticalAlignment={column.verticalAlignment || 'top'}
                stackedOnMobile={block.isStackedOnMobile ?? true}
                data-sanity={
                  getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(`${blockPath}.columns`, column._key, i),
                  )
                }
              >
                {renderColumnContent(
                  column,
                  pageId,
                  pageType,
                  toArrayItemPath(`${blockPath}.columns`, column._key, i),
                  isDraftMode,
                )}
              </Column>
            ))}
          </Columns>
        </BlockSlot>
      )
    case 'cbCover': {
      const coverMedia = resolveMediaUrls(block.backgroundMedia)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
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
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType} data-sanity={blockDataAttr}>
          <Shortcode value={block.text || ''} />
        </BlockSlot>
      )
    case 'cbSiteLogo': {
      const logoRef = layoutSettings?.logo?.asset?._ref
      const logoSrc = imageAssetRefToUrl(logoRef)
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType} data-sanity={blockDataAttr}>
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
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType} data-sanity={blockDataAttr}>
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
      const statPairs = [
        stats.slice(0, 2),
        stats.slice(2, 4),
        stats.slice(4, 6),
      ].filter((pair) => pair.length > 0)

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
              <div key={`about-stat-pair-${pairIndex}`} className={cn('flex flex-col gap-5', pairIndex === 1 && 'pt-20')}>
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
    default:
      return null
  }
}
