import CTA from '@/app/components/Cta'
import InfoSection from '@/app/components/InfoSection'
import {PortableText} from 'next-sanity'
import {Button} from '@/app/components/atoms/button'
import {Heading} from '@/app/components/atoms/heading'
import {Html} from '@/app/components/atoms/html'
import {Image} from '@/app/components/atoms/image'
import {ListItem} from '@/app/components/atoms/list-item'
import {NavigationLink} from '@/app/components/atoms/navigation-link'
import {Paragraph} from '@/app/components/atoms/paragraph'
import {Buttons} from '@/app/components/molecules/buttons'
import {Column} from '@/app/components/molecules/column'
import {Group} from '@/app/components/molecules/group'
import {List} from '@/app/components/molecules/list'
import {Navigation} from '@/app/components/molecules/navigation'
import {BlockSlot} from '@/app/components/organisms/block-slot'
import {Columns} from '@/app/components/organisms/columns'
import {Cover} from '@/app/components/organisms/cover'
import {
  type CbButton,
  type CbColumn,
  type CbCover,
  type CbGroup,
  type CbLink,
  type CbMedia,
  type PageBuilderSection,
} from '@/sanity/lib/types'

type BlockRendererProps = {
  block: PageBuilderSection
  index: number
  pageType: string
  pageId: string
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

function isExternalLink(link?: CbLink | null): boolean {
  return link?.linkType === 'external'
}

function normalizeHeadingLevel(level?: string | number | null): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  if (typeof level === 'string') {
    if (level === 'h1' || level === 'h2' || level === 'h3' || level === 'h4' || level === 'h5' || level === 'h6') {
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

function resolveMediaUrls(media?: CbMedia | null) {
  const imageRef = media?.image?.asset?._ref
  const videoRef = media?.videoFile?.asset?._ref

  return {
    imageUrl: imageAssetRefToUrl(imageRef),
    videoUrl: fileAssetRefToUrl(videoRef),
    alt: media?.image?.alt || '',
    mediaType: media?.mediaType || 'image',
  }
}

function renderMedia(media?: CbMedia | null, fallbackUrl?: string | null, fallbackAlt?: string | null) {
  const resolved = resolveMediaUrls(media)
  const mediaType = resolved.mediaType
  const url = (mediaType === 'video' ? resolved.videoUrl : resolved.imageUrl) || fallbackUrl || ''
  const alt = resolved.alt || fallbackAlt || ''

  if (!url) {
    return null
  }

  if (mediaType === 'video') {
    return <video src={url} controls className="h-auto max-w-full rounded-md" />
  }

  return <Image src={url} alt={alt} className="h-auto max-w-full" />
}

function renderButton(button: CbButton, key?: string) {
  const text = button.label || button.text || 'Button'
  const href = resolveLinkHref(button.link, button.url)

  if (button.actionType === 'link' || href) {
    return (
      <NavigationLink
        key={key}
        href={href || '#'}
        className="inline-flex"
        target={isExternalLink(button.link) && button.link?.openInNewTab ? '_blank' : undefined}
        rel={isExternalLink(button.link) && button.link?.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        <Button>
          {text}
        </Button>
      </NavigationLink>
    )
  }

  return (
    <Button key={key}>
      {text}
    </Button>
  )
}

function renderColumnContent(column: CbColumn, pageId: string, pageType: string) {
  return (column.children || []).map((child, childIndex) => (
    <BlockRenderer
      key={child._key || `${column._key || 'column'}-${childIndex}`}
      block={child}
      index={childIndex}
      pageId={pageId}
      pageType={pageType}
    />
  ))
}

function renderGroupContent(group: CbGroup, pageId: string, pageType: string) {
  return (group.children || []).map((child, childIndex) => (
    <BlockRenderer
      key={child._key || `${group._key || 'group'}-${childIndex}`}
      block={child}
      index={childIndex}
      pageId={pageId}
      pageType={pageType}
    />
  ))
}

function renderCoverContent(cover: CbCover, pageId: string, pageType: string) {
  return (cover.content || []).map((child, childIndex) => (
    <BlockRenderer
      key={child._key || `${cover._key || 'cover'}-${childIndex}`}
      block={child}
      index={childIndex}
      pageId={pageId}
      pageType={pageType}
    />
  ))
}

export default function BlockRenderer({block, index, pageType, pageId}: BlockRendererProps) {
  const key = block._key || `${block._type}-${index}`

  switch (block._type) {
    case 'cbHeading': {
      const as = normalizeHeadingLevel(block.level)
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Heading as={as}>{block.content || ''}</Heading>
        </BlockSlot>
      )
    }
    case 'cbParagraph':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Paragraph>{block.content || ''}</Paragraph>
        </BlockSlot>
      )
    case 'cbWysiwyg':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <div className="prose">
            <PortableText value={Array.isArray(block.content) ? (block.content as any[]) : []} />
          </div>
        </BlockSlot>
      )
    case 'cbHtml':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Html html={block.content || ''} />
        </BlockSlot>
      )
    case 'cbImage':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          {renderMedia(block.media, block.url, block.alt)}
        </BlockSlot>
      )
    case 'cbButton':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          {renderButton(block)}
        </BlockSlot>
      )
    case 'cbButtons':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Buttons>{(block.items || []).map((item, i) => renderButton(item, item._key || `${key}-${i}`))}</Buttons>
        </BlockSlot>
      )
    case 'cbList':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <List kind={block.ordered ? 'ordered' : 'unordered'}>
            {(block.items || []).map((item, i) => (
              <ListItem key={item._key || `${key}-${i}`}>{item.content || ''}</ListItem>
            ))}
          </List>
        </BlockSlot>
      )
    case 'cbNavigation':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Navigation>
            <div className="flex flex-wrap gap-3">
              {(block.links || []).map((link, i) => (
                <NavigationLink
                  key={link._key || `${key}-${i}`}
                  href={resolveLinkHref(link.link, link.url) || '#'}
                  target={isExternalLink(link.link) && link.link?.openInNewTab ? '_blank' : undefined}
                  rel={isExternalLink(link.link) && link.link?.openInNewTab ? 'noopener noreferrer' : undefined}
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
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Group className="flex flex-wrap items-start gap-4">{renderGroupContent(block, pageId, pageType)}</Group>
        </BlockSlot>
      )
    case 'cbColumn':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Column className="space-y-4">{renderColumnContent(block, pageId, pageType)}</Column>
        </BlockSlot>
      )
    case 'cbColumns':
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Columns>
            {(block.columns || []).map((column, i) => (
              <Column key={column._key || `${key}-${i}`} className="col-span-12 md:col-span-6 space-y-4">
                {renderColumnContent(column, pageId, pageType)}
              </Column>
            ))}
          </Columns>
        </BlockSlot>
      )
    case 'cbCover': {
      const coverMedia = resolveMediaUrls(block.backgroundMedia)
      return (
        <BlockSlot refId={key} data-page-id={pageId} data-page-type={pageType}>
          <Cover
            backgroundMedia={
              coverMedia.videoUrl
                ? {mediaType: 'video', url: coverMedia.videoUrl}
                : coverMedia.imageUrl
                  ? {mediaType: 'image', url: coverMedia.imageUrl}
                  : undefined
            }
            imageUrl={block.url || undefined}
            contentClassName="space-y-4 text-white"
          >
            {renderCoverContent(block, pageId, pageType)}
          </Cover>
        </BlockSlot>
      )
    }
    case 'callToAction':
      return <CTA block={block as never} index={index} pageId={pageId} pageType={pageType} />
    case 'infoSection':
      return <InfoSection block={block as never} index={index} pageId={pageId} pageType={pageType} />
    default:
      return null
  }
}
