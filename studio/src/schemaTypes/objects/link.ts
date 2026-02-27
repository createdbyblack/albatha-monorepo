import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbLink',
  title: 'Content Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'external',
      options: {
        list: [
          {title: 'External', value: 'external'},
          {title: 'Internal', value: 'internal'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'external' && !value) {
            return 'External URL is required when Link Type is External'
          }
          return true
        }),
    }),
    defineField({
      name: 'internalTargetType',
      title: 'Internal Target',
      type: 'string',
      initialValue: 'page',
      options: {
        list: [
          {title: 'Select Page', value: 'page'},
          {title: 'Custom Path', value: 'path'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'internalPage',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: ({parent}) =>
        parent?.linkType !== 'internal' || (parent?.internalTargetType && parent?.internalTargetType !== 'page'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string; internalTargetType?: string} | undefined
          if (
            parent?.linkType === 'internal' &&
            (parent?.internalTargetType === 'page' || parent?.internalTargetType == null) &&
            !value
          ) {
            return 'Page is required when Internal Target is Select Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal Path',
      description: 'Examples: /about, /contact, /posts/my-post',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'internal' || parent?.internalTargetType !== 'path',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string; internalTargetType?: string} | undefined
          if (parent?.linkType === 'internal' && parent?.internalTargetType === 'path' && !value) {
            return 'Internal Path is required when Link Type is Internal'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
})
