import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbNavigation',
  title: 'Content Navigation',
  type: 'object',
  fields: [
    defineField({
      name: 'overlayMenu',
      title: 'Overlay Menu',
      type: 'string',
      initialValue: 'mobile',
      options: {
        list: [
          {title: 'Never', value: 'never'},
          {title: 'Mobile', value: 'mobile'},
          {title: 'Always', value: 'always'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'openSubmenusOnClick', title: 'Open Submenus On Click', type: 'boolean', initialValue: false}),
    defineField({name: 'showSubmenuIcon', title: 'Show Submenu Icon', type: 'boolean', initialValue: true}),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      initialValue: 'menu',
      options: {
        list: [
          {title: 'Menu', value: 'menu'},
          {title: 'Dots', value: 'dots'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'horizontal',
      options: {
        list: [
          {title: 'Horizontal', value: 'horizontal'},
          {title: 'Vertical', value: 'vertical'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'links', title: 'Links', type: 'array', of: [{type: 'cbNavigationLink'}]}),
  ],
})
