import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from '../objects/pageBuilderBlockTypes'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'general',
      description: 'Editable on default language only. Translations inherit the same slug.',
      readOnly: ({document}) => {
        const language = (document as {language?: string} | undefined)?.language || 'en'
        return language !== 'en'
      },
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const document = context.document as {_id?: string; language?: string}
          const client = context.getClient({apiVersion: '2025-09-25'})
          const id = document?._id?.replace(/^drafts\./, '')
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug,
            language: document?.language || 'en',
          }

          const query = `
            !defined(*[
              !(_id in [$draft, $published]) &&
              _type == "post" &&
              slug.current == $slug &&
              coalesce(language, "en") == $language
            ][0]._id)
          `

          return client.fetch(query, params)
        },
      },
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'en',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'general',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'general',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerAppearance',
      title: 'Header',
      type: 'pageHeaderAppearance',
      group: 'general',
      initialValue: {
        variant: 'positive',
      },
    }),
    defineField({
      name: 'footerAppearance',
      title: 'Footer',
      type: 'pageFooterAppearance',
      group: 'general',
      initialValue: {
        variant: 'positive',
      },
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      group: 'content',
      description:
        'Posts are assembled from rows. Add content inside columns and nest another row only when the layout requires it.',
      of: pageBuilderRowBlockTypes,
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          validation: (Rule) => Rule.max(70).warning('Keep meta title under 70 characters.'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning('Keep meta description under 160 characters.'),
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
        }),
        defineField({
          name: 'noIndex',
          title: 'No index',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'ogTitle',
          title: 'OpenGraph title',
          type: 'string',
        }),
        defineField({
          name: 'ogDescription',
          title: 'OpenGraph description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'OpenGraph image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured data (application/ld+json)',
      description: 'Paste JSON only (without <script> tags).',
      type: 'text',
      rows: 8,
      group: 'seo',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          try {
            JSON.parse(value)
            return true
          } catch {
            return 'Structured data must be valid JSON.'
          }
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      language: 'language',
      media: 'image',
    },
    prepare({title, publishedAt, language, media}) {
      const languageLabel = (language || 'en').toUpperCase()
      const publishedLabel = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US') : 'No date'
      return {
        title: title || 'Untitled post',
        subtitle: `[${languageLabel}] ${publishedLabel}`,
        media,
      }
    },
  },
})
