import {page} from './documents/page'
import {settings} from './singletons/settings'
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
import cbNavigationLink from './objects/navigation-link'
import cbNavigation from './objects/navigation'
import cbParagraph from './objects/paragraph'
import cbWysiwyg from './objects/wysiwyg'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  // Objects
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
  cbNavigationLink,
  cbNavigation,
  cbParagraph,
  cbWysiwyg,
  blockContent,
  blockContentTextOnly,
]
