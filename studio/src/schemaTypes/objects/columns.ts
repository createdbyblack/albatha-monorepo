import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbColumns',
  title: 'Row',
  type: 'object',
  fields: [
    defineField({
      name: 'isStackedOnMobile',
      title: 'Stack On Mobile',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'verticalAlignment',
      title: 'Vertical Alignment',
      type: 'string',
      initialValue: 'top',
      options: {
        list: [
          {title: 'Top', value: 'top'},
          {title: 'Center', value: 'center'},
          {title: 'Bottom', value: 'bottom'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'gap',
      title: 'Gap',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      description: 'A row owns columns, and each column owns its own nested content array.',
      type: 'array',
      of: [{type: 'cbColumn'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
