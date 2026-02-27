type BlockType = {type: string}

export const pageBuilderAtomBlockTypes: BlockType[] = [
  {type: 'cbHeading'},
  {type: 'cbParagraph'},
  {type: 'cbWysiwyg'},
  {type: 'cbImage'},
]

export const pageBuilderContainerBlockTypes: BlockType[] = [
  {type: 'cbButtons'},
  {type: 'cbColumns'},
  {type: 'cbGroup'},
  {type: 'cbList'},
  {type: 'cbNavigation'},
  {type: 'cbCover'},
]

export const pageBuilderComposableBlockTypes: BlockType[] = [
  ...pageBuilderAtomBlockTypes,
  ...pageBuilderContainerBlockTypes,
]
