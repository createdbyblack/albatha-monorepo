import {defineField, defineType} from 'sanity'
import {pageBuilderComposableBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'cbColumn',
  title: 'Content Column',
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
