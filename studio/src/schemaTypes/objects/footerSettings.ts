import {defineArrayMember, defineField, defineType} from 'sanity'

function defineFooterLogoField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    description,
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        validation: (rule) =>
          rule.custom((alt, context) => {
            const image = context.parent as {asset?: {_ref?: string}} | undefined
            if (image?.asset?._ref && !alt) {
              return 'Alternative text is required when a logo image is set.'
            }
            return true
          }),
      }),
    ],
  })
}

export const footerSettingsFields = [
  defineFooterLogoField(
    'positiveLogo',
    'Positive logo',
    'Logo used on pages configured with the positive footer variant.',
  ),
  defineFooterLogoField(
    'negativeLogo',
    'Negative logo',
    'Logo used on pages configured with the negative footer variant.',
  ),
  defineField({
    name: 'navigationGroups',
    title: 'Navigation groups',
    description: 'Footer navigation groups with one or more columns of links.',
    type: 'array',
    of: [defineArrayMember({type: 'menuMegaMenuGroup'})],
    validation: (rule) => rule.min(1).warning('Add at least one navigation group to match the footer design.'),
  }),
  defineField({
    name: 'heading',
    title: 'Legacy heading',
    description: 'Legacy field kept for the current shared footer implementation until navigationGroups is adopted.',
    type: 'string',
    initialValue: 'Brand logo',
  }),
  // defineField({
  //   name: 'menu',
  //   title: 'Legacy footer menu',
  //   description: 'Legacy flat footer links kept until the shared footer implementation is migrated.',
  //   type: 'menuGroup',
  //   initialValue: {
  //     menuId: 'footer',
  //     title: 'Footer',
  //   },
  //   validation: (rule) =>
  //     rule.required().custom((value) => {
  //       const menu = value as {menuId?: string} | undefined
  //       if (!menu) return true
  //       if (menu.menuId !== 'footer') {
  //         return 'Footer menu must use menuId "footer".'
  //       }
  //       return true
  //     }),
  // }),
  defineField({
    name: 'legalMenu',
    title: 'Legal menu',
    description: 'Optional legal links (privacy, terms, etc).',
    type: 'menuGroup',
    initialValue: {
      menuId: 'legal',
      title: 'Legal',
    },
    validation: (rule) =>
      rule.custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'legal') {
          return 'Legal menu must use menuId "legal".'
        }
        return true
      }),
  }),
  defineField({
    name: 'showDefaultLegalLinks',
    title: 'Show default legal links',
    description: 'Fallback to /privacy-policy and /terms-and-conditions when Legal menu is empty.',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'copyrightText',
    title: 'Copyright text',
    type: 'string',
    initialValue: '\u00A9 2026 Albatha Holding. Created by ',
  }),
  defineField({
    name: 'creditLabel',
    title: 'Credit label',
    description: 'Optional linked credit shown after the copyright text.',
    type: 'string',
    initialValue: 'Black.',
  }),
  defineField({
    name: 'creditLink',
    title: 'Credit link',
    type: 'cbLink',
    initialValue: {
      linkType: 'external',
      externalUrl: 'https://createdbyblack.com',
      openInNewTab: true,
    },
  }),
]

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer Settings',
  type: 'object',
  fields: footerSettingsFields,
  preview: {
    prepare() {
      return {
        title: 'Footer Settings',
      }
    },
  },
})
