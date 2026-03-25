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

function menuLink(key, itemId, label, internalPath) {
  return {
    _key: key,
    _type: 'menuLink',
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

const seededNavigationGroups = [
  menuGroup('footer-albatha-links', 'Albatha Links', [
    menuColumn('footer-albatha-links-col-1', [
      menuSubLink('footer-home', 'footer-home', 'Home', '/'),
      menuSubLink('footer-who-we-are', 'footer-who-we-are', 'Who We Are', '/who-we-are'),
      menuSubLink('footer-leadership', 'footer-leadership', 'Leadership', '/leadership'),
      menuSubLink('footer-newsroom', 'footer-newsroom', 'Newsroom', '/newsroom'),
    ]),
  ]),
  menuGroup('footer-business-units', 'Businesses Units', [
    menuColumn('footer-business-units-col-1', [
      menuSubLink('footer-automotive', 'footer-automotive', 'Automotive', '/automotive'),
      menuSubLink(
        'footer-consumer-products',
        'footer-consumer-products',
        'Consumer Products',
        '/consumer-products',
      ),
      menuSubLink('footer-healthcare', 'footer-healthcare', 'Healthcare', '/healthcare'),
      menuSubLink('footer-engineering', 'footer-engineering', 'Engineering', '/engineering'),
    ]),
    menuColumn('footer-business-units-col-2', [
      menuSubLink('footer-real-estate', 'footer-real-estate', 'Real Estate', '/real-estate'),
      menuSubLink(
        'footer-retail-home-products',
        'footer-retail-home-products',
        'Retail & Home Products',
        '/retail-home-products',
      ),
      menuSubLink(
        'footer-home-personal-care',
        'footer-home-personal-care',
        'Home & Personal Care',
        '/home-personal-care',
      ),
      menuSubLink('footer-innovation', 'footer-innovation', 'Innovation', '/innovation'),
    ]),
  ]),
]

const seededLegalMenu = {
  _type: 'menuGroup',
  menuId: 'legal',
  title: 'Legal',
  links: [
    menuLink('footer-privacy-policy', 'footer-privacy-policy', 'Privacy Policy', '/privacy-policy'),
    menuLink(
      'footer-supplier-code-of-conduct',
      'footer-supplier-code-of-conduct',
      'Supplier Code of Conduct',
      '/supplier-code-of-conduct',
    ),
  ],
}

const seededOfficeLocations = [
  {
    _key: 'dubai-office',
    title: 'Albatha Holding',
    address: 'Level 22, Boulevard Plaza 1,\nDowntown Burj Khalifa, Dubai',
  },
  {
    _key: 'sharjah-office',
    address: 'Level 23, Albatha Tower\nBuhaira Corniche, Sharjah',
  },
]

const createdByBlackLink = {
  _type: 'cbLink',
  linkType: 'external',
  externalUrl: 'https://createdbyblack.com',
  openInNewTab: true,
}

function stripSystemFields(doc) {
  if (!doc) return {}

  const {_rev, _createdAt, _updatedAt, ...rest} = doc
  return rest
}

async function backfillPageFooterAppearance() {
  const query = `
    *[
      _type in $documentTypes &&
      !defined(footerAppearance.variant)
    ]{
      _id,
      _type,
      "title": coalesce(name, title, slug.current, slug, _id)
    }
  `

  const documents = await client.fetch(query, {documentTypes})

  if (!documents.length) {
    console.log('No page-like documents require footerAppearance backfill.')
    return
  }

  console.log(`Backfilling footerAppearance.variant for ${documents.length} document(s)...`)

  let transaction = client.transaction()

  for (const document of documents) {
    transaction = transaction.patch(document._id, {
      setIfMissing: {
        footerAppearance: {
          _type: 'pageFooterAppearance',
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

async function seedFooterSingleton() {
  const existingFooter = await client.fetch(`*[_id in ["drafts.siteFooter", "siteFooter"]][0]`)
  const footerId = existingFooter?._id || 'siteFooter'
  const baseFooter = stripSystemFields(existingFooter)

  const document = {
    ...baseFooter,
    _id: footerId,
    _type: 'footer',
    navigationGroups: baseFooter.navigationGroups || seededNavigationGroups,
    legalMenu: baseFooter.legalMenu || seededLegalMenu,
    showDefaultLegalLinks: baseFooter.showDefaultLegalLinks ?? false,
    copyrightText: baseFooter.copyrightText || '\u00A9 2026 Albatha Holding. Created by ',
    creditLabel: baseFooter.creditLabel || 'Black.',
    creditLink: baseFooter.creditLink || createdByBlackLink,
  }

  await client.createOrReplace(document)

  console.log(
    `Seeded footer singleton ${footerId} with ${
      existingFooter ? 'missing grouped navigation and legal defaults from' : ''
    } Figma footer values.`.trim(),
  )
}

async function seedSiteSettingsFooterDetails() {
  const existingSettings = await client.fetch(`*[_id in ["drafts.siteSettings", "siteSettings"]][0]`)
  const settingsId = existingSettings?._id || 'siteSettings'
  const baseSettings = stripSystemFields(existingSettings)

  const document = {
    ...baseSettings,
    _id: settingsId,
    _type: 'settings',
    companyName: baseSettings.companyName || 'Albatha Holding',
    officeLocations: baseSettings.officeLocations || seededOfficeLocations,
    contactPhone: baseSettings.contactPhone || '+971 4 371 1300',
    contactEmail: baseSettings.contactEmail || 'business@albatha.com',
  }

  await client.createOrReplace(document)

  console.log(`Seeded site settings ${settingsId} with missing footer contact details from Figma values.`)
}

async function main() {
  await backfillPageFooterAppearance()
  await seedFooterSingleton()
  await seedSiteSettingsFooterDetails()
  console.log('Footer seeding complete.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
