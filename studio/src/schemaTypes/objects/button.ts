import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbButton',
  title: 'Content Button',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({
      name: 'actionType',
      title: 'Action Type',
      type: 'string',
      initialValue: 'button',
      options: {
        list: [
          {title: 'Button', value: 'button'},
          {title: 'Link', value: 'link'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cbLink',
      hidden: ({parent}) => parent?.actionType !== 'link',
    }),
  ],
})
