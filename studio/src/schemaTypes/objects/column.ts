import {defineField, defineType} from 'sanity'
import {pageBuilderComposableBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'cbColumn',
  title: 'Column',
  type: 'object',
  fields: [
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      initialValue: 'auto',
      options: {
        list: [
          {title: 'Auto', value: 'auto'},
          {title: '1/2', value: '1/2'},
          {title: '1/3', value: '1/3'},
          {title: '1/4', value: '1/4'},
          {title: '2/3', value: '2/3'},
          {title: '3/4', value: '3/4'},
        ],
      },
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
      name: 'contents',
      title: 'Contents',
      description: 'Add any page-builder block here, including nested rows when the layout needs another loop.',
      type: 'array',
      of: pageBuilderComposableBlockTypes,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'children',
      title: 'Legacy Content',
      description: 'Legacy field shown only for existing content that has not been moved into Contents yet.',
      type: 'array',
      of: pageBuilderComposableBlockTypes,
      hidden: ({parent}) => {
        const value = parent as {contents?: unknown[]; children?: unknown[]} | undefined
        return !value?.children?.length || Boolean(value.contents?.length)
      },
    }),
  ],
})
