import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbNavigation',
  title: 'Content Navigation',
  type: 'object',
  fields: [defineField({ name: 'links', title: 'Links', type: 'array', of: [{ type: 'cbNavigationLink' }] })]
});
