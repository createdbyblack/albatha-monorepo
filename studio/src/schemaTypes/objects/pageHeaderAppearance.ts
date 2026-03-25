import {defineField, defineType} from 'sanity'

export const pageHeaderAppearance = defineType({
  name: 'pageHeaderAppearance',
  title: 'Page Header Appearance',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      description: 'Controls the header logo and color treatment used for this page.',
      type: 'string',
      initialValue: 'positive',
      options: {
        list: [
          {title: 'Positive', value: 'positive'},
          {title: 'Negative', value: 'negative'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
    },
    prepare({variant}) {
      return {
        title: 'Header Appearance',
        subtitle: variant === 'negative' ? 'Negative' : 'Positive',
      }
    },
  },
})
