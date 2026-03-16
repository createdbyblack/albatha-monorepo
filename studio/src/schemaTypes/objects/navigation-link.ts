import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbNavigationLink',
  title: 'Content Navigation Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'url', title: 'URL', type: 'string', initialValue: ''}),
    defineField({name: 'opensInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false}),
    defineField({name: 'description', title: 'Description', type: 'string', initialValue: ''}),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'custom',
      options: {
        list: [
          {title: 'Custom', value: 'custom'},
          {title: 'Page', value: 'page'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'link', title: 'Link', type: 'cbLink'}),
  ],
})
