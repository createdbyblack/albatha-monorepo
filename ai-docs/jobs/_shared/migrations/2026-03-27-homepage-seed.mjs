import fs from 'node:fs'
import path from 'node:path'

import {createClient} from '@sanity/client'

const API_VERSION = process.env.SANITY_API_VERSION || '2026-03-27'
const ROOT_DIR = process.cwd()
const isDryRun = process.argv.includes('--dry-run')

const envFiles = [
  path.join(ROOT_DIR, '.env.local'),
  path.join(ROOT_DIR, 'studio', '.env.local'),
  path.join(ROOT_DIR, 'frontend', '.env.local'),
]

for (const filePath of envFiles) {
  hydrateEnvFile(filePath)
}

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET
const token =
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    [
      'Missing required environment variables.',
      'Expected SANITY project id, dataset, and write-capable token in one of the repo .env.local files.',
    ].join(' '),
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: API_VERSION,
  useCdn: false,
})

const HOME_PAGE_ID = 'homePage-en'
const EXPECTED_POST_IDS = [
  'post-agmc-pitstop360',
  'post-agmc-motor-city',
  'post-mpc-johnson-and-johnson',
  'post-gulf-international-levant',
]

const FIGMA_ASSETS = {
  aboutImage: {
    url: 'https://www.figma.com/api/mcp/asset/f80d78ee-9789-43a5-89fa-d8cde67f45ff',
    filename: 'homepage-about.jpg',
    alt: 'Workers in an industrial setting.',
  },
  sectorsImage: {
    url: 'https://www.figma.com/api/mcp/asset/d9f4b08b-57a5-42a1-b109-5aec2cbb2bfa',
    filename: 'homepage-sector-automotive.jpg',
    alt: 'AGMC automotive display.',
  },
  companiesImage: {
    url: 'https://www.figma.com/api/mcp/asset/39d9dddd-6c07-4652-af72-e01fd5d61b53',
    filename: 'homepage-companies.jpg',
    alt: 'Interior architectural view used in the companies section.',
  },
}

let keyCounter = 0
const uploadedAssets = new Map()

function hydrateEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const equalsIndex = line.indexOf('=')
    if (equalsIndex <= 0) continue

    const key = line.slice(0, equalsIndex).trim()
    const value = line.slice(equalsIndex + 1).trim()

    if (!key || process.env[key]) continue

    process.env[key] = stripWrappingQuotes(value)
  }
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function nextKey(prefix = 'k') {
  keyCounter += 1
  return `${prefix}${keyCounter.toString(36)}`
}

function contentLink(internalPath) {
  return {
    _type: 'cbLink',
    linkType: 'internal',
    internalTargetType: 'path',
    internalPath,
    openInNewTab: false,
  }
}

function heading(content, overrides = {}) {
  return {
    _type: 'cbHeading',
    _key: nextKey('heading'),
    content,
    level: 'h2',
    textAlign: 'left',
    placeholder: 'Heading...',
    ...overrides,
  }
}

function paragraph(content, overrides = {}) {
  return {
    _type: 'cbParagraph',
    _key: nextKey('paragraph'),
    content,
    dropCap: false,
    textAlign: 'left',
    placeholder: 'Start writing...',
    fontSize: 'md',
    ...overrides,
  }
}

function button(text, link, overrides = {}) {
  return {
    _type: 'cbButton',
    _key: nextKey('button'),
    text,
    url: '',
    linkTarget: '_self',
    size: 'md',
    variant: 'primary',
    actionType: 'link',
    link,
    ...overrides,
  }
}

function column(contents, overrides = {}) {
  return {
    _type: 'cbColumn',
    _key: nextKey('column'),
    width: 'auto',
    verticalAlignment: 'top',
    contents,
    ...overrides,
  }
}

function columnsRow(columns, overrides = {}) {
  return {
    _type: 'cbColumns',
    _key: nextKey('row'),
    isStackedOnMobile: true,
    verticalAlignment: 'top',
    gap: 'md',
    columns,
    ...overrides,
  }
}

function imageValue(assetId, alt) {
  if (!assetId) return undefined

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
    alt,
  }
}

async function uploadImageFromFigma(assetConfig) {
  if (!assetConfig?.url) return undefined
  if (uploadedAssets.has(assetConfig.url)) return uploadedAssets.get(assetConfig.url)

  const response = await fetch(assetConfig.url)
  if (!response.ok) {
    throw new Error(`Failed to fetch asset ${assetConfig.filename}: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const assetBuffer = Buffer.from(await response.arrayBuffer())
  const uploaded = await client.assets.upload('image', assetBuffer, {
    filename: assetConfig.filename,
    contentType,
  })

  uploadedAssets.set(assetConfig.url, uploaded)
  return uploaded
}

function aboutImageBlock(assetId, alt) {
  return {
    _type: 'homeAboutImageBlock',
    _key: nextKey('aboutimage'),
    image: imageValue(assetId, alt),
  }
}

function aboutStatsBlock(stats) {
  return {
    _type: 'homeAboutStatsBlock',
    _key: nextKey('aboutstats'),
    stats,
  }
}

function companyItemsBlock(items) {
  return {
    _type: 'homeCompanyItemsBlock',
    _key: nextKey('companyitems'),
    items,
  }
}

function sectorListItem(title, internalPath, isHighlighted = false) {
  return {
    _type: 'homeSectorListItem',
    _key: nextKey('sectorlistitem'),
    title,
    link: contentLink(internalPath),
    isHighlighted,
  }
}

function sectorListBlock(items) {
  return {
    _type: 'homeSectorListBlock',
    _key: nextKey('sectorlist'),
    items,
  }
}

function sectorItem(title, imageAssetId, internalPath) {
  return {
    _type: 'homeSectorItem',
    _key: nextKey('sector'),
    title,
    ctaLabel: 'About Us',
    image: imageValue(imageAssetId, FIGMA_ASSETS.sectorsImage.alt),
    link: contentLink(internalPath),
  }
}

function companyItem(name, category, internalPath) {
  return {
    _type: 'homeCompanyItem',
    _key: nextKey('company'),
    name,
    category,
    link: contentLink(internalPath),
  }
}

function normalizeHeroBackground(existingHeroSection) {
  if (existingHeroSection?.backgroundMedia) {
    return existingHeroSection.backgroundMedia
  }

  if (existingHeroSection?.backgroundImage) {
    return {
      _type: 'cbMedia',
      mediaType: 'image',
      image: {
        ...existingHeroSection.backgroundImage,
      },
    }
  }

  return undefined
}

function createFallbackBlogSection(postIds) {
  return {
    _type: 'homeBlogPostsSection',
    _key: nextKey('section'),
    contents: [],
    posts: postIds.map((postId) => ({
      _type: 'reference',
      _key: nextKey('postref'),
      _ref: postId,
    })),
    floatingActionLabel: 'Back to Top',
    floatingActionLink: contentLink('/#top'),
  }
}

async function buildHomepagePageBuilder(existingHomepage, fallbackPostIds) {
  const aboutImage = await uploadImageFromFigma(FIGMA_ASSETS.aboutImage)
  const sectorsImage = await uploadImageFromFigma(FIGMA_ASSETS.sectorsImage)
  const companiesImage = await uploadImageFromFigma(FIGMA_ASSETS.companiesImage)

  const existingHeroSection = existingHomepage?.pageBuilder?.find(
    (section) => section?._type === 'homeHeroSection',
  )
  const existingBlogSection = existingHomepage?.pageBuilder?.find(
    (section) => section?._type === 'homeBlogPostsSection',
  )
  const existingPostRefs =
    existingBlogSection?.posts?.filter((post) => Boolean(post?._ref)) || []
  const blogSectionPosts = existingPostRefs.length
    ? existingPostRefs
    : createFallbackBlogSection(fallbackPostIds).posts

  if (!blogSectionPosts.length) {
    throw new Error(
      'The homepage blog posts section has no existing post references and none of the expected curated post documents were found.',
    )
  }

  return [
    {
      _type: 'homeHeroSection',
      _key: nextKey('section'),
      backgroundMedia: normalizeHeroBackground(existingHeroSection),
      phrases: [
        {
          _type: 'homeHeroPhrase',
          _key: nextKey('phrase'),
          text: 'founded in 1959',
          placement: 'upperLeft',
        },
        {
          _type: 'homeHeroPhrase',
          _key: nextKey('phrase'),
          text: 'Al Batha = The Valley',
          placement: 'middleRight',
        },
        {
          _type: 'homeHeroPhrase',
          _key: nextKey('phrase'),
          text: 'rooted in the UAE',
          placement: 'lowerLeft',
        },
      ],
      contents: [
        columnsRow(
          [
            column([heading('Business with Values', {level: 'h1'})], {width: '1/2'}),
            column(
              [
                paragraph(
                  'Albatha is a Sharjah-born family of companies serving communities across the region, built on shared values and 70 years of trust.',
                  {fontSize: 'lg'},
                ),
              ],
              {width: '1/3', verticalAlignment: 'bottom'},
            ),
          ],
          {verticalAlignment: 'bottom', gap: 'lg'},
        ),
      ],
      floatingActionLabel: 'Know More',
      floatingActionLink: contentLink('/#about-us'),
    },
    {
      _type: 'homeAboutSection',
      _key: nextKey('section'),
      contents: [
        columnsRow(
          [
            column([aboutImageBlock(aboutImage?._id, FIGMA_ASSETS.aboutImage.alt)], {width: '1/2'}),
            column(
              [
                heading(
                  'Albatha is a UAE-founded business group built on the conviction that values and performance go hand in hand.',
                ),
                paragraph(
                  'With more than 10,000 people across 35 companies and multiple sectors across the GCC, we work to improve quality of life for our employees, partners, and communities. Every day, in every business.',
                  {fontSize: 'lg'},
                ),
                button('About Us', contentLink('/about'), {variant: 'primary', size: 'lg'}),
              ],
              {width: '1/2'},
            ),
          ],
          {gap: 'lg', verticalAlignment: 'center'},
        ),
        columnsRow([
          column([
            aboutStatsBlock([
              {
                _type: 'homeAboutStat',
                _key: nextKey('stat'),
                value: '1959',
                label: 'Founding Year',
                tone: 'outlineDark',
                height: 'md',
              },
              {
                _type: 'homeAboutStat',
                _key: nextKey('stat'),
                value: '200+',
                label: 'Global Partners',
                tone: 'blue',
                height: 'sm',
              },
              {
                _type: 'homeAboutStat',
                _key: nextKey('stat'),
                value: '10,000+',
                label: 'Employees',
                tone: 'dark',
                height: 'md',
              },
              {
                _type: 'homeAboutStat',
                _key: nextKey('stat'),
                value: '35',
                label: 'Group Companies',
                tone: 'outlineDark',
                height: 'md',
              },
              {
                _type: 'homeAboutStat',
                _key: nextKey('stat'),
                value: 'GCC',
                label: '& Beyond',
                tone: 'blue',
                height: 'sm',
              },
              {
                _type: 'homeAboutStat',
                _key: nextKey('stat'),
                value: '45+',
                label: 'Export Markets',
                tone: 'dark',
                height: 'lg',
              },
            ]),
          ]),
        ]),
      ],
    },
    {
      _type: 'homeSectorsSection',
      _key: nextKey('section'),
      contents: [
        columnsRow([
          column(
            [
              heading(
                'Albatha operates across seven sectors, all with one standard of excellence.',
              ),
            ],
            {width: 'auto'},
          ),
        ]),
        columnsRow(
          [
            column(
              [
                sectorListBlock([
                  sectorListItem('Home & Personal Care', '/home-personal-care'),
                  sectorListItem('Real Estate', '/real-estate'),
                  sectorListItem('Engineering', '/engineering'),
                  sectorListItem('Automotive', '/automotive', true),
                  sectorListItem('Healthcare', '/healthcare'),
                  sectorListItem('FMCG', '/fmcg'),
                  sectorListItem('Retail & Home Appliances', '/retail-home-appliances'),
                ]),
              ],
              {width: '2/3'},
            ),
            column(
              [sectorItem('Automotive', sectorsImage?._id, '/automotive')],
              {width: '1/3', verticalAlignment: 'bottom'},
            ),
          ],
          {gap: 'lg', verticalAlignment: 'bottom'},
        ),
      ],
    },
    {
      _type: 'homeCompaniesSection',
      _key: nextKey('section'),
      backgroundImage: imageValue(companiesImage?._id, FIGMA_ASSETS.companiesImage.alt),
      contents: [
        columnsRow([
          column(
            [
              paragraph(
                'Our companies are category leaders in their own right. Each brand has their own reputation, partnerships, and market presence built over decades.',
                {fontSize: 'lg', textAlign: 'center'},
              ),
            ],
            {width: 'auto'},
          ),
        ]),
        columnsRow([
          column([
            companyItemsBlock([
              companyItem('AGMC', 'Mobility Ecosystem', '/agmc'),
              companyItem('MPC', 'Healthcare Distribution', '/mpc'),
              companyItem('GECO', 'Engineering & Trading', '/geco'),
              companyItem('Super General', 'Home Appliances', '/super-general'),
              companyItem('ECity', 'Electronics Retail', '/ecity'),
              companyItem('AlBatha Real Estate', 'Property Development', '/albatha-real-estate'),
            ]),
          ]),
        ]),
      ],
    },
    existingBlogSection
      ? {
          ...existingBlogSection,
          _key: existingBlogSection._key || nextKey('section'),
          posts: blogSectionPosts,
        }
      : createFallbackBlogSection(fallbackPostIds),
  ]
}

async function main() {
  if (isDryRun) {
    console.log(`Dry run: would patch the existing ${HOME_PAGE_ID} homepage document.`)
    return
  }

  const existingHomepage = await client.getDocument(HOME_PAGE_ID)
  if (!existingHomepage?._id) {
    throw new Error(`Existing homepage document ${HOME_PAGE_ID} was not found.`)
  }

  const existingPosts = await client.fetch(`*[_type == "post" && _id in $ids]{_id}`, {
    ids: EXPECTED_POST_IDS,
  })
  const fallbackPostIds = existingPosts.map((post) => post._id).filter(Boolean)
  const pageBuilder = await buildHomepagePageBuilder(existingHomepage, fallbackPostIds)

  await client.patch(HOME_PAGE_ID).set({pageBuilder}).commit()

  console.log(`Patched homepage document ${HOME_PAGE_ID}.`)
  console.log(
    `Post references retained: ${fallbackPostIds.length ? fallbackPostIds.join(', ') : 'existing section refs only'}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
