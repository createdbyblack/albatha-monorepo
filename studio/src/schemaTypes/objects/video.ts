import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({name: 'src', title: 'Source', type: 'string', initialValue: ''}),
    defineField({name: 'poster', title: 'Poster', type: 'string', initialValue: ''}),
    defineField({name: 'caption', title: 'Caption', type: 'string', initialValue: ''}),
    defineField({name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false}),
    defineField({name: 'loop', title: 'Loop', type: 'boolean', initialValue: false}),
    defineField({name: 'muted', title: 'Muted', type: 'boolean', initialValue: false}),
    defineField({name: 'controls', title: 'Controls', type: 'boolean', initialValue: true}),
    defineField({name: 'playsInline', title: 'Plays Inline', type: 'boolean', initialValue: false}),
  ],
})
