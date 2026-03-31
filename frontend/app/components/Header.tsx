'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {stegaClean} from '@sanity/client/stega'

import Image from '@/app/components/SanityImage'
import {useLayoutSettings} from '@/app/components/LayoutSettingsProvider'
import {cn} from '@/app/lib/cn'
import type {LayoutSettings, MenuLink} from '@/sanity/lib/settings-types'
import {DEFAULT_LANGUAGE, type SupportedLanguage} from '@/sanity/lib/i18n'
import type {HeaderVariant} from '@/sanity/lib/types'
import {getLanguageToggleHref, getLocaleFromPath} from '@/app/lib/locale-path'
import {isExternalContentLink, localizeHref, resolveContentLinkHref} from '@/sanity/lib/utils'

type HeaderImage = {
  asset?: {_ref?: string} | null
  alt?: string | null
}

type HeaderMegaMenuColumn = {
  _key?: string
  links?: MenuLink[] | null
}

type HeaderMegaMenuGroup = {
  _key?: string
  title?: string | null
  columns?: HeaderMegaMenuColumn[] | null
}

type HeaderMenuLink = MenuLink & {
  megaMenu?: {
    groups?: HeaderMegaMenuGroup[] | null
  } | null
}

type HeaderMenuGroup = {
  menuId?: string | null
  title?: string | null
  links?: HeaderMenuLink[] | null
}

type HeaderConfig = NonNullable<LayoutSettings['header']> & {
  positiveLogo?: HeaderImage | null
  negativeLogo?: HeaderImage | null
  primaryMenu?: HeaderMenuGroup | null
  secondaryMenu?: HeaderMenuGroup | null
}

type HeaderSettings = LayoutSettings & {
  header?: HeaderConfig | null
}

function cleanVariant(value?: string | null): 'positive' | 'negative' | null {
  const cleaned = typeof value === 'string' ? (stegaClean(value) || value) : value
  return cleaned === 'negative' ? 'negative' : cleaned === 'positive' ? 'positive' : null
}

function resolveMenuItemKey(item: MenuLink, index: number, prefix = 'nav-item') {
  return item.itemId || item._key || `${item.label || prefix}-${index}`
}

function hasMegaMenu(item: HeaderMenuLink) {
  return Boolean(item.megaMenu?.groups?.some((group) => group.columns?.some((column) => column.links?.length)))
}

function hasSubLinks(item: HeaderMenuLink) {
  return Boolean(item.subLinks?.length)
}

function hasNestedMenu(item: HeaderMenuLink) {
  return hasMegaMenu(item) || hasSubLinks(item)
}

function selectLogo(
  variant: 'positive' | 'negative',
  settings?: HeaderSettings | null,
): HeaderImage | null {
  const header = settings?.header
  const candidateLogos =
    variant === 'negative'
      ? [header?.negativeLogo, header?.positiveLogo, settings?.logo]
      : [header?.positiveLogo, header?.negativeLogo, settings?.logo]

  return candidateLogos.find((candidate) => candidate?.asset?._ref) || null
}

function getMenuLinkTone(variant: 'positive' | 'negative') {
  return variant === 'negative'
    ? {
        text: 'text-header-negative-foreground',
        border: 'border-header-negative-border',
        mutedBorder: 'border-header-negative-border-subtle',
        panelBorder: 'border-header-negative-border-panel',
        hoverText: 'hover:text-header-negative-foreground',
        activeBg: 'bg-header-negative-active',
        hoverBg: 'hover:bg-header-negative-hover focus-within:bg-header-negative-hover',
        icon: 'text-header-negative-foreground/70',
      }
    : {
        text: 'text-header-positive-foreground',
        border: 'border-header-positive-border',
        mutedBorder: 'border-header-positive-border-subtle',
        panelBorder: 'border-header-positive-border-panel',
        hoverText: 'hover:text-header-positive-foreground',
        activeBg: 'bg-header-positive-active',
        hoverBg: 'hover:bg-header-positive-hover focus-within:bg-header-positive-hover',
        icon: 'text-header-positive-foreground/70',
      }
}

function filterMegaMenuGroups(item: HeaderMenuLink) {
  return (
    item.megaMenu?.groups
      ?.map((group) => ({
        ...group,
        columns:
          group.columns?.filter((column) => column.links?.length) || [],
      }))
      .filter((group) => group.columns.length) || []
  )
}

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn('h-3.5 w-3.5 fill-none stroke-current stroke-[1.6]', className)}
    >
      <path d="M3.25 5.75 8 10.25l4.75-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GlobeIcon({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn('h-4 w-4 fill-none stroke-current stroke-[1.2]', className)}
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M1.75 8h12.5M8 1.75c1.9 1.7 2.9 3.79 2.9 6.25S9.9 12.55 8 14.25C6.1 12.55 5.1 10.46 5.1 8S6.1 3.45 8 1.75Z" />
    </svg>
  )
}

function MenuIcon({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 fill-none stroke-current stroke-[1.8]', className)}
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 fill-none stroke-current stroke-[1.8]', className)}
    >
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

function MenuItemLink({
  item,
  className,
  onClick,
  locale = DEFAULT_LANGUAGE,
}: {
  item: MenuLink
  className: string
  onClick?: () => void
  locale?: SupportedLanguage
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
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

function HeaderLogo({
  settings,
  variant,
  mobile = false,
  locale = DEFAULT_LANGUAGE,
}: {
  settings: HeaderSettings | null
  variant: 'positive' | 'negative'
  mobile?: boolean
  locale?: SupportedLanguage
}) {
  const activeLogo = selectLogo(variant, settings)
  const logoAssetRef = activeLogo?.asset?._ref

  const homeHref = localizeHref('/', locale) || '/'

  return (
    <Link
      href={homeHref}
      className={cn(
        'flex items-center justify-center',
        mobile ? 'mx-auto w-fit max-w-[15.5rem]' : 'w-fit max-w-[18rem] xl:max-w-[25.375rem]',
      )}
      aria-label="Go to homepage"
    >
      {logoAssetRef ? (
        <Image
          id={logoAssetRef}
          alt={activeLogo?.alt || settings?.title || 'Site logo'}
          width={406}
          height={60}
          className={cn(mobile ? 'h-8 w-auto sm:h-10' : 'h-9 w-auto lg:h-11 xl:h-[3.75rem]')}
          mode="contain"
        />
        ) : (
          <span
            className={cn(
              'font-brand text-[1.9rem] leading-none tracking-[-0.04em]',
              variant === 'negative' ? 'text-header-negative-foreground' : 'text-header-brand',
            )}
          >
            {settings?.title || 'Albatha'}
          </span>
        )}
    </Link>
  )
}

function LanguageToggle({
  variant,
  pathname,
  onClick,
}: {
  variant: 'positive' | 'negative'
  pathname: string
  onClick?: () => void
}) {
  const tone = getMenuLinkTone(variant)
  const locale = getLocaleFromPath(pathname)
  const targetHref = getLanguageToggleHref(pathname)
  const targetLabel = locale === 'ae' ? 'EN' : 'AR'

  return (
    <Link
      href={targetHref}
      className={cn(
        'inline-flex h-[1.875rem] items-center justify-center gap-2 rounded-[8px] border px-3 text-base leading-none transition-colors',
        tone.text,
        tone.border,
        tone.hoverBg,
      )}
      aria-label={`Switch language to ${targetLabel}`}
      onClick={onClick}
    >
      <GlobeIcon />
      <span className="text-base uppercase">{targetLabel}</span>
    </Link>
  )
}

function DesktopMenuItem({
  item,
  itemKey,
  variant,
  isActive,
  onOpen,
  locale = DEFAULT_LANGUAGE,
}: {
  item: HeaderMenuLink
  itemKey: string
  variant: 'positive' | 'negative'
  isActive: boolean
  onOpen: (itemKey: string) => void
  locale?: SupportedLanguage
}) {
  const nested = hasNestedMenu(item)
  const href = resolveContentLinkHref(item.link)
  const tone = getMenuLinkTone(variant)

  return (
    <li
      data-menu-item-id={item.itemId || undefined}
      onMouseEnter={() => {
        if (nested) {
          onOpen(itemKey)
        }
      }}
      onFocus={() => {
        if (nested) {
          onOpen(itemKey)
        }
      }}
    >
      <div
        className={cn(
          'flex items-center gap-1 rounded-[8px] px-[10px] py-[10px] text-[1.25rem] leading-none transition-colors',
          tone.text,
          tone.hoverBg,
          isActive && tone.activeBg,
        )}
      >
          {href ? (
            <MenuItemLink
              item={item}
              className={cn('block whitespace-nowrap', tone.hoverText)}
              locale={locale}
            />
          ) : (
          <button type="button" className="block whitespace-nowrap text-left">
            {item.label || 'Link'}
          </button>
        )}
        {nested ? <ChevronDownIcon className={cn('mt-0.5', tone.icon)} /> : null}
      </div>
    </li>
  )
}

function DesktopMenuRail({
  label,
  items,
  variant,
  menuId,
  openItemKey,
  onOpen,
  locale = DEFAULT_LANGUAGE,
}: {
  label: string
  items: HeaderMenuLink[]
  variant: 'positive' | 'negative'
  menuId?: string | null
  openItemKey?: string | null
  onOpen: (itemKey: string) => void
  locale?: SupportedLanguage
}) {
  if (!items.length) {
    return null
  }

  return (
    <nav aria-label={label} data-menu-group-id={menuId || undefined} className="hidden lg:block">
      <ul role="list" className="flex items-center gap-[0.625rem]">
        {items.map((item, index) => {
          const itemKey = resolveMenuItemKey(item, index, label)

          return (
            <DesktopMenuItem
              key={itemKey}
              item={item}
              itemKey={itemKey}
              variant={variant}
              isActive={openItemKey === itemKey}
              onOpen={onOpen}
              locale={locale}
            />
          )
        })}
      </ul>
    </nav>
  )
}

function DesktopMegaMenuPanels({
  item,
  locale = DEFAULT_LANGUAGE,
}: {
  item: HeaderMenuLink
  locale?: SupportedLanguage
}) {
  const groups = filterMegaMenuGroups(item)

  if (groups.length) {
    return (
      <div className="flex flex-wrap gap-2">
        {groups.map((group, groupIndex) => {
          const columnCount = Math.max(group.columns.length, 1)
          const cardWidth =
            columnCount > 1
              ? 'w-full max-w-[26rem] xl:max-w-[26.125rem]'
              : 'w-full max-w-[15.625rem]'

          return (
            <section
              key={group._key || `${item.label || 'mega-group'}-${groupIndex}`}
              className={cn(
                'min-h-[15rem] bg-header-dropdown-background px-7 pb-8 pt-7 text-header-brand-foreground',
                cardWidth,
                groupIndex === 0
                  ? '[clip-path:polygon(0_0,100%_0,calc(100%-1.7rem)_100%,0_100%)]'
                  : '[clip-path:polygon(1.7rem_0,100%_0,100%_100%,0_100%)]',
              )}
            >
              <p className="mb-6 text-[1.5rem] leading-none text-header-dropdown-muted">
                {group.title || 'Menu group'}
              </p>
              <div className={cn('grid gap-x-[3.1875rem] gap-y-[1.875rem]', columnCount > 1 && 'grid-cols-2')}>
                {group.columns.map((column, columnIndex) => (
                  <ul
                    key={column._key || `${group.title || 'column'}-${columnIndex}`}
                    role="list"
                    className="space-y-[1.875rem]"
                  >
                         {column.links?.map((link, linkIndex) => (
                            <li key={resolveMenuItemKey(link, linkIndex, 'mega-link')}>
                              <MenuItemLink
                                item={link}
                                className="block text-[1.25rem] leading-none text-header-brand-foreground transition-opacity hover:opacity-75"
                                locale={locale}
                              />
                            </li>
                          ))}
                        </ul>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  if (!item.subLinks?.length) {
    return null
  }

  return (
    <section className="w-full max-w-[20rem] rounded-b-[16px] bg-header-dropdown-background px-7 pb-8 pt-7 text-header-brand-foreground">
      <ul role="list" className="space-y-6">
             {item.subLinks.map((subLink, subIndex) => (
              <li key={resolveMenuItemKey(subLink, subIndex, 'sub-link')}>
                <MenuItemLink
                  item={subLink}
                  className="block text-[1.25rem] leading-none text-header-brand-foreground transition-opacity hover:opacity-75"
                  locale={locale}
                />
              </li>
            ))}
      </ul>
    </section>
  )
}

function MobileNestedPanel({
  item,
  variant,
  expanded,
  onToggle,
  onNavigate,
  locale = DEFAULT_LANGUAGE,
}: {
  item: HeaderMenuLink
  variant: 'positive' | 'negative'
  expanded: boolean
  onToggle: () => void
  onNavigate: () => void
  locale?: SupportedLanguage
}) {
  const tone = getMenuLinkTone(variant)
  const nested = hasNestedMenu(item)
  const groups = filterMegaMenuGroups(item)
  const href = resolveContentLinkHref(item.link)

  return (
    <li data-menu-item-id={item.itemId || undefined}>
      <div className={cn('rounded-[14px] border px-4 py-4', tone.mutedBorder, expanded && tone.activeBg)}>
        <div className="flex items-center gap-3">
          {href ? (
            <MenuItemLink
              item={item}
              className={cn('min-w-0 flex-1 text-left text-[1.125rem] leading-none', tone.text)}
              onClick={onNavigate}
              locale={locale}
            />
          ) : (
            <span className={cn('min-w-0 flex-1 text-[1.125rem] leading-none', tone.text)}>
              {item.label || 'Link'}
            </span>
          )}
          {nested ? (
            <button
              type="button"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors',
                tone.border,
                tone.hoverBg,
              )}
              aria-expanded={expanded}
              onClick={onToggle}
            >
              <ChevronDownIcon className={cn('transition-transform', expanded && 'rotate-180')} />
            </button>
          ) : null}
        </div>
        {nested && expanded ? (
          <div className={cn('mt-5 border-t pt-5', tone.panelBorder)}>
            {groups.length ? (
              <div className="space-y-3">
                {groups.map((group, groupIndex) => (
                  <section
                    key={group._key || `${item.label || 'mobile-group'}-${groupIndex}`}
                    className="rounded-[14px] bg-header-dropdown-background px-5 py-5 text-header-brand-foreground"
                  >
                    <p className="mb-4 text-lg leading-none text-header-dropdown-muted">{group.title || 'Menu group'}</p>
                    <div className={cn('grid gap-5', group.columns.length > 1 && 'sm:grid-cols-2')}>
                      {group.columns.map((column, columnIndex) => (
                        <ul
                          key={column._key || `${group.title || 'column'}-${columnIndex}`}
                          role="list"
                          className="space-y-5"
                        >
                          {column.links?.map((link, linkIndex) => (
                            <li key={resolveMenuItemKey(link, linkIndex, 'mobile-mega-link')}>
                              <MenuItemLink
                                item={link}
                                className="block text-base leading-none text-header-brand-foreground transition-opacity hover:opacity-75"
                                onClick={onNavigate}
                                locale={locale}
                              />
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
            {!groups.length && item.subLinks?.length ? (
              <ul role="list" className="space-y-4">
                {item.subLinks.map((subLink, subIndex) => (
                  <li key={resolveMenuItemKey(subLink, subIndex, 'mobile-sub-link')}>
                    <MenuItemLink
                      item={subLink}
                      className={cn('block text-base leading-none', tone.text)}
                      onClick={onNavigate}
                      locale={locale}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export default function Header({variant}: {variant?: HeaderVariant | null}) {
  const pathname = usePathname() || '/'
  const locale = getLocaleFromPath(pathname)
  const layoutSettings = useLayoutSettings()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)
  const [desktopMenuId, setDesktopMenuId] = useState<string | null>(null)

  const resolvedVariant: HeaderVariant = cleanVariant(variant) === 'negative' ? 'negative' : 'positive'
  const resolvedSettings = layoutSettings as HeaderSettings | null
  const headerConfig = resolvedSettings?.header
  const primaryMenu = headerConfig?.primaryMenu
  const secondaryMenu = headerConfig?.secondaryMenu
  const primaryLinks = headerConfig?.primaryMenu?.links || []
  const secondaryLinks = headerConfig?.secondaryMenu?.links || []
  const isNegative = resolvedVariant === 'negative'
  const tone = getMenuLinkTone(resolvedVariant)

  useEffect(() => {
    setMobileMenuOpen(false)
    setExpandedMobileItem(null)
    setDesktopMenuId(null)
  }, [pathname])

  const desktopOpenItem = useMemo(() => {
    if (!desktopMenuId) {
      return null
    }

    return (
      primaryLinks.find((item, index) => resolveMenuItemKey(item, index, 'Primary navigation') === desktopMenuId) ||
      null
    )
  }, [desktopMenuId, primaryLinks])

  return (
    <header
      className={cn(
        'relative z-50',
        isNegative
          ? 'bg-header-negative-background text-header-negative-foreground'
          : 'bg-header-positive-background text-header-positive-foreground',
      )}
      onMouseLeave={() => setDesktopMenuId(null)}
    >
      <div className={cn('border-b', tone.border)}>
        <div className="relative mx-auto hidden max-w-wide items-center justify-between gap-8 px-4 py-5 lg:flex xl:px-8">
          <div className="min-w-0 flex-1">
            <DesktopMenuRail
              label="Primary navigation"
              items={primaryLinks}
              variant={resolvedVariant}
              menuId={primaryMenu?.menuId}
              openItemKey={desktopMenuId}
              onOpen={setDesktopMenuId}
              locale={locale}
            />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="pointer-events-auto">
              <HeaderLogo settings={resolvedSettings} variant={resolvedVariant} locale={locale} />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <DesktopMenuRail
              label="Secondary navigation"
              items={secondaryLinks}
              variant={resolvedVariant}
              menuId={secondaryMenu?.menuId}
              onOpen={setDesktopMenuId}
              locale={locale}
            />
            <LanguageToggle variant={resolvedVariant} pathname={pathname} />
          </div>
        </div>

        <div className="relative flex items-center justify-end px-4 py-4 lg:hidden">
          <div className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2">
            <HeaderLogo settings={resolvedSettings} variant={resolvedVariant} mobile locale={locale} />
          </div>
          <button
            type="button"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-[10px] border transition-colors',
              tone.border,
              tone.hoverBg,
            )}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close site navigation' : 'Open site navigation'}</span>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {desktopOpenItem && hasNestedMenu(desktopOpenItem) ? (
        <div className="hidden lg:block">
          <div className="mx-auto max-w-wide px-4 xl:px-8">
            <DesktopMegaMenuPanels item={desktopOpenItem} locale={locale} />
          </div>
        </div>
      ) : null}

      {mobileMenuOpen ? (
        <div id="mobile-site-menu" className="lg:hidden">
          <div className="space-y-5 px-4 pb-6 pt-5">
            <div className="flex items-center justify-end">
              <LanguageToggle
                variant={resolvedVariant}
                pathname={pathname}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            {secondaryLinks.length ? (
              <nav aria-label="Mobile secondary navigation" data-menu-group-id={secondaryMenu?.menuId || undefined}>
                <ul role="list" className="flex flex-wrap gap-2">
                  {secondaryLinks.map((item, index) => (
                    <li key={resolveMenuItemKey(item, index, 'mobile-secondary')}>
                      <MenuItemLink
                        item={item}
                        className={cn(
                          'inline-flex rounded-[10px] border px-4 py-2 text-sm leading-none transition-colors',
                          tone.text,
                          tone.border,
                          tone.hoverBg,
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                        locale={locale}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <nav aria-label="Mobile primary navigation" data-menu-group-id={primaryMenu?.menuId || undefined}>
              <ul role="list" className="space-y-3">
                {primaryLinks.map((item, index) => {
                  const itemKey = resolveMenuItemKey(item, index, 'mobile-primary')

                  return (
                    <MobileNestedPanel
                      key={itemKey}
                      item={item}
                      variant={resolvedVariant}
                      expanded={expandedMobileItem === itemKey}
                      onToggle={() =>
                        setExpandedMobileItem((current) => (current === itemKey ? null : itemKey))
                      }
                      onNavigate={() => {
                        setExpandedMobileItem(null)
                        setMobileMenuOpen(false)
                      }}
                      locale={locale}
                    />
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}
