import {stegaClean} from '@sanity/client/stega'
import type {ReactNode} from 'react'

import type {CbLink, CbMedia, HomeHeroPhrase, PageBuilderBlock, PostPreview} from '@/sanity/lib/types'

export type RenderBlocks = (blocks: PageBuilderBlock[], blockPath: string) => ReactNode

export type HomeSectionRendererProps<TBlock extends PageBuilderBlock> = {
  block: TBlock
  pageId: string
  pageType: string
  blockPath: string
  isDraftMode: boolean
  renderBlocks: RenderBlocks
}

function cleanSanityString(value?: string | null): string | null | undefined {
  return typeof value === 'string' ? (stegaClean(value) || value) : value
}

export function resolveLinkHref(link?: CbLink | null, fallbackUrl?: string | null): string | null {
  const linkType = cleanSanityString(link?.linkType)
  const internalTargetType = cleanSanityString(link?.internalTargetType)
  const internalPageSlug = cleanSanityString(link?.internalPageSlug)
  const internalPath = cleanSanityString(link?.internalPath)
  const externalUrl = cleanSanityString(link?.externalUrl)

  if (
    linkType === 'internal' &&
    (internalTargetType === 'page' || internalTargetType == null) &&
    internalPageSlug
  ) {
    return `/${internalPageSlug}`
  }

  if (linkType === 'internal' && internalPath) {
    return internalPath.startsWith('/') ? internalPath : `/${internalPath}`
  }

  if (linkType === 'external' && externalUrl) {
    return externalUrl
  }

  return fallbackUrl || null
}

export function resolveLinkTarget(
  explicitTarget?: '_self' | '_blank' | string | null,
  openInNewTab?: boolean | null,
): '_self' | '_blank' | undefined {
  const cleanedTarget = cleanSanityString(explicitTarget)

  if (cleanedTarget === '_blank') {
    return '_blank'
  }

  if (openInNewTab) {
    return '_blank'
  }

  return cleanedTarget === '_self' ? '_self' : undefined
}

export function imageAssetRefToUrl(ref?: string | null): string | null {
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

export function resolveMediaUrls(media?: CbMedia | null) {
  return {
    imageUrl: imageAssetToUrl(media?.image?.asset),
    videoUrl: fileAssetToUrl(media?.videoFile?.asset),
    alt: media?.image?.alt || '',
    mediaType: media?.mediaType || 'image',
  }
}

export function resolveImageAssetId(asset?: {_ref?: string | null; _id?: string | null} | null) {
  return asset?._ref || asset?._id || null
}

export function resolveHeroPhrasePlacement(placement?: HomeHeroPhrase['placement'] | null) {
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

export function formatPostDate(publishedAt?: string | null) {
  const cleanedPublishedAt = cleanSanityString(publishedAt)

  if (!cleanedPublishedAt) {
    return 'No date'
  }

  const parsedDate = new Date(cleanedPublishedAt)
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

export function resolvePostHref(post: PostPreview) {
  return cleanSanityString(post.seo?.canonicalUrl) || null
}

export function resolvePostExcerpt(post: PostPreview) {
  const summary = post.seo?.metaDescription || post.seo?.ogDescription || null
  if (!summary) {
    return null
  }

  return stegaClean(summary) || summary
}
