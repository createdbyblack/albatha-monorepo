import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbImage',
  title: 'Content Image',
  type: 'object',
  fields: [
    defineField({name: 'media', title: 'Media', type: 'cbMedia'}),
  ],
})
