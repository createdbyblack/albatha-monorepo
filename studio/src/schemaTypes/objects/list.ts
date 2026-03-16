import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbList',
  title: 'Content List',
  type: 'object',
  fields: [
    defineField({name: 'ordered', title: 'Ordered', type: 'boolean', initialValue: false}),
    defineField({name: 'start', title: 'Start', type: 'number', initialValue: 1}),
    defineField({name: 'reversed', title: 'Reversed', type: 'boolean', initialValue: false}),
    defineField({name: 'values', title: 'Values', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'items', title: 'Items', type: 'array', of: [{type: 'cbListItem'}]}),
  ],
})
