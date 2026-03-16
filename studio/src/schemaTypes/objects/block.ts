import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbBlock',
  title: 'Reusable Pattern',
  type: 'object',
  fields: [
    defineField({
      name: 'ref',
      title: 'Reference',
      type: 'string',
      description: 'Component lookup ID for a registered reusable pattern.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
