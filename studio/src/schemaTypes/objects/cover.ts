import {defineField, defineType} from 'sanity'
import {pageBuilderComposableBlockTypes} from './pageBuilderBlockTypes'

export default defineType({
  name: 'cbCover',
  title: 'Cover',
  type: 'object',
  fields: [
    defineField({name: 'backgroundMedia', title: 'Background Media', type: 'cbMedia'}),
    defineField({name: 'url', title: 'URL', type: 'string', initialValue: ''}),
    defineField({
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'alt', title: 'Alt', type: 'string', initialValue: ''}),
    defineField({
      name: 'dimRatio',
      title: 'Dim Ratio',
      type: 'number',
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({name: 'overlayColor', title: 'Overlay Color', type: 'string', initialValue: '#000000'}),
    defineField({
      name: 'contentPosition',
      title: 'Content Position',
      type: 'string',
      initialValue: 'center-center',
      options: {
        list: [
          {title: 'Top Left', value: 'top-left'},
          {title: 'Top Center', value: 'top-center'},
          {title: 'Top Right', value: 'top-right'},
          {title: 'Center Left', value: 'center-left'},
          {title: 'Center Center', value: 'center-center'},
          {title: 'Center Right', value: 'center-right'},
          {title: 'Bottom Left', value: 'bottom-left'},
          {title: 'Bottom Center', value: 'bottom-center'},
          {title: 'Bottom Right', value: 'bottom-right'},
        ],
      },
    }),
    defineField({
      name: 'minHeight',
      title: 'Min Height',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Full', value: 'full'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'hasParallax', title: 'Parallax', type: 'boolean', initialValue: false}),
    defineField({
      name: 'content',
      title: 'Content',
      description: 'Use blocks here for the foreground content. Nested rows stay available when the design needs them.',
      type: 'array',
      of: pageBuilderComposableBlockTypes,
      validation: (Rule) => Rule.required(),
    }),
  ],
})
