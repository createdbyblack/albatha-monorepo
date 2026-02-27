import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbNavigationLink',
  title: 'Content Navigation Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'link', title: 'Link', type: 'cbLink'}),
  ],
})
