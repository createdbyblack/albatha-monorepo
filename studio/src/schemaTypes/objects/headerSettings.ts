import {defineField, defineType} from 'sanity'

function defineHeaderLogoField(name: string, title: string, description: string) {
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

export const headerSettingsFields = [
  defineHeaderLogoField(
    'positiveLogo',
    'Positive logo',
    'Logo used on pages configured with the positive header variant.',
  ),
  defineHeaderLogoField(
    'negativeLogo',
    'Negative logo',
    'Logo used on pages configured with the negative header variant.',
  ),
  defineField({
    name: 'primaryMenu',
    title: 'Primary menu',
    description: 'Main header menu.',
    type: 'menuGroup',
    initialValue: {
      menuId: 'primary',
      title: 'Primary',
    },
    validation: (rule) =>
      rule.required().custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'primary') {
          return 'Primary menu must use menuId "primary".'
        }
        return true
      }),
  }),
  defineField({
    name: 'secondaryMenu',
    title: 'Secondary menu',
    description: 'Secondary/utility header menu.',
    type: 'menuGroup',
    initialValue: {
      menuId: 'secondary',
      title: 'Secondary',
    },
    validation: (rule) =>
      rule.required().custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'secondary') {
          return 'Secondary menu must use menuId "secondary".'
        }
        return true
      }),
  }),
  defineField({
    name: 'ctaLabel',
    title: 'Header CTA label',
    type: 'string',
    initialValue: 'createdByBlack',
  }),
  defineField({
    name: 'ctaLink',
    title: 'Header CTA link',
    type: 'cbLink',
    initialValue: {
      linkType: 'external',
      externalUrl: 'https://createdbyblack.com',
      openInNewTab: true,
    },
  }),
]

export const headerSettings = defineType({
  name: 'headerSettings',
  title: 'Header Settings',
  type: 'object',
  fields: headerSettingsFields,
  preview: {
    prepare() {
      return {
        title: 'Header Settings',
      }
    },
  },
})
