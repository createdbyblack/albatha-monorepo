import {defineField, defineType} from 'sanity'

export const pageFooterAppearance = defineType({
  name: 'pageFooterAppearance',
  title: 'Page Footer Appearance',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      description: 'Controls the footer logo and color treatment used for this page.',
      type: 'string',
      initialValue: 'positive',
      options: {
        list: [
          {title: 'Positive', value: 'positive'},
          {title: 'Negative', value: 'negative'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
    },
    prepare({variant}) {
      return {
        title: 'Footer Appearance',
        subtitle: variant === 'negative' ? 'Negative' : 'Positive',
      }
    },
  },
})
