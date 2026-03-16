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
]
