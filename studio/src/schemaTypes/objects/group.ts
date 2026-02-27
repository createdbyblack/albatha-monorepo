import {defineField, defineType} from 'sanity'
import {pageBuilderComposableBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'cbGroup',
  title: 'Content Group',
  type: 'object',
  fields: [
    defineField({
      name: 'children',
      title: 'Children',
      type: 'array',
      of: pageBuilderComposableBlockTypes,
    }),
  ],
})
