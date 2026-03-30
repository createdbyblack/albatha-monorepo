import {defineField, defineType} from 'sanity'

export const homeAboutImageBlock = defineType({
  name: 'homeAboutImageBlock',
  title: 'Home About Image Block',
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
  ],
  preview: {
    select: {
      media: 'image',
    },
    prepare({media}) {
      return {
        title: 'Home About Image Block',
        media,
      }
    },
  },
})
