import Link from 'next/link'

import {cn} from '@/app/lib/cn'

type SectionArrowIconButtonProps = {
  href?: string
  className?: string
  target?: '_self' | '_blank'
  rel?: string
  decorative?: boolean
  'aria-label'?: string
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

export default function SectionArrowIconButton({
  href,
  className,
  target,
  rel,
  decorative = false,
  'aria-label': ariaLabel,
  'data-sanity': dataSanity,
}: SectionArrowIconButtonProps) {
  const sharedClassName = cn(
    'inline-flex size-14 items-center justify-center rounded-[1.125rem] bg-albatha-orange text-white transition-transform duration-200 ease-out sm:size-16',
    className,
  )

  if (decorative || !href) {
    return (
      <span aria-hidden="true" data-sanity={dataSanity} className={sharedClassName}>
        <ArrowIcon />
      </span>
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
        <ArrowIcon />
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
      <ArrowIcon />
    </Link>
  )
}
