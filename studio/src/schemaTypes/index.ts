import {page} from './documents/page'
import {legalPage} from './documents/legalPage'
import {post} from './documents/post'
import {settings} from './singletons/settings'
import {homePage} from './singletons/homePage'
import {header} from './singletons/header'
import {footer} from './singletons/footer'
import cbBlock from './objects/block'
import {blockContent} from './objects/blockContent'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import cbButton from './objects/button'
import cbButtons from './objects/buttons'
import cbColumn from './objects/column'
import cbColumns from './objects/columns'
import cbCover from './objects/cover'
import cbGroup from './objects/group'
import cbHeading from './objects/heading'
import cbHtml from './objects/html'
import cbImage from './objects/image'
import cbLink from './objects/link'
import cbListItem from './objects/list-item'
import cbList from './objects/list'
import cbMedia from './objects/media'
import {menuGroup} from './objects/menuGroup'
import {menuLink} from './objects/menuLink'
import {menuMegaMenu} from './objects/menuMegaMenu'
import {menuMegaMenuColumn} from './objects/menuMegaMenuColumn'
import {menuMegaMenuGroup} from './objects/menuMegaMenuGroup'
import {menuSubLink} from './objects/menuSubLink'
import {homeAboutImageBlock} from './objects/homeAboutImageBlock'
import {homeAboutStat} from './objects/homeAboutStat'
import {homeAboutStatsBlock} from './objects/homeAboutStatsBlock'
import {homeAboutSection} from './objects/homeAboutSection'
import {homeBlogPostsSection} from './objects/homeBlogPostsSection'
import {homeCompanyItemsBlock} from './objects/homeCompanyItemsBlock'
import {homeCompaniesSection} from './objects/homeCompaniesSection'
import {homeCompanyItem} from './objects/homeCompanyItem'
import {homeHeroPhrase} from './objects/homeHeroPhrase'
import {homeHeroSection} from './objects/homeHeroSection'
import {homeSectorItem} from './objects/homeSectorItem'
import {homeSectorListBlock} from './objects/homeSectorListBlock'
import {homeSectorListItem} from './objects/homeSectorListItem'
import {homeSectorsSection} from './objects/homeSectorsSection'
import {pageFooterAppearance} from './objects/pageFooterAppearance'
import {pageHeaderAppearance} from './objects/pageHeaderAppearance'
import cbNavigationLink from './objects/navigation-link'
import cbNavigation from './objects/navigation'
import cbParagraph from './objects/paragraph'
import cbShortcode from './objects/shortcode'
import cbSiteLogo from './objects/site-logo'
import cbVideo from './objects/video'
import cbWysiwyg from './objects/wysiwyg'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  header,
  footer,
  // Documents
  page,
  legalPage,
  post,
  // Objects
  cbBlock,
  cbButton,
  cbButtons,
  cbColumn,
  cbColumns,
  cbCover,
  cbGroup,
  cbHeading,
  cbHtml,
  cbImage,
  cbLink,
  cbListItem,
  cbList,
  cbMedia,
  menuGroup,
  menuLink,
  menuMegaMenu,
  menuMegaMenuColumn,
  menuMegaMenuGroup,
  menuSubLink,
  homeAboutImageBlock,
  homeAboutStat,
  homeAboutStatsBlock,
  homeAboutSection,
  homeBlogPostsSection,
  homeCompanyItemsBlock,
  homeCompaniesSection,
  homeCompanyItem,
  homeHeroPhrase,
  homeHeroSection,
  homeSectorItem,
  homeSectorListBlock,
  homeSectorListItem,
  homeSectorsSection,
  pageFooterAppearance,
  pageHeaderAppearance,
  cbNavigationLink,
  cbNavigation,
  cbParagraph,
  cbShortcode,
  cbSiteLogo,
  cbVideo,
  cbWysiwyg,
  blockContent,
  blockContentTextOnly,
]
