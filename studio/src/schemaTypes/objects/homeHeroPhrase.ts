import {defineField, defineType} from 'sanity'

export const homeHeroPhrase = defineType({
  name: 'homeHeroPhrase',
  title: 'Home Hero Phrase',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      initialValue: 'upperLeft',
      options: {
        list: [
          {title: 'Upper Left', value: 'upperLeft'},
          {title: 'Middle Right', value: 'middleRight'},
          {title: 'Lower Left', value: 'lowerLeft'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
      placement: 'placement',
    },
    prepare({title, placement}) {
      return {
        title: title || 'Hero phrase',
        subtitle: placement ? `Placement: ${placement}` : 'Placement not set',
      }
    },
  },
})
