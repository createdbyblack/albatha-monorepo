import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from './pageBuilderBlockTypes'

export const homeAboutSection = defineType({
  name: 'homeAboutSection',
  title: 'Home About Section',
  type: 'object',
  fields: [
    defineField({
      name: 'contents',
      title: 'Contents',
      description:
        'Use rows and columns for the top media and copy plus the bottom stats grid. Keep the dynamic body inside this field.',
      type: 'array',
      of: pageBuilderRowBlockTypes,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home About Section',
      }
    },
  },
})
