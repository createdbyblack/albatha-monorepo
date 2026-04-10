'use client'

import {stegaClean} from '@sanity/client/stega'

import FloatingSectionAction from '@/app/components/home/FloatingSectionAction'
import HomeBlogPostCard from '@/app/components/home/HomeBlogPostCard'
import {HomeSectionRenderContext} from '@/app/components/home/homeSectionRendering'
import {
  formatPostDate,
  type HomeSectionRendererProps,
  resolveImageAssetId,
  resolveLinkHref,
  resolvePostExcerpt,
  resolvePostHref,
} from '@/app/components/home/homeSectionUtils'
import type {PageBuilderBlock} from '@/sanity/lib/types'
import {getSanityDataAttribute, toArrayItemPath} from '@/sanity/lib/visual-editing'

type HomeBlogPostsSectionProps = HomeSectionRendererProps<
  Extract<PageBuilderBlock, {_type: 'homeBlogPostsSection'}>
>

export default function HomeBlogPostsSection({
  block,
  pageId,
  pageType,
  blockPath,
  isDraftMode,
  renderBlocks,
}: HomeBlogPostsSectionProps) {
  const sectionId = 'blog-posts'
  const contentPath = `${blockPath}.contents`
  const postsPath = `${blockPath}.posts`
  const floatingActionHref = resolveLinkHref(block.floatingActionLink) || '/#top'
  const posts = block.posts || []
  const featuredPost = posts[0]
  const supportingPosts = posts.slice(1, 4)

  return (
    <section
      id={sectionId}
      className="relative isolate bg-albatha-midnight pb-20 pt-10 text-white sm:pb-24 sm:pt-12 lg:pb-[7.5rem] lg:pt-10"
      data-sanity={getSanityDataAttribute(isDraftMode, {id: pageId, type: pageType}, blockPath)}
    >
      <HomeSectionRenderContext.Provider value="blog-posts">
        <div className="mx-auto w-full max-w-wide ">
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {block.contents?.length ? (
              <div
                className="space-y-6 lg:space-y-8"
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  contentPath,
                )}
              >
                {renderBlocks(block.contents, contentPath)}
              </div>
            ) : null}

            {featuredPost ? (
              <div
                className="space-y-7 sm:space-y-8"
                data-sanity={getSanityDataAttribute(
                  isDraftMode,
                  {id: pageId, type: pageType},
                  postsPath,
                )}
              >
                <HomeBlogPostCard
                  variant="featured"
                  title={stegaClean(featuredPost.title) || featuredPost.title || 'Featured post'}
                  publishedLabel={formatPostDate(featuredPost.publishedAt)}
                  excerpt={resolvePostExcerpt(featuredPost)}
                  href={resolvePostHref(featuredPost)}
                  imageAssetId={resolveImageAssetId(featuredPost.image?.asset)}
                  imageAlt={featuredPost.image?.alt || featuredPost.title || 'Featured post'}
                  data-sanity={getSanityDataAttribute(
                    isDraftMode,
                    {id: pageId, type: pageType},
                    toArrayItemPath(postsPath, featuredPost._key, 0),
                  )}
                />

                {supportingPosts.length ? (
                  <div className="grid gap-6 lg:grid-cols-3">
                    {supportingPosts.map((post, postIndex) => (
                      <HomeBlogPostCard
                        key={post._key || post._id || `blog-post-${postIndex + 1}`}
                        title={stegaClean(post.title) || post.title || 'Post'}
                        publishedLabel={formatPostDate(post.publishedAt)}
                        href={resolvePostHref(post)}
                        data-sanity={getSanityDataAttribute(
                          isDraftMode,
                          {id: pageId, type: pageType},
                          toArrayItemPath(postsPath, post._key, postIndex + 1),
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </HomeSectionRenderContext.Provider>

      <FloatingSectionAction
        label={block.floatingActionLabel || 'Back to Top'}
        href={floatingActionHref}
        direction="up"
        sectionId={sectionId}
        data-sanity={getSanityDataAttribute(
          isDraftMode,
          {id: pageId, type: pageType},
          block.floatingActionLink
            ? `${blockPath}.floatingActionLink`
            : `${blockPath}.floatingActionLabel`,
        )}
      />
    </section>
  )
}
