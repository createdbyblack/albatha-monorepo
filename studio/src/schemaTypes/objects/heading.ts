import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbHeading',
  title: 'Content Heading',
  type: 'object',
  fields: [
    defineField({name: 'content', title: 'Content', type: 'string'}),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      initialValue: 'h2',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'H4', value: 'h4'},
          {title: 'H5', value: 'h5'},
          {title: 'H6', value: 'h6'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Align',
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
    defineField({name: 'placeholder', title: 'Placeholder', type: 'string', initialValue: 'Heading...'}),
  ],
})
