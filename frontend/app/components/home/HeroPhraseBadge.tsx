'use client'

import {useEffect, useState} from 'react'

import {cn} from '@/app/lib/cn'

type HeroPhraseBadgeProps = {
  text: string
  delayMs?: number
  className?: string
  'data-sanity'?: string
}

export default function HeroPhraseBadge({
  text,
  delayMs = 0,
  className,
  'data-sanity': dataSanity,
}: HeroPhraseBadgeProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true)
    }, delayMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [delayMs])

  return (
    <div
      data-sanity={dataSanity}
      className={cn(
        'inline-flex items-center rounded-full border border-white/35 bg-white/8 px-4 py-3 text-xs font-medium uppercase tracking-widest text-white shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-700 ease-out sm:px-5 sm:text-sm',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
        className,
      )}
    >
      {text}
    </div>
  )
}
