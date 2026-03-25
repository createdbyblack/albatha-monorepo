'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {useLayoutSettings} from '@/app/components/LayoutSettingsProvider'
import Image from '@/app/components/SanityImage'
import {cn} from '@/app/lib/cn'
import {getLocaleFromPath} from '@/app/lib/locale-path'
import {DEFAULT_LANGUAGE, type SupportedLanguage} from '@/sanity/lib/i18n'
import type {
  FooterNavigationGroup,
  LayoutSettings,
  MenuLink,
} from '@/sanity/lib/settings-types'
import type {FooterVariant} from '@/sanity/lib/types'
import {isExternalContentLink, localizeHref, resolveContentLinkHref} from '@/sanity/lib/utils'

type FooterImage = {
  asset?: {_ref?: string} | null
  alt?: string | null
}

type FooterConfig = NonNullable<LayoutSettings['footer']>

type FooterSettings = LayoutSettings & {
  footer?: FooterConfig | null
}

function resolveMenuItemKey(item: MenuLink, index: number, prefix = 'footer-link') {
  return item.itemId || item._key || `${item.label || prefix}-${index}`
}

function selectLogo(variant: FooterVariant, settings?: FooterSettings | null): FooterImage | null {
  const footer = settings?.footer
  const candidateLogos =
    variant === 'negative'
      ? [footer?.negativeLogo, footer?.positiveLogo, settings?.logo]
      : [footer?.positiveLogo, footer?.negativeLogo, settings?.logo]

  return candidateLogos.find((candidate) => candidate?.asset?._ref) || null
}

function getFooterTone(variant: FooterVariant) {
  return variant === 'negative'
    ? {
        root: 'bg-primary text-primary-foreground',
        mutedText: 'text-primary-foreground/60',
        divider: 'border-primary-foreground/40',
        link: 'text-primary-foreground transition-colors hover:text-primary-foreground/70',
        contactLink: 'text-[var(--color-albatha-orange)] transition-opacity hover:opacity-80',
        legalLink: 'text-primary-foreground/60 transition-colors hover:text-primary-foreground',
        creditText: 'text-primary-foreground/60',
        creditLink: 'text-accent transition-opacity hover:opacity-80',
        heading: 'text-accent',
        logoText: 'text-primary-foreground',
      }
    : {
        root: 'bg-background text-foreground',
        mutedText: 'text-foreground/60',
        divider: 'border-border',
        link: 'text-foreground transition-colors hover:text-accent',
        contactLink: 'text-[var(--color-albatha-orange)] transition-opacity hover:opacity-80',
        legalLink: 'text-foreground/60 transition-colors hover:text-foreground',
        creditText: 'text-foreground/60',
        creditLink: 'text-accent transition-opacity hover:opacity-80',
        heading: 'text-accent',
        logoText: 'text-foreground',
      }
}

function buildFallbackNavigationGroups(footer?: FooterConfig | null): FooterNavigationGroup[] {
  const groups =
    footer?.navigationGroups
      ?.map((group) => ({
        ...group,
        columns: group.columns?.filter((column) => column.links?.length) || [],
      }))
      .filter((group) => group.columns.length) || []

  if (groups.length) {
    return groups
  }

  if (!footer?.menu?.links?.length) {
    return []
  }

  return [
    {
      _key: 'legacy-footer-menu',
      title: footer.menu.title || footer.heading || 'Navigation',
      columns: [
        {
          _key: 'legacy-footer-menu-column',
          links: footer.menu.links,
        },
      ],
    },
  ]
}

function buildNavigationColumns(groups: FooterNavigationGroup[]) {
  return groups.flatMap((group) => {
    const columns = group.columns?.filter((column) => column.links?.length) || []

    if (!columns.length) {
      return []
    }

    return columns.map((column, index) => ({
      _key: column._key || `${group._key || group.title || 'footer-group'}-${index}`,
      title: index === 0 ? group.title || null : null,
      links: column.links || [],
    }))
  })
}

function FooterNavLink({
  item,
  locale = DEFAULT_LANGUAGE,
  className,
}: {
  item: MenuLink
  locale?: SupportedLanguage
  className: string
}) {
  const href = resolveContentLinkHref(item.link)
  const label = item.label || 'Link'

  if (!href) {
    return <span className={className}>{label}</span>
  }

  const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

  return (
    <Link
      href={localizeHref(href, locale) || href}
      className={className}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      data-menu-item-id={item.itemId || undefined}
    >
      {label}
    </Link>
  )
}

function FooterLogo({
  settings,
  variant,
  locale = DEFAULT_LANGUAGE,
}: {
  settings: FooterSettings | null
  variant: FooterVariant
  locale?: SupportedLanguage
}) {
  const activeLogo = selectLogo(variant, settings)
  const logoAssetRef = activeLogo?.asset?._ref
  const tone = getFooterTone(variant)
  const homeHref = localizeHref('/', locale) || '/'

  return (
    <Link href={homeHref} className="inline-flex w-fit max-w-[15rem] items-center" aria-label="Go to homepage">
      {logoAssetRef ? (
        <Image
          id={logoAssetRef}
          alt={activeLogo?.alt || settings?.companyName || settings?.title || 'Site logo'}
          width={280}
          height={48}
          className="h-10 w-auto sm:h-11"
          mode="contain"
        />
      ) : (
        <span className={cn('font-brand text-[2rem] leading-none tracking-[-0.04em]', tone.logoText)}>
          {settings?.companyName || settings?.title || 'Albatha'}
        </span>
      )}
    </Link>
  )
}

function FooterContactRow({
  value,
  href,
  valueClassName,
}: {
  value?: string | null
  href?: string
  valueClassName: string
}) {
  if (!value) {
    return null
  }

  return (
    <div>
      {href ? (
        <a href={href} className={cn('text-[30px] leading-[1.4] underline-offset-4', valueClassName)}>
          {value}
        </a>
      ) : (
        <p className={cn('text-[30px] leading-[1.4]', valueClassName)}>{value}</p>
      )}
    </div>
  )
}

export default function Footer({variant}: {variant?: FooterVariant | null}) {
  const pathname = usePathname() || '/'
  const locale = getLocaleFromPath(pathname)
  const layoutSettings = useLayoutSettings() as FooterSettings | null
  const footerConfig = layoutSettings?.footer || null
  const resolvedVariant: FooterVariant = variant === 'negative' ? 'negative' : 'positive'
  const tone = getFooterTone(resolvedVariant)
  const navigationGroups = buildFallbackNavigationGroups(footerConfig)
  const navigationColumns = buildNavigationColumns(navigationGroups)
  const legalLinks = footerConfig?.legalMenu?.links || []
  const showDefaultLegalLinks = footerConfig?.showDefaultLegalLinks ?? true
  const companyName = layoutSettings?.companyName || layoutSettings?.title || 'Albatha Holding'
  const officeLocations = layoutSettings?.officeLocations?.filter((location) => location?.address) || []
  const creditHref = resolveContentLinkHref(footerConfig?.creditLink)
  const creditLabel = footerConfig?.creditLabel || undefined
  const creditIsExternal = isExternalContentLink(footerConfig?.creditLink) && footerConfig?.creditLink?.openInNewTab

  return (
    <footer
      className={cn('relative overflow-hidden', tone.root)}
      data-menu-group-id={footerConfig?.menu?.menuId || undefined}
    >
      <div className="relative mx-auto max-w-wide px-4 py-12 sm:px-6 md:py-14 lg:min-h-[600px] lg:px-8 lg:py-20">
        <div className="flex min-h-full flex-col lg:justify-between">
          <div className="grid gap-12 lg:grid-cols-[515px_1fr] lg:gap-[calc(50%-527px)]">
            <div className="flex flex-col gap-10">
              <FooterLogo settings={layoutSettings} variant={resolvedVariant} locale={locale} />

              <div className="flex flex-col gap-6 text-[18px] leading-[1.4] lg:flex-row lg:items-end">
                {officeLocations.map((location, index) => (
                  <section key={location._key || `${location.title || 'office'}-${index}`} className="max-w-[248px]">
                    {index === 0 ? (
                      <p className="mb-5 text-[20px] font-medium leading-[1.4]">{companyName}</p>
                    ) : null}
                    <p className="whitespace-pre-line">{location.address}</p>
                  </section>
                ))}
                {!officeLocations.length ? (
                  <section className="max-w-[248px]">
                    <p className="mb-5 text-[20px] font-medium leading-[1.4]">{companyName}</p>
                  </section>
                ) : null}
              </div>

              <div className="flex flex-col gap-[10px]">
                <FooterContactRow
                  value={layoutSettings?.contactPhone}
                  href={layoutSettings?.contactPhone ? `tel:${layoutSettings.contactPhone.replace(/\s+/g, '')}` : undefined}
                  valueClassName={tone.contactLink}
                />
                <FooterContactRow
                  value={layoutSettings?.contactEmail}
                  href={layoutSettings?.contactEmail ? `mailto:${layoutSettings.contactEmail}` : undefined}
                  valueClassName={tone.contactLink}
                />
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-6">
              {navigationColumns.map((column, columnIndex) => (
                <section
                  key={column._key || `footer-column-${columnIndex}`}
                  className={cn(
                    'flex flex-col items-start',
                    column.title ? 'gap-7 pt-[10px]' : 'gap-5 pt-[62px]',
                    columnIndex < 2 ? 'lg:w-[247px]' : 'lg:w-[254px]',
                  )}
                >
                  {column.title ? (
                    <p className={cn('text-[24px] leading-none', tone.heading)}>{column.title}</p>
                  ) : null}
                  <ul role="list" className="flex flex-col items-start gap-5">
                    {column.links.map((item, itemIndex) =>
                      item ? (
                        <li key={resolveMenuItemKey(item, itemIndex, 'footer-column-link')} className="py-[10px]">
                          <FooterNavLink
                            item={item}
                            locale={locale}
                            className={cn('inline-flex text-[20px] leading-none', tone.link)}
                          />
                        </li>
                      ) : null,
                    )}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <div className={cn('mt-12 border-t pt-5 lg:mt-0 lg:pt-[18px]', tone.divider)}>
            <div
              className={cn(
                'flex flex-col gap-4 text-[16px] leading-[1.75] sm:text-[18px] lg:flex-row lg:items-center lg:justify-between lg:text-[20px]',
              )}
            >
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3" data-menu-group-id={footerConfig?.legalMenu?.menuId || undefined}>
                {legalLinks.map((item, index) => (
                  <FooterNavLink
                    key={resolveMenuItemKey(item, index, 'legal-link')}
                    item={item}
                    locale={locale}
                    className={cn('inline-flex underline underline-offset-[3px]', tone.legalLink)}
                  />
                ))}

                {showDefaultLegalLinks && legalLinks.length === 0 ? (
                  <>
                    <Link
                      href={localizeHref('/privacy-policy', locale) || '/privacy-policy'}
                      className={cn('inline-flex underline underline-offset-[3px]', tone.legalLink)}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href={localizeHref('/terms-and-conditions', locale) || '/terms-and-conditions'}
                      className={cn('inline-flex underline underline-offset-[3px]', tone.legalLink)}
                    >
                      Terms & Conditions
                    </Link>
                  </>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-0 lg:justify-end">
                <p className={cn('text-left lg:text-right', tone.creditText)}>
                  {footerConfig?.copyrightText || `Copyright ${companyName}. Created by `}
                </p>
                {creditHref && creditLabel ? (
                  <Link
                    href={localizeHref(creditHref, locale) || creditHref}
                    className={cn('underline underline-offset-[3px]', tone.creditLink)}
                    target={creditIsExternal ? '_blank' : undefined}
                    rel={creditIsExternal ? 'noopener noreferrer' : undefined}
                  >
                    {creditLabel}
                  </Link>
                ) : creditLabel ? (
                  <span className={cn('underline underline-offset-[3px]', tone.creditLink)}>{creditLabel}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
