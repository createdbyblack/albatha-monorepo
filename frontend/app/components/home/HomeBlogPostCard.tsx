import Link from 'next/link'

import SanityImage from '@/app/components/SanityImage'
import SectionArrowIconButton from '@/app/components/home/SectionArrowIconButton'
import {cn} from '@/app/lib/cn'

type HomeBlogPostCardProps = {
  variant?: 'featured' | 'compact'
  title: string
  publishedLabel: string
  excerpt?: string | null
  href?: string | null
  target?: '_self' | '_blank'
  rel?: string
  imageAssetId?: string | null
  imageAlt?: string | null
  className?: string
  'data-sanity'?: string
}

function FeaturedBlogPostCard({
  title,
  publishedLabel,
  excerpt,
  imageAssetId,
  imageAlt,
  hasLink,
}: {
  title: string
  publishedLabel: string
  excerpt?: string | null
  imageAssetId?: string | null
  imageAlt?: string | null
  hasLink: boolean
}) {
  return (
    <article className="relative overflow-visible rounded-[1.875rem] bg-white p-3 shadow-xl shadow-black/10 sm:p-4 lg:p-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-albatha-blue/10">
          {imageAssetId ? (
            <SanityImage
              id={imageAssetId}
              alt={imageAlt || title}
              width={1216}
              height={1066}
              className="h-full min-h-[18rem] w-full object-cover sm:min-h-[22rem] lg:min-h-[31.5rem]"
            />
          ) : (
            <div
              className="min-h-[18rem] bg-gradient-to-br from-albatha-blue/25 via-albatha-blue/10 to-white sm:min-h-[22rem] lg:min-h-[31.5rem]"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex flex-col justify-center gap-5 px-2 pb-10 pt-1 sm:px-4 lg:px-2 lg:pb-12">
          <p className="text-lg leading-snug text-albatha-midnight/50 sm:text-xl lg:text-[1.625rem]">
            {publishedLabel}
          </p>
          <div className="space-y-4">
            <h3 className="max-w-[18ch] text-3xl leading-[1.2] tracking-tight text-albatha-midnight sm:text-4xl lg:text-[2.5rem]">
              {title}
            </h3>
            {excerpt ? (
              <p className="max-w-2xl text-base leading-relaxed text-albatha-midnight/90 sm:text-lg lg:text-[1.625rem] lg:leading-[1.35]">
                {excerpt}
              </p>
            ) : null}
          </div>
          <span className="text-sm font-medium uppercase tracking-[0.16em] text-albatha-blue">
            Read More
          </span>
        </div>
      </div>

      <SectionArrowIconButton
        decorative={!hasLink}
        className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 shadow-lg shadow-black/15 transition-transform duration-300 ease-out group-hover:translate-x-[0.55rem]"
      />
    </article>
  )
}

function CompactBlogPostCard({
  title,
  publishedLabel,
  hasLink,
}: {
  title: string
  publishedLabel: string
  hasLink: boolean
}) {
  return (
    <article className="relative h-full min-h-[18rem] overflow-visible rounded-[1.875rem] bg-white p-6 shadow-xl shadow-black/10 sm:p-8">
      <div className="flex h-full flex-col justify-between gap-8 pb-10">
        <div className="space-y-5">
          <p className="text-lg leading-snug text-albatha-midnight/50 sm:text-xl lg:text-[1.625rem]">
            {publishedLabel}
          </p>
          <h3 className="text-[1.875rem] leading-[1.3] text-albatha-midnight">{title}</h3>
        </div>

        <span className="text-sm font-medium uppercase tracking-[0.16em] text-albatha-blue underline decoration-current underline-offset-4">
          Read More
        </span>
      </div>

      <SectionArrowIconButton
        decorative={!hasLink}
        className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 shadow-lg shadow-black/15 transition-transform duration-300 ease-out group-hover:translate-x-[0.55rem]"
      />
    </article>
  )
}

export default function HomeBlogPostCard({
  variant = 'compact',
  title,
  publishedLabel,
  excerpt,
  href,
  target,
  rel,
  imageAssetId,
  imageAlt,
  className,
  'data-sanity': dataSanity,
}: HomeBlogPostCardProps) {
  const hasLink = Boolean(href)
  const sharedClassName = cn(
    'group block',
    hasLink &&
      'transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-albatha-midnight',
    className,
  )
  const ariaLabel = `Read more: ${title}`
  const content =
    variant === 'featured' ? (
      <FeaturedBlogPostCard
        title={title}
        publishedLabel={publishedLabel}
        excerpt={excerpt}
        imageAssetId={imageAssetId}
        imageAlt={imageAlt}
        hasLink={hasLink}
      />
    ) : (
      <CompactBlogPostCard title={title} publishedLabel={publishedLabel} hasLink={hasLink} />
    )

  if (!href) {
    return (
      <div data-sanity={dataSanity} className={sharedClassName}>
        {content}
      </div>
    )
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        data-sanity={dataSanity}
        className={sharedClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      data-sanity={dataSanity}
      className={sharedClassName}
    >
      {content}
    </Link>
  )
}
