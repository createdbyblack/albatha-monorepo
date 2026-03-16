import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbButtons',
  title: 'Content Buttons Group',
  type: 'object',
  fields: [
    defineField({
      name: 'align',
      title: 'Align',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation',
      type: 'string',
      initialValue: 'horizontal',
      options: {
        list: [
          {title: 'Horizontal', value: 'horizontal'},
          {title: 'Vertical', value: 'vertical'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'items',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'cbButton'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
})
