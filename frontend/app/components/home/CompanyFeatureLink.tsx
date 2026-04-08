import Link from 'next/link'

import {cn} from '@/app/lib/cn'

type CompanyFeatureLinkProps = {
  'name': string
  'category'?: string | null
  'href'?: string | null
  'target'?: '_self' | '_blank'
  'rel'?: string
  'className'?: string
  'data-sanity'?: string
}

function CompanyFeatureContent({name, category}: {name: string; category?: string | null}) {
  return (
    <div className="flex min-h-22 flex-col justify-between gap-2 border-b border-white/70 pb-4 pt-2">
      <p className="text-2xl leading-none tracking-tight text-white lg:text-[1.75rem]">{name}</p>
      <p className="text-sm leading-snug text-albatha-blue sm:text-base">{category || ''}</p>
    </div>
  )
}

export default function CompanyFeatureLink({
  name,
  category,
  href,
  target,
  rel,
  className,
  'data-sanity': dataSanity,
}: CompanyFeatureLinkProps) {
  const sharedClassName = cn(
    'group block h-full transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-albatha-midnight',
    className,
  )
  const content = <CompanyFeatureContent name={name} category={category} />
  const ariaLabel = category ? `${name}: ${category}` : name

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
