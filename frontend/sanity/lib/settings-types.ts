import type {ContentLink} from '@/sanity/lib/content-link'

export type MenuLink = {
  _key?: string
  itemId?: string | null
  label?: string | null
  link?: ContentLink
  subLinks?: MenuLink[] | null
}

export type MenuGroup = {
  menuId?: string | null
  title?: string | null
  links?: MenuLink[] | null
}

export type FooterNavigationColumn = {
  _key?: string
  links?: MenuLink[] | null
}

export type FooterNavigationGroup = {
  _key?: string
  title?: string | null
  columns?: FooterNavigationColumn[] | null
}

export type LayoutSettings = {
  title?: string | null
  logo?: {
    asset?: {_ref?: string} | null
    alt?: string | null
  } | null
  companyName?: string | null
  officeLocations?:
    | Array<{
        _key?: string
        title?: string | null
        address?: string | null
      }>
    | null
  contactPhone?: string | null
  contactEmail?: string | null
  header?: {
    primaryMenu?: MenuGroup | null
    secondaryMenu?: MenuGroup | null
    ctaLabel?: string | null
    ctaLink?: ContentLink
  } | null
  footer?: {
    positiveLogo?: {
      asset?: {_ref?: string} | null
      alt?: string | null
    } | null
    negativeLogo?: {
      asset?: {_ref?: string} | null
      alt?: string | null
    } | null
    navigationGroups?: FooterNavigationGroup[] | null
    heading?: string | null
    menu?: MenuGroup | null
    legalMenu?: MenuGroup | null
    showDefaultLegalLinks?: boolean | null
    copyrightText?: string | null
    creditLabel?: string | null
    creditLink?: ContentLink | null
  } | null
  gtmScript?: string | null
  gaScript?: string | null
  cookiePolicyScript?: string | null
}
