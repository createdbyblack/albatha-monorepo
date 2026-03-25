import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuMegaMenu = defineType({
  name: 'menuMegaMenu',
  title: 'Mega Menu',
  type: 'object',
  fields: [
    defineField({
      name: 'groups',
      title: 'Groups',
      description: 'Grouped columns displayed in the open mega menu panel.',
      type: 'array',
      of: [defineArrayMember({type: 'menuMegaMenuGroup'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      groups: 'groups',
    },
    prepare({groups}) {
      const count = Array.isArray(groups) ? groups.length : 0
      return {
        title: 'Mega Menu',
        subtitle: `${count} group${count === 1 ? '' : 's'}`,
      }
    },
  },
})
