import Script from 'next/script'

import type {LayoutSettings} from '@/sanity/lib/settings-types'
import {normalizeInlineScript} from '@/sanity/lib/utils'

const SETTINGS_SCRIPTS = [
  {id: 'settings-gtm-script', key: 'gtmScript'},
  {id: 'settings-ga-script', key: 'gaScript'},
  {id: 'settings-cookie-policy-script', key: 'cookiePolicyScript'},
] as const satisfies ReadonlyArray<{
  id: string
  key: 'gtmScript' | 'gaScript' | 'cookiePolicyScript'
}>

export default function SettingsScripts({settings}: {settings: LayoutSettings | null}) {
  return (
    <>
      {SETTINGS_SCRIPTS.map(({id, key}) => {
        const script = normalizeInlineScript(settings?.[key])

        if (!script) {
          return null
        }

        return (
          <Script key={id} id={id} strategy="afterInteractive">
            {script}
          </Script>
        )
      })}
    </>
  )
}
