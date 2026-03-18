import {defineField, defineType} from 'sanity'
import {pageBuilderComposableBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'cbGroup',
  title: 'Group',
  type: 'object',
  fields: [
    defineField({
      name: 'tagName',
      title: 'Tag Name',
      type: 'string',
      initialValue: 'div',
      options: {
        list: [
          {title: 'div', value: 'div'},
          {title: 'section', value: 'section'},
          {title: 'article', value: 'article'},
          {title: 'aside', value: 'aside'},
          {title: 'header', value: 'header'},
          {title: 'footer', value: 'footer'},
          {title: 'main', value: 'main'},
        ],
      },
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Constrained', value: 'constrained'},
          {title: 'Flex', value: 'flex'},
          {title: 'Grid', value: 'grid'},
        ],
        layout: 'radio',
      },
    }),
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
          {title: 'Wide', value: 'wide'},
          {title: 'Full', value: 'full'},
        ],
      },
    }),
    defineField({
      name: 'contents',
      title: 'Contents',
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
