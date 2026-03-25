import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {pageBuilderRowBlockTypes} from '../objects/pageBuilderBlockTypes'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'general',
      initialValue: 'Home',
      validation: (Rule) => Rule.required(),
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
        'Home page content is row-based. Place blocks inside columns and recurse with another row only when needed.',
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
      language: 'language',
    },
    prepare({language}) {
      const languageLabel = (language || 'en').toUpperCase()
      return {
        title: 'Home Page',
        subtitle: `[${languageLabel}] /`,
      }
    },
  },
})
