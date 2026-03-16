import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbListItem',
  title: 'Content List Item',
  type: 'object',
  fields: [defineField({name: 'content', title: 'Content', type: 'text', initialValue: ''})],
})
