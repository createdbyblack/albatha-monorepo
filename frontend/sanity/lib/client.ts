import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from '@/sanity/lib/token'

const STEGA_SKIPPED_ENUM_FIELDS = new Set(['width', 'gap', 'verticalAlignment'])

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token, // Required if you have a private dataset
  stega: {
    studioUrl,
    filter: (props) => {
      const lastSegment = props.sourcePath.at(-1)

      if (typeof lastSegment === 'string' && STEGA_SKIPPED_ENUM_FIELDS.has(lastSegment)) {
        return false
      }

      return props.filterDefault(props)
    },
  },
})
