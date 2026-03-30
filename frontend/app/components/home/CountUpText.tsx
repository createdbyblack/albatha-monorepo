'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

type CountUpTextProps = {
  value: string
  className?: string
}

function parseCountUpValue(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^([\d,]+)(\+?)$/)

  if (!match) {
    return null
  }

  const numericValue = Number.parseInt(match[1].replaceAll(',', ''), 10)

  if (Number.isNaN(numericValue)) {
    return null
  }

  return {
    numericValue,
    suffix: match[2] || '',
  }
}

export default function CountUpText({value, className}: CountUpTextProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState<string | null>(null)
  const parsedValue = useMemo(() => parseCountUpValue(value), [value])

  useEffect(() => {
    const element = containerRef.current

    if (!element || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {threshold: 0.4},
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!parsedValue || !isVisible) {
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => {
        setDisplayValue(
          `${new Intl.NumberFormat('en-US').format(parsedValue.numericValue)}${parsedValue.suffix}`,
        )
      })

      return () => {
        window.cancelAnimationFrame(frame)
      }
    }

    let frame = 0
    const durationMs = 1400
    const startTime = performance.now()

    const tick = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(parsedValue.numericValue * easedProgress)

      setDisplayValue(`${new Intl.NumberFormat('en-US').format(currentValue)}${parsedValue.suffix}`)

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [isVisible, parsedValue, value])

  return (
    <span ref={containerRef} className={className}>
      {parsedValue ? displayValue || value : value}
    </span>
  )
}
