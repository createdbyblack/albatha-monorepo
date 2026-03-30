import type {CropData, HotspotData} from 'sanity-image'

export type SanityImageAsset = {
  _ref?: string | null
  _id?: string | null
  url?: string | null
}

export type SanityFileAsset = {
  _ref?: string | null
  _id?: string | null
  url?: string | null
}

export type SanityImageValue = {
  asset?: SanityImageAsset | null
  alt?: string | null
  crop?: CropData
  hotspot?: HotspotData
}

export type CbButton = {
  _key?: string
  _type: 'cbButton'
  text?: string | null
  url?: string | null
  linkTarget?: '_self' | '_blank' | null
  size?: 'sm' | 'md' | 'lg' | null
  variant?: 'primary' | 'secondary' | 'ghost' | null
  label?: string | null
  actionType?: 'button' | 'link' | null
  link?: CbLink | null
}

export type CbButtons = {
  _key?: string
  _type: 'cbButtons'
  align?: 'left' | 'center' | 'right' | null
  orientation?: 'horizontal' | 'vertical' | null
  items?: CbButton[] | null
}

export type CbHeading = {
  _key?: string
  _type: 'cbHeading'
  content?: string | null
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | number | null
  textAlign?: 'left' | 'center' | 'right' | null
  placeholder?: string | null
}

export type CbParagraph = {
  _key?: string
  _type: 'cbParagraph'
  content?: string | null
  dropCap?: boolean | null
  textAlign?: 'left' | 'center' | 'right' | null
  placeholder?: string | null
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | null
}

export type CbWysiwyg = {
  _key?: string
  _type: 'cbWysiwyg'
  content?: unknown[] | null
}

export type CbMedia = {
  _key?: string
  _type: 'cbMedia'
  mediaType?: 'image' | 'video' | null
  image?: SanityImageValue | null
  videoFile?: {
    asset?: SanityFileAsset | null
  } | null
}

export type CbLink = {
  _key?: string
  _type: 'cbLink'
  linkType?: 'external' | 'internal' | null
  internalTargetType?: 'page' | 'path' | null
  internalPage?: {_ref?: string} | null
  internalPageSlug?: string | null
  externalUrl?: string | null
  internalPath?: string | null
  openInNewTab?: boolean | null
}

export type CbHtml = {
  _key?: string
  _type: 'cbHtml'
  content?: string | null
}

export type CbImage = {
  _key?: string
  _type: 'cbImage'
  media?: CbMedia | null
  url?: string | null
  alt?: string | null
  caption?: string | null
  href?: string | null
  linkTarget?: '_self' | '_blank' | null
  aspectRatio?: 'auto' | '1/1' | '4/3' | '16/9' | '3/4' | '9/16' | null
  scale?: 'cover' | 'contain' | null
  sizeSlug?: string | null
}

export type CbListItem = {
  _key?: string
  _type: 'cbListItem'
  content?: string | null
}

export type CbList = {
  _key?: string
  _type: 'cbList'
  ordered?: boolean | null
  // Legacy primitive values are still rendered as a fallback until content is migrated.
  values?: string[] | null
  start?: number | null
  reversed?: boolean | null
  items?: CbListItem[] | null
}

export type CbNavigationLink = {
  _key?: string
  _type: 'cbNavigationLink'
  label?: string | null
  url?: string | null
  opensInNewTab?: boolean | null
  description?: string | null
  type?: 'custom' | 'page' | null
  link?: CbLink | null
}

export type CbNavigation = {
  _key?: string
  _type: 'cbNavigation'
  overlayMenu?: 'never' | 'mobile' | 'always' | null
  openSubmenusOnClick?: boolean | null
  showSubmenuIcon?: boolean | null
  icon?: 'menu' | 'dots' | null
  layout?: 'horizontal' | 'vertical' | null
  links?: CbNavigationLink[] | null
}

export type CbBlock = {
  _key?: string
  _type: 'cbBlock'
  ref?: string | null
}

export type CbShortcode = {
  _key?: string
  _type: 'cbShortcode'
  text?: string | null
}

export type CbSiteLogo = {
  _key?: string
  _type: 'cbSiteLogo'
  width?: 'sm' | 'md' | 'lg' | null
  isLink?: boolean | null
  linkTarget?: '_self' | '_blank' | null
}

export type CbVideo = {
  _key?: string
  _type: 'cbVideo'
  src?: string | null
  poster?: string | null
  caption?: string | null
  autoplay?: boolean | null
  loop?: boolean | null
  muted?: boolean | null
  controls?: boolean | null
  playsInline?: boolean | null
}

export type HeaderVariant = 'positive' | 'negative'

export type PageHeaderAppearance = {
  _type?: 'pageHeaderAppearance'
  variant?: HeaderVariant | null
}

export type FooterVariant = 'positive' | 'negative'

export type PageFooterAppearance = {
  _type?: 'pageFooterAppearance'
  variant?: FooterVariant | null
}

export type HomeHeroPhrase = {
  _key?: string
  _type: 'homeHeroPhrase'
  text?: string | null
  placement?: 'upperLeft' | 'middleRight' | 'lowerLeft' | null
}

export type HomeAboutStat = {
  _key?: string
  _type: 'homeAboutStat'
  value?: string | null
  label?: string | null
  tone?: 'dark' | 'blue' | 'outlineDark' | null
  height?: 'sm' | 'md' | 'lg' | null
}

export type HomeSectorItem = {
  _key?: string
  _type: 'homeSectorItem'
  title?: string | null
  ctaLabel?: string | null
  image?: SanityImageValue | null
  link?: CbLink | null
}

export type HomeCompanyItem = {
  _key?: string
  _type: 'homeCompanyItem'
  name?: string | null
  category?: string | null
  link?: CbLink | null
}

export type HomeAboutImageBlock = {
  _key?: string
  _type: 'homeAboutImageBlock'
  image?: SanityImageValue | null
}

export type HomeAboutStatsBlock = {
  _key?: string
  _type: 'homeAboutStatsBlock'
  stats?: HomeAboutStat[] | null
}

export type HomeCompanyItemsBlock = {
  _key?: string
  _type: 'homeCompanyItemsBlock'
  items?: HomeCompanyItem[] | null
}

export type HomeSectorListItem = {
  _key?: string
  _type: 'homeSectorListItem'
  title?: string | null
  link?: CbLink | null
  isHighlighted?: boolean | null
}

export type HomeSectorListBlock = {
  _key?: string
  _type: 'homeSectorListBlock'
  image?: SanityImageValue | null
  items?: HomeSectorListItem[] | null
}

export type PostPreview = {
  _id?: string
  _type: 'post'
  title?: string | null
  slug?: {current?: string | null} | null
  publishedAt?: string | null
  image?: SanityImageValue | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    canonicalUrl?: string | null
    noIndex?: boolean | null
    ogTitle?: string | null
    ogDescription?: string | null
    ogImage?: SanityImageValue | null
  } | null
}

export type HomeHeroSection = {
  _key?: string
  _type: 'homeHeroSection'
  backgroundMedia?: CbMedia | null
  phrases?: HomeHeroPhrase[] | null
  contents?: CbColumns[] | null
  floatingActionLabel?: string | null
  floatingActionLink?: CbLink | null
}

export type HomeAboutSection = {
  _key?: string
  _type: 'homeAboutSection'
  contents?: CbColumns[] | null
}

export type HomeSectorsSection = {
  _key?: string
  _type: 'homeSectorsSection'
  contents?: CbColumns[] | null
}

export type HomeCompaniesSection = {
  _key?: string
  _type: 'homeCompaniesSection'
  backgroundImage?: SanityImageValue | null
  contents?: CbColumns[] | null
}

export type HomeBlogPostsSection = {
  _key?: string
  _type: 'homeBlogPostsSection'
  contents?: CbColumns[] | null
  posts?: PostPreview[] | null
  floatingActionLabel?: string | null
  floatingActionLink?: CbLink | null
}

export type LegacyCallToAction = {
  _key?: string
  _type: 'callToAction'
  eyebrow?: string
  heading?: string
  body?: unknown[]
  button?: {
    buttonText?: string
    link?: DereferencedLink | null
  } | null
  image?: {
    asset?: {_ref?: string}
    crop?: CropData
  } | null
  theme?: 'dark' | 'light' | null
  contentAlignment?: 'imageFirst' | 'textFirst' | null
}

export type LegacyInfoSection = {
  _key?: string
  _type: 'infoSection'
  heading?: string
  subheading?: string
  content?: unknown[] | null
}

export type PageBuilderBlock =
  | PageBuilderAtom
  | PageBuilderContainer
  | PageBuilderCustomBlock
  | HomePageSection
  | LegacyCallToAction
  | LegacyInfoSection

export type HomePageSection =
  | HomeHeroSection
  | HomeAboutSection
  | HomeSectorsSection
  | HomeCompaniesSection
  | HomeBlogPostsSection

export type PageBuilderSection = PageBuilderBlock

export type PageBuilderAtom =
  | CbBlock
  | CbButton
  | CbHeading
  | CbParagraph
  | CbWysiwyg
  | CbHtml
  | CbImage
  | CbShortcode
  | CbSiteLogo
  | CbVideo

export type PageBuilderContainer =
  | CbButtons
  | CbList
  | CbNavigation
  | CbGroup
  | CbColumn
  | CbColumns
  | CbCover

export type PageBuilderCustomBlock =
  | HomeAboutImageBlock
  | HomeAboutStatsBlock
  | HomeCompanyItemsBlock
  | HomeSectorItem
  | HomeSectorListBlock

export type CbGroup = {
  _key?: string
  _type: 'cbGroup'
  tagName?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | null
  layout?: 'default' | 'constrained' | 'flex' | 'grid' | null
  align?: 'left' | 'center' | 'right' | 'wide' | 'full' | null
  contents?: PageBuilderBlock[] | null
  children?: PageBuilderBlock[] | null
}

export type CbColumn = {
  _key?: string
  _type: 'cbColumn'
  width?: 'auto' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | null
  verticalAlignment?: 'top' | 'center' | 'bottom' | null
  contents?: PageBuilderBlock[] | null
  children?: PageBuilderBlock[] | null
}

export type CbColumns = {
  _key?: string
  _type: 'cbColumns'
  isStackedOnMobile?: boolean | null
  verticalAlignment?: 'top' | 'center' | 'bottom' | null
  gap?: 'none' | 'sm' | 'md' | 'lg' | null
  columns?: CbColumn[] | null
}

export type CbCover = {
  _key?: string
  _type: 'cbCover'
  backgroundMedia?: CbMedia | null
  url?: string | null
  backgroundType?: 'image' | 'video' | null
  alt?: string | null
  dimRatio?: number | null
  overlayColor?: string | null
  contentPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | null
  minHeight?: 'sm' | 'md' | 'lg' | 'full' | null
  hasParallax?: boolean | null
  contents?: PageBuilderBlock[] | null
  content?: PageBuilderBlock[] | null
}

export type ExtractPageBuilderType<T extends string> = Extract<PageBuilderBlock, {_type: T}>

export type PageDocumentForBuilder = {
  _id: string
  _type: string
  name?: string | null
  slug?: {current?: string | null} | null
  headerAppearance?: PageHeaderAppearance | null
  footerAppearance?: PageFooterAppearance | null
  pageBuilder?: PageBuilderSection[] | null
} | null

// Represents a Link after GROQ dereferencing (page references become slug strings)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'page'
  href?: string
  page?: string | null
  openInNewTab?: boolean
}
