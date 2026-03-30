'use client'

import {useEffect, useState} from 'react'

import {cn} from '@/app/lib/cn'

type FloatingSectionActionProps = {
  label: string
  sectionId: string
  href?: string | null
  direction?: 'down' | 'up'
  className?: string
  'data-sanity'?: string
}

function ActionIcon({direction}: {direction: 'down' | 'up'}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn(
        'h-4 w-4 shrink-0 stroke-current stroke-[1.5]',
        direction === 'up' && 'rotate-180',
      )}
    >
      <path d="M4 5.5 8 9.5l4-4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 1.5 8 5.5l4-4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function scrollToHash(hash: string) {
  const targetId = hash.replace(/^#/, '')
  const target = document.getElementById(targetId)

  if (target) {
    target.scrollIntoView({behavior: 'smooth', block: 'start'})
  }
}

export default function FloatingSectionAction({
  label,
  sectionId,
  href,
  direction = 'down',
  className,
  'data-sanity': dataSanity,
}: FloatingSectionActionProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const section = document.getElementById(sectionId)

    if (!section || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {threshold: 0.35},
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [sectionId])

  return (
    <button
      type="button"
      data-sanity={dataSanity}
      className={cn(
        'fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 md:bottom-8 md:right-8',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        className,
      )}
      onClick={() => {
        if (!href) {
          return
        }

        if (href.startsWith('#')) {
          scrollToHash(href)
          return
        }

        try {
          const target = new URL(href, window.location.href)
          const current = new URL(window.location.href)

          if (target.pathname === current.pathname && target.hash) {
            scrollToHash(target.hash)
            return
          }

          window.location.assign(target.toString())
        } catch {
          window.location.assign(href)
        }
      }}
    >
      <span>{label}</span>
      <ActionIcon direction={direction} />
    </button>
  )
}
