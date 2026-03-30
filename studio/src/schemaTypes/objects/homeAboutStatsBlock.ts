import {defineField, defineType} from 'sanity'

export const homeAboutStatsBlock = defineType({
  name: 'homeAboutStatsBlock',
  title: 'Home About Stats Block',
  type: 'object',
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{type: 'homeAboutStat'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      stats: 'stats',
    },
    prepare({stats}) {
      return {
        title: 'Home About Stats Block',
        subtitle: `${Array.isArray(stats) ? stats.length : 0} stats`,
      }
    },
  },
})
