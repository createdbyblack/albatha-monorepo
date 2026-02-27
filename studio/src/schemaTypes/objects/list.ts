import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbList',
  title: 'Content List',
  type: 'object',
  fields: [
    defineField({ name: 'ordered', title: 'Ordered', type: 'boolean', initialValue: false }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [{ type: 'cbListItem' }] })
  ]
});
