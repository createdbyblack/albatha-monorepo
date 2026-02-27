import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbParagraph',
  title: 'Content Paragraph',
  type: 'object',
  fields: [defineField({name: 'content', title: 'Content', type: 'text'})],
})
