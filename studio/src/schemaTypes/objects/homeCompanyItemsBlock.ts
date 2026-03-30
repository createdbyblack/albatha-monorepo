import {defineField, defineType} from 'sanity'

export const homeCompanyItemsBlock = defineType({
  name: 'homeCompanyItemsBlock',
  title: 'Home Company Items Block',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'homeCompanyItem'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      return {
        title: 'Home Company Items Block',
        subtitle: `${Array.isArray(items) ? items.length : 0} companies`,
      }
    },
  },
})
