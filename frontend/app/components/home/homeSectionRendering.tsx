'use client'

import {createContext} from 'react'

import type {CbColumn, CbColumns, PageBuilderBlock} from '@/sanity/lib/types'

type NestedArrayFieldName = 'contents' | 'children' | 'content'

export type HomeSectionRenderContextValue =
  | 'hero'
  | 'about'
  | 'sectors'
  | 'companies'
  | 'blog-posts'
  | null

export type HomeColumnVariant =
  | 'hero-heading'
  | 'hero-copy'
  | 'about-image'
  | 'about-copy'
  | 'about-stats'
  | 'sectors-heading'
  | 'sectors-list'
  | 'sectors-featured'
  | 'companies-copy'
  | 'companies-grid'
  | 'blog-heading'
  | 'blog-copy'
  | null

export const HomeSectionRenderContext = createContext<HomeSectionRenderContextValue>(null)
export const HomeColumnVariantContext = createContext<HomeColumnVariant>(null)

function resolveNestedArray(
  block: {
    contents?: PageBuilderBlock[] | null
    children?: PageBuilderBlock[] | null
    content?: PageBuilderBlock[] | null
  },
  preferredField: NestedArrayFieldName,
): {items: PageBuilderBlock[]; fieldName: NestedArrayFieldName} {
  const arraysByField: Partial<
    Record<NestedArrayFieldName, PageBuilderBlock[] | null | undefined>
  > = {
    contents: block.contents,
    children: block.children,
    content: block.content,
  }

  const preferredItems = arraysByField[preferredField]
  if (preferredItems?.length) {
    return {items: preferredItems, fieldName: preferredField}
  }

  for (const fieldName of ['contents', 'children', 'content'] as const) {
    const items = arraysByField[fieldName]
    if (items?.length) {
      return {items, fieldName}
    }
  }

  return {items: preferredItems || [], fieldName: preferredField}
}

function resolveColumnItems(column: CbColumn) {
  return resolveNestedArray(column, 'contents').items
}

function columnIncludesBlockType(column: CbColumn, ...blockTypes: string[]) {
  const columnItems = resolveColumnItems(column)
  return columnItems.some((item) => blockTypes.includes(item._type))
}

function rowIncludesColumnBlockType(row: CbColumns, ...blockTypes: string[]) {
  return (row.columns || []).some((column) => columnIncludesBlockType(column, ...blockTypes))
}

export function resolveHomeSectionRowClassName(
  section: HomeSectionRenderContextValue,
  row: CbColumns,
) {
  switch (section) {
    case 'hero':
      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph')
        ? 'justify-between'
        : undefined
    case 'about':
      return rowIncludesColumnBlockType(row, 'homeAboutImageBlock')
        ? 'items-center gap-10 lg:gap-16'
        : undefined
    case 'sectors':
      if (rowIncludesColumnBlockType(row, 'homeSectorListBlock', 'homeSectorItem')) {
        return 'items-end gap-8 lg:gap-16 xl:gap-24'
      }

      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph')
        ? 'max-w-4xl gap-6'
        : undefined
    case 'companies':
      if (rowIncludesColumnBlockType(row, 'homeCompanyItemsBlock')) {
        return 'gap-6'
      }

      return rowIncludesColumnBlockType(row, 'cbParagraph')
        ? 'mx-auto max-w-6xl justify-center'
        : undefined
    case 'blog-posts':
      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph', 'cbButton')
        ? 'items-end gap-8 lg:gap-16'
        : undefined
    default:
      return undefined
  }
}

export function resolveHomeSectionColumnVariant(
  section: HomeSectionRenderContextValue,
  column: CbColumn,
): HomeColumnVariant {
  if (columnIncludesBlockType(column, 'cbHeading')) {
    if (section === 'hero') {
      return 'hero-heading'
    }

    if (section === 'sectors') {
      return 'sectors-heading'
    }
  }

  if (columnIncludesBlockType(column, 'homeAboutImageBlock')) {
    return 'about-image'
  }

  if (columnIncludesBlockType(column, 'homeAboutStatsBlock')) {
    return 'about-stats'
  }

  if (columnIncludesBlockType(column, 'homeSectorListBlock')) {
    return 'sectors-list'
  }

  if (columnIncludesBlockType(column, 'homeSectorItem')) {
    return 'sectors-featured'
  }

  if (columnIncludesBlockType(column, 'homeCompanyItemsBlock')) {
    return 'companies-grid'
  }

  if (columnIncludesBlockType(column, 'cbButton', 'cbParagraph')) {
    if (section === 'hero') {
      return 'hero-copy'
    }

    if (section === 'about') {
      return 'about-copy'
    }

    if (section === 'companies') {
      return 'companies-copy'
    }

    if (section === 'blog-posts') {
      return 'blog-copy'
    }
  }

  if (section === 'blog-posts' && columnIncludesBlockType(column, 'cbHeading')) {
    return 'blog-heading'
  }

  return null
}

export function resolveHomeSectionColumnClassName(columnVariant: HomeColumnVariant) {
  switch (columnVariant) {
    case 'hero-heading':
      return 'max-w-[54rem] [&_h1]:text-[4.75rem] [&_h1]:font-normal [&_h1]:leading-[0.92] [&_h1]:tracking-[-0.03em] sm:[&_h1]:text-[6rem] lg:[&_h1]:max-w-[8.2ch] lg:[&_h1]:text-[8.75rem]'
    case 'hero-copy':
      return 'max-w-xl lg:ml-auto lg:max-w-[32.3125rem] lg:pb-2 [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-[1.35] [&_p]:text-white sm:[&_p]:text-xl lg:[&_p]:text-[1.875rem] lg:[&_p]:leading-[1.3]'
    case 'about-image':
      return 'lg:-ml-24 xl:-ml-40'
    case 'about-copy':
      return 'max-w-3xl space-y-6 [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-snug [&_h2]:text-albatha-midnight sm:[&_h2]:text-5xl [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-snug [&_p]:text-albatha-midnight/90 sm:[&_p]:text-xl lg:[&_p]:text-2xl'
    case 'sectors-heading':
      return 'space-y-4 [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-albatha-midnight sm:[&_h2]:text-5xl lg:[&_h2]:text-[2.5rem]'
    case 'sectors-list':
      return 'order-2 lg:order-1'
    case 'sectors-featured':
      return 'order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none'
    case 'companies-copy':
      return 'space-y-4 [&_p]:mt-0 [&_p]:text-center [&_p]:text-xl [&_p]:leading-snug [&_p]:text-white sm:[&_p]:text-2xl lg:[&_p]:text-[2.1875rem] lg:[&_p]:leading-[1.2857142857]'
    case 'blog-heading':
      return 'max-w-3xl [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-white sm:[&_h2]:text-5xl lg:[&_h2]:text-[2.5rem]'
    case 'blog-copy':
      return 'max-w-2xl lg:ml-auto [&_p]:mt-0 [&_p]:text-lg [&_p]:leading-snug [&_p]:text-white/80 sm:[&_p]:text-xl lg:[&_p]:text-[1.625rem]'
    default:
      return undefined
  }
}

export function resolveHomeSectionRowVerticalAlignment(
  section: HomeSectionRenderContextValue,
  row: CbColumns,
) {
  if (row.verticalAlignment) {
    return row.verticalAlignment
  }

  switch (section) {
    case 'hero':
      return 'bottom'
    case 'about':
      return rowIncludesColumnBlockType(row, 'homeAboutImageBlock') ? 'center' : 'top'
    case 'sectors':
      return rowIncludesColumnBlockType(row, 'homeSectorListBlock', 'homeSectorItem')
        ? 'bottom'
        : 'top'
    case 'companies':
      return rowIncludesColumnBlockType(row, 'homeCompanyItemsBlock') ? 'bottom' : 'center'
    case 'blog-posts':
      return rowIncludesColumnBlockType(row, 'cbHeading', 'cbParagraph', 'cbButton')
        ? 'bottom'
        : 'top'
    default:
      return 'top'
  }
}

export function resolveHomeSectionColumnVerticalAlignment(
  section: HomeSectionRenderContextValue,
  columnVariant: HomeColumnVariant,
  column: CbColumn,
) {
  if (column.verticalAlignment) {
    return column.verticalAlignment
  }

  switch (section) {
    case 'hero':
      return 'bottom'
    case 'about':
      return columnVariant === 'about-image' || columnVariant === 'about-copy'
        ? 'center'
        : 'top'
    case 'sectors':
      return columnVariant === 'sectors-list' || columnVariant === 'sectors-featured'
        ? 'bottom'
        : 'top'
    case 'companies':
      return columnVariant === 'companies-copy' ? 'center' : 'bottom'
    case 'blog-posts':
      return columnVariant === 'blog-copy' ? 'bottom' : 'top'
    default:
      return 'top'
  }
}
