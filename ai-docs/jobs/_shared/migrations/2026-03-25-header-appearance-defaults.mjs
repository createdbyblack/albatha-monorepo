import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.SANITY_API_VERSION || '2026-03-25'

if (!projectId || !dataset || !token) {
  console.error(
    [
      'Missing required environment variables.',
      'Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_TOKEN before running this migration.',
    ].join(' '),
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
})

const documentTypes = ['homePage', 'page', 'legalPage']

function contentLink(internalPath) {
  return {
    _type: 'cbLink',
    linkType: 'internal',
    internalTargetType: 'path',
    internalPath,
    openInNewTab: false,
  }
}

function menuSubLink(key, itemId, label, internalPath) {
  return {
    _key: key,
    _type: 'menuSubLink',
    itemId,
    label,
    link: contentLink(internalPath),
  }
}

function menuColumn(key, links) {
  return {
    _key: key,
    _type: 'menuMegaMenuColumn',
    links,
  }
}

function menuGroup(key, title, columns) {
  return {
    _key: key,
    _type: 'menuMegaMenuGroup',
    title,
    columns,
  }
}

function menuLink(key, itemId, label, internalPath, extra = {}) {
  return {
    _key: key,
    _type: 'menuLink',
    itemId,
    label,
    link: contentLink(internalPath),
    ...extra,
  }
}

const seededPrimaryMenu = {
  _type: 'menuGroup',
  menuId: 'primary',
  title: 'Primary',
  links: [
    menuLink('primary-about', 'nav-about', 'About', '/about'),
    menuLink('primary-business-units', 'nav-business-units', 'Business Units', '/business-units', {
      megaMenu: {
        _type: 'menuMegaMenu',
        groups: [
          menuGroup('mega-business-units', 'Albatha Business Units', [
            menuColumn('mega-business-units-col-1', [
              menuSubLink('automotive', 'bu-automotive', 'Automotive', '/automotive'),
              menuSubLink(
                'consumer-products',
                'bu-consumer-products',
                'Consumer Products',
                '/consumer-products',
              ),
              menuSubLink('healthcare', 'bu-healthcare', 'Healthcare', '/healthcare'),
              menuSubLink('engineering', 'bu-engineering', 'Engineering', '/engineering'),
            ]),
            menuColumn('mega-business-units-col-2', [
              menuSubLink('real-estate', 'bu-real-estate', 'Real Estate', '/real-estate'),
              menuSubLink(
                'retail-home-products',
                'bu-retail-home-products',
                'Retail & Home Products',
                '/retail-home-products',
              ),
              menuSubLink(
                'home-personal-care',
                'bu-home-personal-care',
                'Home & Personal Care',
                '/home-personal-care',
              ),
              menuSubLink(
                'albatha-innovation',
                'bu-albatha-innovation',
                'Albatha Innovation',
                '/albatha-innovation',
              ),
            ]),
          ]),
          menuGroup('mega-flagship-brands', 'Flagship Brands', [
            menuColumn('mega-flagship-brands-col-1', [
              menuSubLink('agmc', 'brand-agmc', 'AGMC', '/agmc'),
              menuSubLink('mpc', 'brand-mpc', 'MPC', '/mpc'),
              menuSubLink('scitra', 'brand-scitra', 'Scitra', '/scitra'),
              menuSubLink('super-general', 'brand-super-general', 'Super General', '/super-general'),
            ]),
          ]),
        ],
      },
    }),
    menuLink('primary-community', 'nav-community', 'Community', '/community'),
  ],
}

const seededSecondaryMenu = {
  _type: 'menuGroup',
  menuId: 'secondary',
  title: 'Secondary',
  links: [
    menuLink('secondary-newsroom', 'nav-newsroom', 'Newsroom', '/newsroom'),
    menuLink('secondary-contact', 'nav-contact', 'Contact', '/contact'),
  ],
}

function stripSystemFields(doc) {
  if (!doc) return {}

  const {_rev, _createdAt, _updatedAt, ...rest} = doc
  return rest
}

async function backfillPageHeaderAppearance() {
  const query = `
    *[
      _type in $documentTypes &&
      !defined(headerAppearance.variant)
    ]{
      _id,
      _type,
      "title": coalesce(name, title, slug.current, slug, _id)
    }
  `

  const documents = await client.fetch(query, {documentTypes})

  if (!documents.length) {
    console.log('No page-like documents require headerAppearance backfill.')
    return
  }

  console.log(`Backfilling headerAppearance.variant for ${documents.length} document(s)...`)

  let transaction = client.transaction()

  for (const document of documents) {
    transaction = transaction.patch(document._id, {
      setIfMissing: {
        headerAppearance: {
          _type: 'pageHeaderAppearance',
          variant: 'positive',
        },
      },
    })
  }

  await transaction.commit()

  for (const document of documents) {
    console.log(`Updated ${document._type}: ${document.title}`)
  }
}

async function seedHeaderSingleton() {
  const existingHeader = await client.fetch(`*[_id in ["drafts.siteHeader", "siteHeader"]][0]`)
  const headerId = existingHeader?._id || 'siteHeader'
  const baseHeader = stripSystemFields(existingHeader)

  const document = {
    ...baseHeader,
    _id: headerId,
    _type: 'header',
    primaryMenu: baseHeader.primaryMenu || seededPrimaryMenu,
    secondaryMenu: baseHeader.secondaryMenu || seededSecondaryMenu,
  }

  await client.createOrReplace(document)

  console.log(
    `Seeded header singleton ${headerId} with ${
      existingHeader ? 'missing menu defaults from' : ''
    } Figma header values.`.trim(),
  )
}

async function main() {
  await backfillPageHeaderAppearance()
  await seedHeaderSingleton()
  console.log('Header seeding complete.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
