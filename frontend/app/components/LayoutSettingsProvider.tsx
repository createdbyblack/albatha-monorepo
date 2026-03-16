'use client'

import {createContext, useContext, type ReactNode} from 'react'

import type {LayoutSettings} from '@/sanity/lib/settings-types'

const LayoutSettingsContext = createContext<LayoutSettings | null>(null)

export function LayoutSettingsProvider({
  children,
  settings,
}: {
  children: ReactNode
  settings?: LayoutSettings | null
}) {
  return <LayoutSettingsContext.Provider value={settings || null}>{children}</LayoutSettingsContext.Provider>
}

export function useLayoutSettings() {
  return useContext(LayoutSettingsContext)
}
