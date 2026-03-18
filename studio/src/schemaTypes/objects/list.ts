import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbList',
  title: 'Content List',
  type: 'object',
  fields: [
    defineField({name: 'ordered', title: 'Ordered', type: 'boolean', initialValue: false}),
    defineField({name: 'start', title: 'Start', type: 'number', initialValue: 1}),
    defineField({name: 'reversed', title: 'Reversed', type: 'boolean', initialValue: false}),
    defineField({
      name: 'items',
      title: 'Items',
      description: 'Use keyed list items so drag-and-drop paths stay stable in Visual Editing.',
      type: 'array',
      of: [{type: 'cbListItem'}],
    }),
    defineField({
      name: 'values',
      title: 'Legacy Values',
      description: 'Legacy string list preserved for compatibility. Migrate entries into Items.',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({parent}) => {
        const value = parent as {items?: unknown[]; values?: unknown[]} | undefined
        return !value?.values?.length || Boolean(value.items?.length)
      },
    }),
  ],
})
