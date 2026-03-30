import {defineArrayMember} from 'sanity'

type BlockType = {type: string}

export const pageBuilderAtomBlockTypes: BlockType[] = [
  defineArrayMember({type: 'cbBlock'}),
  defineArrayMember({type: 'cbButton'}),
  defineArrayMember({type: 'cbHeading'}),
  defineArrayMember({type: 'cbParagraph'}),
  defineArrayMember({type: 'cbWysiwyg'}),
  defineArrayMember({type: 'cbHtml'}),
  defineArrayMember({type: 'cbImage'}),
  defineArrayMember({type: 'cbShortcode'}),
  defineArrayMember({type: 'cbSiteLogo'}),
  defineArrayMember({type: 'cbVideo'}),
]

export const pageBuilderRowBlockTypes: BlockType[] = [
  defineArrayMember({type: 'cbColumns'}),
]

export const pageBuilderContentBlockTypes: BlockType[] = [
  defineArrayMember({type: 'cbButtons'}),
  defineArrayMember({type: 'cbGroup'}),
  defineArrayMember({type: 'cbList'}),
  defineArrayMember({type: 'cbNavigation'}),
  defineArrayMember({type: 'cbCover'}),
  ...pageBuilderRowBlockTypes,
]

export const pageBuilderContainerBlockTypes = pageBuilderRowBlockTypes

export const pageBuilderComposableBlockTypes: BlockType[] = [
  ...pageBuilderAtomBlockTypes,
  ...pageBuilderContentBlockTypes,
  defineArrayMember({type: 'homeAboutImageBlock'}),
  defineArrayMember({type: 'homeAboutStatsBlock'}),
  defineArrayMember({type: 'homeCompanyItemsBlock'}),
  defineArrayMember({type: 'homeSectorItem'}),
  defineArrayMember({type: 'homeSectorListBlock'}),
]

export const homePageSectionBlockTypes: BlockType[] = [
  defineArrayMember({type: 'homeHeroSection'}),
  defineArrayMember({type: 'homeAboutSection'}),
  defineArrayMember({type: 'homeSectorsSection'}),
  defineArrayMember({type: 'homeCompaniesSection'}),
  defineArrayMember({type: 'homeBlogPostsSection'}),
]
