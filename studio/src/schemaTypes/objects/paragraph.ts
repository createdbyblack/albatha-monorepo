import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbParagraph',
  title: 'Content Paragraph',
  type: 'object',
  fields: [
    defineField({name: 'content', title: 'Content', type: 'text'}),
    defineField({name: 'dropCap', title: 'Drop Cap', type: 'boolean', initialValue: false}),
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
    defineField({name: 'placeholder', title: 'Placeholder', type: 'string', initialValue: 'Start writing...'}),
    defineField({
      name: 'fontSize',
      title: 'Font Size',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Extra Large', value: 'xl'},
        ],
        layout: 'radio',
      },
    }),
  ],
})
