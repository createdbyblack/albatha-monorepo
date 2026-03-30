import Link from 'next/link'

import {cn} from '@/app/lib/cn'

type SectionArrowCtaProps = {
  href: string
  label: string
  className?: string
  target?: '_self' | '_blank'
  rel?: string
  'data-sanity'?: string
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 stroke-current stroke-[1.7]">
      <path d="M3.75 10h12.5" fill="none" strokeLinecap="round" />
      <path d="m10.5 3.75 6.25 6.25-6.25 6.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SectionArrowCta({
  href,
  label,
  className,
  target,
  rel,
  'data-sanity': dataSanity,
}: SectionArrowCtaProps) {
  const content = (
    <>
      <span className="inline-flex min-h-[4.8125rem] items-center justify-center rounded-[1.125rem] bg-albatha-midnight px-8 text-center text-base font-medium uppercase tracking-[0.18em] text-white transition-colors duration-200 group-hover:bg-albatha-ink">
        {label}
      </span>
      <span className="inline-flex min-h-[4.8125rem] w-[4.8125rem] items-center justify-center rounded-[1.125rem] bg-albatha-orange text-white transition-transform duration-200 group-hover:translate-x-1">
        <ArrowIcon />
      </span>
    </>
  )

  const sharedClassName = cn('group inline-flex items-stretch gap-1 focus-visible:outline-none', className)

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
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
      data-sanity={dataSanity}
      className={sharedClassName}
    >
      {content}
    </Link>
  )
}
