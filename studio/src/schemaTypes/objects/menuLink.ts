import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuLink = defineType({
  name: 'menuLink',
  title: 'Menu Link',
  type: 'object',
  validation: (Rule) =>
    Rule.custom((value) => {
      const link = value as {subLinks?: unknown[]; megaMenu?: {groups?: unknown[]}} | undefined
      if (link?.subLinks?.length && link?.megaMenu?.groups?.length) {
        return 'Use either sub links or a mega menu for a menu link, not both.'
      }
      return true
    }),
  fields: [
    defineField({
      name: 'itemId',
      title: 'Unique ID',
      description: 'Unique key for frontend mapping (e.g. nav-services).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cbLink',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subLinks',
      title: 'Sub links',
      description: 'Use for simple dropdowns. Leave empty when this item uses a mega menu.',
      type: 'array',
      of: [defineArrayMember({type: 'menuSubLink'})],
    }),
    defineField({
      name: 'megaMenu',
      title: 'Mega menu',
      description: 'Use for grouped, multi-column dropdown panels.',
      type: 'menuMegaMenu',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'itemId',
    },
  },
})
