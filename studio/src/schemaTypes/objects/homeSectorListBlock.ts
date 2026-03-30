import {defineField, defineType} from 'sanity'

export const homeSectorListBlock = defineType({
  name: 'homeSectorListBlock',
  title: 'Home Sector List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
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
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'homeSectorListItem'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
      media: 'image',
    },
    prepare({items, media}) {
      return {
        title: 'Home Sector List Block',
        subtitle: `${Array.isArray(items) ? items.length : 0} sectors`,
        media,
      }
    },
  },
})
