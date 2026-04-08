'use client'

import {useEffect, useState} from 'react'

import {cn} from '@/app/lib/cn'

type FloatingSectionActionProps = {
  'label': string
  'sectionId': string
  'href'?: string | null
  'direction'?: 'down' | 'up'
  'className'?: string
  'data-sanity'?: string
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = document.getElementById(sectionId)

    if (!section || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const timeout = setTimeout(() => setIsVisible(entry.isIntersecting), 4000)
        return () => clearTimeout(timeout)
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
        'fixed bottom-5 right-4 z-40 inline-flex items-center gap-4 rounded-lg border border-white/20 bg-white/20 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-600 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 md:bottom-8 md:right-40 animate-[bounce_3s_infinite]',
        isVisible ? 'translate-y-0 opacity-100 ' : 'pointer-events-none translate-y-4 opacity-0',
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
      <img
        alt="down"
        src={'/icons/double-chevron-down.svg'}
        className={cn('h-3.5 w-3.5 shrink-0', direction === 'up' && 'rotate-180')}
      />
    </button>
  )
}
