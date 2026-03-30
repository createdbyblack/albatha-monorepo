import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from './pageBuilderBlockTypes'

export const homeSectorsSection = defineType({
  name: 'homeSectorsSection',
  title: 'Home Sectors Section',
  type: 'object',
  fields: [
    defineField({
      name: 'contents',
      title: 'Contents',
      description:
        'Use rows and columns for the section heading and any supporting copy. Keep the dynamic body inside this field.',
      type: 'array',
      of: pageBuilderRowBlockTypes,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Sectors Section',
      }
    },
  },
})
