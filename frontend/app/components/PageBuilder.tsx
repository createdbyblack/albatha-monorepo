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

    // If there are sections in the updated document, trust Sanity's patch result directly.
    // Custom reconciliation can accidentally block cross-container drag-and-drop moves.
    if (action.document?.pageBuilder) {
      return action.document.pageBuilder as PageBuilderSection[]
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
    <RenderSections pageBuilderSections={pageBuilderSections} page={page} isDraftMode={isDraftMode} />
  ) : (
    <RenderEmptyState page={page} isDraftMode={isDraftMode} />
  )
}
