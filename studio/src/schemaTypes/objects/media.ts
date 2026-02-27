import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbMedia',
  title: 'Content Media',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string} | undefined
          if (parent?.mediaType === 'image' && !value) {
            return 'Image is required when Media Type is Image'
          }
          return true
        }),
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'videoFile',
      title: 'Video',
      type: 'file',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      options: {
        accept: 'video/*',
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string} | undefined
          if (parent?.mediaType === 'video' && !value) {
            return 'Video is required when Media Type is Video'
          }
          return true
        }),
    }),
  ],
})
