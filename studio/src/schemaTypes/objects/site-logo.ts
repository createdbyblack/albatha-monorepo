import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbSiteLogo',
  title: 'Site Logo',
  type: 'object',
  fields: [
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'isLink', title: 'Link To Home', type: 'boolean', initialValue: true}),
    defineField({
      name: 'linkTarget',
      title: 'Link Target',
      type: 'string',
      initialValue: '_self',
      options: {
        list: [
          {title: 'Same tab', value: '_self'},
          {title: 'New tab', value: '_blank'},
        ],
        layout: 'radio',
      },
    }),
  ],
})
