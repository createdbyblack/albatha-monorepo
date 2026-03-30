import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from './pageBuilderBlockTypes'

export const homeBlogPostsSection = defineType({
  name: 'homeBlogPostsSection',
  title: 'Home Blog Posts Section',
  type: 'object',
  fields: [
    defineField({
      name: 'contents',
      title: 'Contents',
      description:
        'Optional intro rows before the curated post cards. Keep any dynamic body content inside this field.',
      type: 'array',
      of: pageBuilderRowBlockTypes,
    }),
    defineField({
      name: 'posts',
      title: 'Posts',
      description: 'The first post is treated as the featured story on the homepage.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: 'floatingActionLabel',
      title: 'Floating Action Label',
      type: 'string',
      initialValue: 'Back to Top',
    }),
    defineField({
      name: 'floatingActionLink',
      title: 'Floating Action Link',
      type: 'cbLink',
    }),
  ],
  preview: {
    select: {
      postCount: 'posts',
    },
    prepare({postCount}) {
      return {
        title: 'Home Blog Posts Section',
        subtitle: `${Array.isArray(postCount) ? postCount.length : 0} curated posts`,
      }
    },
  },
})
