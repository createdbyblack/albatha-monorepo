import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuMegaMenuGroup = defineType({
  name: 'menuMegaMenuGroup',
  title: 'Mega Menu Group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      description: 'Columns of links displayed under this mega menu group.',
      type: 'array',
      of: [defineArrayMember({type: 'menuMegaMenuColumn'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      columns: 'columns',
    },
    prepare({title, columns}) {
      const count = Array.isArray(columns) ? columns.length : 0
      return {
        title: title || 'Mega Menu Group',
        subtitle: `${count} column${count === 1 ? '' : 's'}`,
      }
    },
  },
})
