import {defineField, defineType} from 'sanity'
import {pageBuilderAtomBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'cbCover',
  title: 'Content Cover',
  type: 'object',
  fields: [
    defineField({name: 'backgroundMedia', title: 'Background Media', type: 'cbMedia'}),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: pageBuilderAtomBlockTypes,
    }),
  ],
})
