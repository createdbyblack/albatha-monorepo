'use client'

import {SanityDocument} from 'next-sanity'
import {useDraftModeEnvironment, useOptimistic} from 'next-sanity/hooks'

import BlockRenderer from '@/app/components/BlockRenderer'
import type {OptimisticPageDocument} from '@/app/lib/page-types'
import {PageBuilderSection, PageDocumentForBuilder} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type PageBuilderPageProps = {
  page: PageDocumentForBuilder
}

type KeyedRecord = {
  _key?: string
  [key: string]: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isKeyedRecord(value: unknown): value is KeyedRecord {
  return isRecord(value)
}

function mergeProjectedFields<T>(currentValue: T, incomingValue: T): T {
  if (Array.isArray(currentValue) && Array.isArray(incomingValue)) {
    return incomingValue.map((incomingItem, index) => {
      if (isKeyedRecord(incomingItem) && incomingItem._key) {
        const currentMatch = currentValue.find((currentItem) => {
          return isKeyedRecord(currentItem) && currentItem._key === incomingItem._key
        })

        return currentMatch
          ? mergeProjectedFields(currentMatch, incomingItem)
          : incomingItem
      }

      return mergeProjectedFields(currentValue[index], incomingItem)
    }) as T
  }

  if (isRecord(currentValue) && isRecord(incomingValue)) {
    const merged: Record<string, unknown> = {...currentValue, ...incomingValue}

    for (const key of Object.keys(merged)) {
      const currentChild = currentValue[key]
      const incomingChild = incomingValue[key]

      if (incomingChild === undefined) {
        merged[key] = currentChild
        continue
      }

      if (currentChild !== undefined) {
        merged[key] = mergeProjectedFields(currentChild, incomingChild)
      }
    }

    return merged as T
  }

  return (incomingValue ?? currentValue) as T
}

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function RenderSections({
  pageBuilderSections,
  page,
  isDraftMode,
}: {
  pageBuilderSections: PageBuilderSection[]
  page: PageDocumentForBuilder
  isDraftMode: boolean
}) {
  if (!page) {
    return null
  }
  return (
    <div
      id="top"
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: page._id, type: page._type}, 'pageBuilder')
      }
    >
      {pageBuilderSections.map((block: PageBuilderSection, index: number) => (
        <BlockRenderer
          key={block._key || `page-builder-${index}`}
          index={index}
          block={block}
          pageId={page._id}
          pageType={page._type}
          blockPath={toArrayItemPath('pageBuilder', block._key, index)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function RenderEmptyState({page, isDraftMode}: {page: PageDocumentForBuilder; isDraftMode: boolean}) {
  if (!page) {
    return null
  }

  return (
    <div
      className="container mt-10"
      data-sanity={
        getSanityDataAttribute(isDraftMode, {id: page._id, type: page._type}, 'pageBuilder')
      }
    >
      <div className="prose">
        <h2 className="">This page has no content!</h2>
        <p className="">Open the page in Sanity Studio to add content.</p>
      </div>
    </div>
  )
}

export default function PageBuilder({page}: PageBuilderPageProps) {
  const pageBuilderSections = useOptimistic<
    PageBuilderSection[] | undefined,
    SanityDocument<OptimisticPageDocument>
  >(page?.pageBuilder || [], (currentSections, action) => {
    // The action contains updated document data from Sanity
    // when someone makes an edit in the Studio

    // If the edit was to a different document, ignore it
    if (action.id !== page?._id) {
      return currentSections
    }

    // Preserve projected fields such as resolved internal slugs while still honoring
    // the optimistic array order from Presentation drag-and-drop mutations.
    if (action.document?.pageBuilder) {
      return mergeProjectedFields(
        currentSections,
        action.document.pageBuilder as PageBuilderSection[],
      ) as PageBuilderSection[]
    }

    // Otherwise keep the current sections
    return currentSections
  })

  const draftModeEnvironment = useDraftModeEnvironment()
  const isDraftMode =
    draftModeEnvironment === 'live' ||
    draftModeEnvironment === 'presentation-iframe' ||
    draftModeEnvironment === 'presentation-window'

  return pageBuilderSections && pageBuilderSections.length > 0 ? (
    <>
      <RenderSections pageBuilderSections={pageBuilderSections} page={page} isDraftMode={isDraftMode} />
    </>
  ) : (
    <>
      <RenderEmptyState page={page} isDraftMode={isDraftMode} />
    </>
  )
}
