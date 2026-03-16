import type {CSSProperties} from 'react'

export const buttonVariantClasses: Record<string, string> = {
  primary:
    'border-button-primary bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover',
  secondary:
    'border-button-secondary bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-surface',
}

export const buttonSizeClasses: Record<string, string> = {
  sm: 'px-button-sm-x py-button-sm-y text-button-sm',
  md: 'px-button-md-x py-button-md-y text-button-md',
  lg: 'px-button-lg-x py-button-lg-y text-button-lg',
}

export const buttonGroupAlignClasses: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const buttonGroupOrientationClasses: Record<string, string> = {
  horizontal: 'flex-row flex-wrap',
  vertical: 'flex-col',
}

export const columnVerticalAlignmentClasses: Record<string, string> = {
  top: 'self-start',
  center: 'self-center',
  bottom: 'self-end',
}

export const columnsVerticalAlignmentClasses: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

export const columnsGapClasses: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-gutenberg-gap-sm',
  md: 'gap-gutenberg-gap-md',
  lg: 'gap-gutenberg-gap-lg',
}

export function getColumnWidthClasses(
  width: 'auto' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4' = 'auto',
  stackedOnMobile = true,
) {
  switch (width) {
    case '1/2':
      return stackedOnMobile ? 'w-full md:w-1/2 md:flex-none' : 'w-1/2 flex-none'
    case '1/3':
      return stackedOnMobile ? 'w-full md:w-1/3 md:flex-none' : 'w-1/3 flex-none'
    case '1/4':
      return stackedOnMobile ? 'w-full md:w-1/4 md:flex-none' : 'w-1/4 flex-none'
    case '2/3':
      return stackedOnMobile ? 'w-full md:w-2/3 md:flex-none' : 'w-2/3 flex-none'
    case '3/4':
      return stackedOnMobile ? 'w-full md:w-3/4 md:flex-none' : 'w-3/4 flex-none'
    case 'auto':
    default:
      return stackedOnMobile ? 'w-full md:min-w-0 md:flex-1' : 'min-w-0 flex-1'
  }
}

export const groupLayoutClasses: Record<string, string> = {
  default: 'block',
  constrained: 'mx-auto block w-full max-w-content',
  flex: 'flex flex-wrap gap-gutenberg-gap-md',
  grid: 'grid gap-gutenberg-gap-md',
}

export const groupAlignClasses: Record<string, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
  wide: 'mx-auto w-full max-w-wide',
  full: 'w-full max-w-none',
}

export const textAlignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const paragraphFontSizeClasses: Record<string, string> = {
  sm: 'text-copy-sm',
  md: 'text-copy-md',
  lg: 'text-copy-lg',
  xl: 'text-copy-xl',
}

export const imageAspectRatioClasses: Record<string, string> = {
  auto: '',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '3/4': 'aspect-[3/4]',
  '9/16': 'aspect-[9/16]',
}

export const imageScaleClasses: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
}

export const navigationLayoutClasses: Record<string, string> = {
  horizontal: 'flex-row flex-wrap items-center gap-4',
  vertical: 'flex-col items-start gap-3',
}

export const coverPositionClasses: Record<string, string> = {
  'top-left': 'items-start justify-start text-left',
  'top-center': 'items-start justify-center text-center',
  'top-right': 'items-start justify-end text-right',
  'center-left': 'items-center justify-start text-left',
  'center-center': 'items-center justify-center text-center',
  'center-right': 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-center': 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right',
}

export const coverMinHeightClasses: Record<string, string> = {
  sm: 'min-h-cover-sm',
  md: 'min-h-cover-md',
  lg: 'min-h-cover-lg',
  full: 'min-h-screen',
}

export const siteLogoWidthClasses: Record<string, string> = {
  sm: 'w-site-logo-sm',
  md: 'w-site-logo-md',
  lg: 'w-site-logo-lg',
}

export function resolveOverlayStyle(overlayColor = '#000000', dimRatio = 50): CSSProperties {
  const clampedRatio = Math.max(0, Math.min(100, dimRatio))
  return {
    backgroundColor: `color-mix(in srgb, ${overlayColor} ${clampedRatio}%, transparent)`,
  }
}
