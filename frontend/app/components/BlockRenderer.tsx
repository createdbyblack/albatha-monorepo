'use client'

import CTA from '@/app/components/Cta'
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
    default:
      return null
  }
}
