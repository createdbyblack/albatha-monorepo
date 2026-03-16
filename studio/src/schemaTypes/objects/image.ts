import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbImage',
  title: 'Content Image',
  type: 'object',
  fields: [
    defineField({name: 'media', title: 'Media', type: 'cbMedia'}),
    defineField({name: 'url', title: 'URL', type: 'string', initialValue: ''}),
    defineField({name: 'alt', title: 'Alt', type: 'string', initialValue: ''}),
    defineField({name: 'caption', title: 'Caption', type: 'string', initialValue: ''}),
    defineField({name: 'href', title: 'Link URL', type: 'string', initialValue: ''}),
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
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      initialValue: 'auto',
      options: {
        list: [
          {title: 'Auto', value: 'auto'},
          {title: '1/1', value: '1/1'},
          {title: '4/3', value: '4/3'},
          {title: '16/9', value: '16/9'},
          {title: '3/4', value: '3/4'},
          {title: '9/16', value: '9/16'},
        ],
      },
    }),
    defineField({
      name: 'scale',
      title: 'Scale',
      type: 'string',
      initialValue: 'cover',
      options: {
        list: [
          {title: 'Cover', value: 'cover'},
          {title: 'Contain', value: 'contain'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'sizeSlug', title: 'Size Slug', type: 'string', initialValue: 'large'}),
  ],
})
