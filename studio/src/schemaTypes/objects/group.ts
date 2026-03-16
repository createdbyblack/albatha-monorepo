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
      name: 'children',
      title: 'Content',
      type: 'array',
      of: pageBuilderComposableBlockTypes,
      validation: (Rule) => Rule.required(),
    }),
  ],
})
