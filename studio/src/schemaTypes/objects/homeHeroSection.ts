import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from './pageBuilderBlockTypes'

export const homeHeroSection = defineType({
  name: 'homeHeroSection',
  title: 'Home Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundMedia',
      title: 'Background Media',
      type: 'cbMedia',
    }),
    defineField({
      name: 'phrases',
      title: 'Phrases',
      description: 'Floating phrases rendered around the hero.',
      type: 'array',
      of: [{type: 'homeHeroPhrase'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'contents',
      title: 'Contents',
      description:
        'Use rows and columns for the hero headline and supporting copy. Keep the dynamic body inside this field.',
      type: 'array',
      of: pageBuilderRowBlockTypes,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'floatingActionLabel',
      title: 'Floating Action Label',
      type: 'string',
      initialValue: 'Know More',
    }),
    defineField({
      name: 'floatingActionLink',
      title: 'Floating Action Link',
      type: 'cbLink',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Hero Section',
      }
    },
  },
})
