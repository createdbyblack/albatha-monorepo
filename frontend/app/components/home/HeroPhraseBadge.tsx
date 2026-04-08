'use client'

import {useEffect, useState} from 'react'

import {cn} from '@/app/lib/cn'

type HeroPhraseBadgeProps = {
  'text': string
  'delayMs'?: number
  'className'?: string
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
        'relative inline-flex min-h-[2.8125rem] items-center justify-center px-4 py-[0.9375rem] text-xl font-medium uppercase tracking-wide text-white transition-all duration-700 ease-out ',
        'before:absolute before:inset-0 before:-skew-x-12 before:rounded-[0.85rem] before:border before:border-white/70 before:bg-white/[0.04] before:content-[\"\"] before:backdrop-blur-[2px]',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
        className,
      )}
    >
      <span className="relative z-10 leading-[1.1]">{text}</span>
    </div>
  )
}
