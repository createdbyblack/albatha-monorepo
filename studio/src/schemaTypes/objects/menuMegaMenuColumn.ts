import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuMegaMenuColumn = defineType({
  name: 'menuMegaMenuColumn',
  title: 'Mega Menu Column',
  type: 'object',
  fields: [
    defineField({
      name: 'links',
      title: 'Links',
      description: 'Links shown in this column of the mega menu.',
      type: 'array',
      of: [defineArrayMember({type: 'menuSubLink'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      links: 'links',
    },
    prepare({links}) {
      const count = Array.isArray(links) ? links.length : 0
      return {
        title: 'Mega Menu Column',
        subtitle: `${count} link${count === 1 ? '' : 's'}`,
      }
    },
  },
})
