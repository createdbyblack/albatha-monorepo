import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbButton',
  title: 'Content Button',
  type: 'object',
  fields: [
    defineField({name: 'text', title: 'Text', type: 'string', initialValue: ''}),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Simple href fallback. Use Structured Link for internal page resolution.',
      type: 'string',
      initialValue: '',
    }),
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
      name: 'size',
      title: 'Size',
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
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Ghost', value: 'ghost'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'label', title: 'Legacy Label', type: 'string', hidden: true}),
    defineField({
      name: 'actionType',
      title: 'Action Type',
      type: 'string',
      initialValue: 'button',
      validation: (Rule) => Rule.required(),
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
      title: 'Structured Link',
      type: 'cbLink',
      hidden: ({parent}) => parent?.actionType !== 'link',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {actionType?: string} | undefined
          if (parent?.actionType === 'link' && !value) {
            return 'Link is required when Action Type is Link'
          }
          return true
        }),
    }),
  ],
})
