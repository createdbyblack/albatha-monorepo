import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbShortcode',
  title: 'Shortcode',
  type: 'object',
  fields: [defineField({name: 'text', title: 'Text', type: 'string', initialValue: ''})],
})
