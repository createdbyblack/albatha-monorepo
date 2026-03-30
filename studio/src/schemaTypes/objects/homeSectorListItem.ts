import {defineField, defineType} from 'sanity'

export const homeSectorListItem = defineType({
  name: 'homeSectorListItem',
  title: 'Home Sector List Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cbLink',
    }),
    defineField({
      name: 'isHighlighted',
      title: 'Highlighted',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isHighlighted: 'isHighlighted',
    },
    prepare({title, isHighlighted}) {
      return {
        title: title || 'Sector item',
        subtitle: isHighlighted ? 'Highlighted' : 'Standard',
      }
    },
  },
})
