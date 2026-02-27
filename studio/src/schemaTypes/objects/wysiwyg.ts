import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbWysiwyg',
  title: 'Content WYSIWYG',
  type: 'object',
  fields: [defineField({name: 'content', title: 'Content', type: 'blockContentTextOnly'})],
})
