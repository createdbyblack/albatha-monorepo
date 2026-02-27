import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbHtml',
  title: 'Content HTML',
  type: 'object',
  fields: [defineField({ name: 'content', title: 'HTML Content', type: 'text' })]
});
