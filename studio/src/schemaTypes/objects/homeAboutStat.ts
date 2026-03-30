import {defineField, defineType} from 'sanity'

export const homeAboutStat = defineType({
  name: 'homeAboutStat',
  title: 'Home About Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
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
      name: 'tone',
      title: 'Tone',
      type: 'string',
      initialValue: 'dark',
      options: {
        list: [
          {title: 'Dark', value: 'dark'},
          {title: 'Blue', value: 'blue'},
          {title: 'Outline Dark', value: 'outlineDark'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Short', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Tall', value: 'lg'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'value',
      subtitle: 'label',
    },
  },
})
