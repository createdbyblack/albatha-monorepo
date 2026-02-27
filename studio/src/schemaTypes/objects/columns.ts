import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbColumns',
  title: 'Content Columns',
  type: 'object',
  fields: [defineField({ name: 'columns', title: 'Columns', type: 'array', of: [{ type: 'cbColumn' }] })]
});
