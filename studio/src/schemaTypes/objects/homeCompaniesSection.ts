import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from './pageBuilderBlockTypes'

export const homeCompaniesSection = defineType({
  name: 'homeCompaniesSection',
  title: 'Home Companies Section',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contents',
      title: 'Contents',
      description:
        'Use rows and columns for the centered section copy and company features. Keep the dynamic body inside this field.',
      type: 'array',
      of: pageBuilderRowBlockTypes,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Companies Section',
      }
    },
  },
})
