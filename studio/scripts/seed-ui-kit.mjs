import {getCliClient} from 'sanity/cli'

const API_VERSION = '2025-09-25'
const DEFAULT_LANGUAGE = 'en'
const DEFAULT_HOME_ID = `homePage-${DEFAULT_LANGUAGE}`
const PLACEHOLDER_IMAGE_URL =
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80'
const PLACEHOLDER_VIDEO_URL =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const args = new Set(process.argv.slice(2))
const isPublished = args.has('--published')
const language = readFlagValue('--language') || DEFAULT_LANGUAGE

const client = getCliClient({apiVersion: API_VERSION})

let keyCounter = 0

function readFlagValue(flagName) {
  const argv = process.argv.slice(2)
  const flagIndex = argv.indexOf(flagName)
  if (flagIndex >= 0 && argv[flagIndex + 1]) {
    return argv[flagIndex + 1]
  }

  const prefixedArg = argv.find((arg) => arg.startsWith(`${flagName}=`))
  if (prefixedArg) {
    return prefixedArg.slice(flagName.length + 1)
  }

  return undefined
}

function nextKey(prefix = 'k') {
  keyCounter += 1
  return `${prefix}${keyCounter.toString(36)}`
}

function portableText(text) {
  return [
    {
      _type: 'block',
      _key: nextKey('pte'),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: nextKey('span'),
          marks: [],
          text,
        },
      ],
    },
  ]
}

function heading(content, overrides = {}) {
  return {
    _type: 'cbHeading',
    _key: nextKey('heading'),
    content,
    level: 'h3',
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

function button(text, overrides = {}) {
  return {
    _type: 'cbButton',
    _key: nextKey('button'),
    text,
    url: 'https://example.com',
    linkTarget: '_self',
    size: 'md',
    variant: 'primary',
    actionType: 'button',
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

function sectionRow(title, body) {
  return columnsRow([
    column(
      [
        heading(title, {level: 'h2'}),
        paragraph(body, {fontSize: 'lg'}),
      ],
      {width: 'auto'},
    ),
  ])
}

function sampleRow({
  label,
  description,
  sampleBlock,
  rowOverrides = {},
  sampleColumnOverrides = {},
  labelColumnOverrides = {},
  extraColumns = [],
}) {
  return columnsRow(
    [
      column(
        [
          heading(label, {level: 'h4'}),
          paragraph(description, {fontSize: 'sm'}),
        ],
        {width: '1/3', ...labelColumnOverrides},
      ),
      column([sampleBlock], {width: '2/3', ...sampleColumnOverrides}),
      ...extraColumns,
    ],
    rowOverrides,
  )
}

function createOverviewRows() {
  return [
    sectionRow(
      'Homepage Block Map',
      'Generated block inventory for the homepage editor. Each sample row isolates one available block or one attribute value so you can inspect the current schema shape directly inside Sanity.',
    ),
  ]
}

function createRowSamples() {
  return [
    sectionRow(
      'Rows',
      'Top-level homepage items are rows (`cbColumns`). These samples vary the row fields that control layout.',
    ),
    sampleRow({
      label: 'Row: base',
      description: 'Default row configuration with two columns.',
      sampleBlock: paragraph('Example content inside the default row.'),
    }),
    ...[true, false].map((isStackedOnMobile) =>
      sampleRow({
        label: `Row: isStackedOnMobile = ${String(isStackedOnMobile)}`,
        description: 'Shows the row stack-on-mobile toggle value.',
        sampleBlock: paragraph(`The row field isStackedOnMobile is set to ${String(isStackedOnMobile)}.`),
        rowOverrides: {isStackedOnMobile},
      }),
    ),
    ...['top', 'center', 'bottom'].map((verticalAlignment) =>
      sampleRow({
        label: `Row: verticalAlignment = ${verticalAlignment}`,
        description: 'Shows the row vertical alignment value.',
        sampleBlock: paragraph(`The row verticalAlignment is set to ${verticalAlignment}.`, {
          fontSize: verticalAlignment === 'bottom' ? 'xl' : 'md',
        }),
        rowOverrides: {verticalAlignment},
      }),
    ),
    ...['none', 'sm', 'md', 'lg'].map((gap) =>
      sampleRow({
        label: `Row: gap = ${gap}`,
        description: 'Shows the row gap setting.',
        sampleBlock: paragraph(`The row gap is set to ${gap}.`),
        rowOverrides: {gap},
      }),
    ),
  ]
}

function createColumnSamples() {
  return [
    sectionRow(
      'Columns',
      'Columns live inside rows. These samples vary width and vertical alignment on the actual content column.',
    ),
    ...['auto', '1/2', '1/3', '1/4', '2/3', '3/4'].map((width) =>
      columnsRow([
        column(
          [
            heading(`Column width = ${width}`, {level: 'h4'}),
            paragraph('The next two columns show the selected width beside an auto sibling.', {
              fontSize: 'sm',
            }),
          ],
          {width: '1/3'},
        ),
        column(
          [
            paragraph(`This sample column width is ${width}.`),
            button('Width sample button'),
          ],
          {width},
        ),
        column([paragraph('Sibling auto column for comparison.')], {width: 'auto'}),
      ]),
    ),
    ...['top', 'center', 'bottom'].map((verticalAlignment) =>
      columnsRow([
        column(
          [
            heading(`Column verticalAlignment = ${verticalAlignment}`, {level: 'h4'}),
            paragraph('The middle column holds the selected vertical alignment value.', {
              fontSize: 'sm',
            }),
          ],
          {width: '1/3'},
        ),
        column(
          [
            paragraph(`This column verticalAlignment is ${verticalAlignment}.`),
            paragraph('It intentionally has less content.'),
          ],
          {width: '1/3', verticalAlignment},
        ),
        column(
          [
            paragraph('Sibling column with more content for comparison.'),
            paragraph('Additional content line one.'),
            paragraph('Additional content line two.'),
          ],
          {width: '1/3'},
        ),
      ]),
    ),
  ]
}

function createAtomSamples() {
  const rows = [
    sectionRow(
      'Atomic Blocks',
      'These are the direct leaf-level blocks available in column contents.',
    ),
    sampleRow({
      label: 'Reusable Pattern',
      description: 'Single sample for `cbBlock.ref`.',
      sampleBlock: {
        _type: 'cbBlock',
        _key: nextKey('reusable'),
        ref: 'demo-pattern',
      },
    }),
  ]

  rows.push(
    ...['button', 'link'].map((actionType) =>
      sampleRow({
        label: `Button: actionType = ${actionType}`,
        description: 'Button block action type sample.',
        sampleBlock: button(`Action ${actionType}`, {
          actionType,
          ...(actionType === 'link'
            ? {
                link: {
                  _type: 'cbLink',
                  linkType: 'internal',
                  internalTargetType: 'path',
                  internalPath: '/block-map',
                },
                url: '',
              }
            : {}),
        }),
      }),
    ),
  )

  rows.push(
    ...['_self', '_blank'].map((linkTarget) =>
      sampleRow({
        label: `Button: linkTarget = ${linkTarget}`,
        description: 'Button link target sample.',
        sampleBlock: button(`Target ${linkTarget}`, {linkTarget}),
      }),
    ),
  )

  rows.push(
    ...['sm', 'md', 'lg'].map((size) =>
      sampleRow({
        label: `Button: size = ${size}`,
        description: 'Button size sample.',
        sampleBlock: button(`Size ${size}`, {size}),
      }),
    ),
  )

  rows.push(
    ...['primary', 'secondary', 'ghost'].map((variant) =>
      sampleRow({
        label: `Button: variant = ${variant}`,
        description: 'Button variant sample.',
        sampleBlock: button(`Variant ${variant}`, {variant}),
      }),
    ),
  )

  rows.push(
    ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) =>
      sampleRow({
        label: `Heading: level = ${level}`,
        description: 'Heading level sample.',
        sampleBlock: heading(`Heading sample ${level.toUpperCase()}`, {level}),
      }),
    ),
  )

  rows.push(
    ...['left', 'center', 'right'].map((textAlign) =>
      sampleRow({
        label: `Heading: textAlign = ${textAlign}`,
        description: 'Heading text alignment sample.',
        sampleBlock: heading(`Heading aligned ${textAlign}`, {textAlign}),
      }),
    ),
  )

  rows.push(
    ...[false, true].map((dropCap) =>
      sampleRow({
        label: `Paragraph: dropCap = ${String(dropCap)}`,
        description: 'Paragraph drop-cap sample.',
        sampleBlock: paragraph(
          'This paragraph block exists to show the dropCap attribute value in the editor.',
          {dropCap},
        ),
      }),
    ),
  )

  rows.push(
    ...['left', 'center', 'right'].map((textAlign) =>
      sampleRow({
        label: `Paragraph: textAlign = ${textAlign}`,
        description: 'Paragraph text alignment sample.',
        sampleBlock: paragraph(`Paragraph aligned ${textAlign}.`, {textAlign}),
      }),
    ),
  )

  rows.push(
    ...['sm', 'md', 'lg', 'xl'].map((fontSize) =>
      sampleRow({
        label: `Paragraph: fontSize = ${fontSize}`,
        description: 'Paragraph font size sample.',
        sampleBlock: paragraph(`Paragraph font size ${fontSize}.`, {fontSize}),
      }),
    ),
  )

  rows.push(
    sampleRow({
      label: 'WYSIWYG',
      description: 'Single `cbWysiwyg` sample.',
      sampleBlock: {
        _type: 'cbWysiwyg',
        _key: nextKey('wysiwyg'),
        content: portableText(
          'This is a portable text sample for the WYSIWYG block. It is included once because the block has no enumerated options.',
        ),
      },
    }),
  )

  rows.push(
    sampleRow({
      label: 'HTML',
      description: 'Single `cbHtml` sample.',
      sampleBlock: {
        _type: 'cbHtml',
        _key: nextKey('html'),
        content: '<div><strong>HTML block sample</strong><p>Custom HTML content.</p></div>',
      },
    }),
  )

  rows.push(
    ...['_self', '_blank'].map((linkTarget) =>
      sampleRow({
        label: `Image: linkTarget = ${linkTarget}`,
        description: 'Image block link target sample.',
        sampleBlock: {
          _type: 'cbImage',
          _key: nextKey('image'),
          url: PLACEHOLDER_IMAGE_URL,
          alt: 'Landscape placeholder',
          caption: 'Image link target sample',
          href: 'https://example.com',
          linkTarget,
          aspectRatio: '16/9',
          scale: 'cover',
          sizeSlug: 'large',
        },
      }),
    ),
  )

  rows.push(
    ...['auto', '1/1', '4/3', '16/9', '3/4', '9/16'].map((aspectRatio) =>
      sampleRow({
        label: `Image: aspectRatio = ${aspectRatio}`,
        description: 'Image aspect ratio sample.',
        sampleBlock: {
          _type: 'cbImage',
          _key: nextKey('image'),
          url: PLACEHOLDER_IMAGE_URL,
          alt: 'Landscape placeholder',
          caption: `Aspect ratio ${aspectRatio}`,
          href: '',
          linkTarget: '_self',
          aspectRatio,
          scale: 'cover',
          sizeSlug: 'large',
        },
      }),
    ),
  )

  rows.push(
    ...['cover', 'contain'].map((scale) =>
      sampleRow({
        label: `Image: scale = ${scale}`,
        description: 'Image scale sample.',
        sampleBlock: {
          _type: 'cbImage',
          _key: nextKey('image'),
          url: PLACEHOLDER_IMAGE_URL,
          alt: 'Landscape placeholder',
          caption: `Scale ${scale}`,
          href: '',
          linkTarget: '_self',
          aspectRatio: '16/9',
          scale,
          sizeSlug: 'large',
        },
      }),
    ),
  )

  rows.push(
    sampleRow({
      label: 'Shortcode',
      description: 'Single `cbShortcode` sample.',
      sampleBlock: {
        _type: 'cbShortcode',
        _key: nextKey('shortcode'),
        text: '[demo-shortcode id=\"homepage-block-map\"]',
      },
    }),
  )

  rows.push(
    ...['sm', 'md', 'lg'].map((width) =>
      sampleRow({
        label: `Site Logo: width = ${width}`,
        description: 'Site logo width sample.',
        sampleBlock: {
          _type: 'cbSiteLogo',
          _key: nextKey('logo'),
          width,
          isLink: true,
          linkTarget: '_self',
        },
      }),
    ),
  )

  rows.push(
    ...[true, false].map((isLink) =>
      sampleRow({
        label: `Site Logo: isLink = ${String(isLink)}`,
        description: 'Site logo home-link sample.',
        sampleBlock: {
          _type: 'cbSiteLogo',
          _key: nextKey('logo'),
          width: 'md',
          isLink,
          linkTarget: '_self',
        },
      }),
    ),
  )

  rows.push(
    ...['_self', '_blank'].map((linkTarget) =>
      sampleRow({
        label: `Site Logo: linkTarget = ${linkTarget}`,
        description: 'Site logo link target sample.',
        sampleBlock: {
          _type: 'cbSiteLogo',
          _key: nextKey('logo'),
          width: 'md',
          isLink: true,
          linkTarget,
        },
      }),
    ),
  )

  rows.push(
    ...[false, true].map((autoplay) =>
      sampleRow({
        label: `Video: autoplay = ${String(autoplay)}`,
        description: 'Video autoplay sample.',
        sampleBlock: {
          _type: 'cbVideo',
          _key: nextKey('video'),
          src: PLACEHOLDER_VIDEO_URL,
          poster: PLACEHOLDER_IMAGE_URL,
          caption: 'Video autoplay sample',
          autoplay,
          loop: false,
          muted: autoplay ? true : false,
          controls: true,
          playsInline: false,
        },
      }),
    ),
  )

  rows.push(
    ...[false, true].map((loop) =>
      sampleRow({
        label: `Video: loop = ${String(loop)}`,
        description: 'Video loop sample.',
        sampleBlock: {
          _type: 'cbVideo',
          _key: nextKey('video'),
          src: PLACEHOLDER_VIDEO_URL,
          poster: PLACEHOLDER_IMAGE_URL,
          caption: 'Video loop sample',
          autoplay: false,
          loop,
          muted: false,
          controls: true,
          playsInline: false,
        },
      }),
    ),
  )

  rows.push(
    ...[false, true].map((muted) =>
      sampleRow({
        label: `Video: muted = ${String(muted)}`,
        description: 'Video muted sample.',
        sampleBlock: {
          _type: 'cbVideo',
          _key: nextKey('video'),
          src: PLACEHOLDER_VIDEO_URL,
          poster: PLACEHOLDER_IMAGE_URL,
          caption: 'Video muted sample',
          autoplay: false,
          loop: false,
          muted,
          controls: true,
          playsInline: false,
        },
      }),
    ),
  )

  rows.push(
    ...[true, false].map((controls) =>
      sampleRow({
        label: `Video: controls = ${String(controls)}`,
        description: 'Video controls sample.',
        sampleBlock: {
          _type: 'cbVideo',
          _key: nextKey('video'),
          src: PLACEHOLDER_VIDEO_URL,
          poster: PLACEHOLDER_IMAGE_URL,
          caption: 'Video controls sample',
          autoplay: false,
          loop: false,
          muted: false,
          controls,
          playsInline: false,
        },
      }),
    ),
  )

  rows.push(
    ...[false, true].map((playsInline) =>
      sampleRow({
        label: `Video: playsInline = ${String(playsInline)}`,
        description: 'Video inline playback sample.',
        sampleBlock: {
          _type: 'cbVideo',
          _key: nextKey('video'),
          src: PLACEHOLDER_VIDEO_URL,
          poster: PLACEHOLDER_IMAGE_URL,
          caption: 'Video playsInline sample',
          autoplay: false,
          loop: false,
          muted: false,
          controls: true,
          playsInline,
        },
      }),
    ),
  )

  return rows
}

function createContainerSamples() {
  const rows = [
    sectionRow(
      'Container Blocks',
      'These blocks own nested arrays and represent grouped editor structures.',
    ),
  ]

  rows.push(
    ...['left', 'center', 'right'].map((align) =>
      sampleRow({
        label: `Buttons Group: align = ${align}`,
        description: 'Buttons group alignment sample.',
        sampleBlock: {
          _type: 'cbButtons',
          _key: nextKey('buttons'),
          align,
          orientation: 'horizontal',
          items: [
            button('Primary action'),
            button('Secondary action', {variant: 'secondary'}),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['horizontal', 'vertical'].map((orientation) =>
      sampleRow({
        label: `Buttons Group: orientation = ${orientation}`,
        description: 'Buttons group orientation sample.',
        sampleBlock: {
          _type: 'cbButtons',
          _key: nextKey('buttons'),
          align: 'left',
          orientation,
          items: [
            button('Action one'),
            button('Action two', {variant: 'ghost'}),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['div', 'section', 'article', 'aside', 'header', 'footer', 'main'].map((tagName) =>
      sampleRow({
        label: `Group: tagName = ${tagName}`,
        description: 'Group wrapper tag sample.',
        sampleBlock: {
          _type: 'cbGroup',
          _key: nextKey('group'),
          tagName,
          layout: 'default',
          align: 'left',
          contents: [
            heading(`Group using <${tagName}>`, {level: 'h4'}),
            paragraph('Nested group content sample.'),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['default', 'constrained', 'flex', 'grid'].map((layout) =>
      sampleRow({
        label: `Group: layout = ${layout}`,
        description: 'Group layout sample.',
        sampleBlock: {
          _type: 'cbGroup',
          _key: nextKey('group'),
          tagName: 'div',
          layout,
          align: 'left',
          contents: [
            heading(`Group layout ${layout}`, {level: 'h4'}),
            paragraph('Nested group content sample.'),
            button('Nested button'),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['left', 'center', 'right', 'wide', 'full'].map((align) =>
      sampleRow({
        label: `Group: align = ${align}`,
        description: 'Group alignment sample.',
        sampleBlock: {
          _type: 'cbGroup',
          _key: nextKey('group'),
          tagName: 'div',
          layout: 'default',
          align,
          contents: [
            heading(`Group align ${align}`, {level: 'h4'}),
            paragraph('Nested group content sample.'),
          ],
        },
      }),
    ),
  )

  rows.push(
    sampleRow({
      label: 'List: ordered = false',
      description: 'Unordered list sample.',
      sampleBlock: {
        _type: 'cbList',
        _key: nextKey('list'),
        ordered: false,
        start: 1,
        reversed: false,
        items: [
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'First list item'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Second list item'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Third list item'},
        ],
      },
    }),
    sampleRow({
      label: 'List: ordered = true',
      description: 'Ordered list sample.',
      sampleBlock: {
        _type: 'cbList',
        _key: nextKey('list'),
        ordered: true,
        start: 1,
        reversed: false,
        items: [
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'First ordered item'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Second ordered item'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Third ordered item'},
        ],
      },
    }),
    sampleRow({
      label: 'List: reversed = false',
      description: 'Ordered list with reversed disabled.',
      sampleBlock: {
        _type: 'cbList',
        _key: nextKey('list'),
        ordered: true,
        start: 1,
        reversed: false,
        items: [
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Ordered item one'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Ordered item two'},
        ],
      },
    }),
    sampleRow({
      label: 'List: reversed = true',
      description: 'Ordered list with reversed enabled.',
      sampleBlock: {
        _type: 'cbList',
        _key: nextKey('list'),
        ordered: true,
        start: 1,
        reversed: true,
        items: [
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Ordered item one'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Ordered item two'},
        ],
      },
    }),
    sampleRow({
      label: 'List: start = 3',
      description: 'Ordered list start value sample.',
      sampleBlock: {
        _type: 'cbList',
        _key: nextKey('list'),
        ordered: true,
        start: 3,
        reversed: false,
        items: [
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Starts at three'},
          {_type: 'cbListItem', _key: nextKey('listItem'), content: 'Then four'},
        ],
      },
    }),
  )

  rows.push(
    ...['never', 'mobile', 'always'].map((overlayMenu) =>
      sampleRow({
        label: `Navigation: overlayMenu = ${overlayMenu}`,
        description: 'Navigation overlay menu sample.',
        sampleBlock: {
          _type: 'cbNavigation',
          _key: nextKey('navigation'),
          overlayMenu,
          openSubmenusOnClick: false,
          showSubmenuIcon: true,
          icon: 'menu',
          layout: 'horizontal',
          links: [
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'Home',
              url: '/',
              opensInNewTab: false,
              description: 'Top-level home link',
              type: 'custom',
            },
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'Block Map',
              url: '',
              opensInNewTab: false,
              description: 'Internal path sample',
              type: 'page',
              link: {
                _type: 'cbLink',
                linkType: 'internal',
                internalTargetType: 'path',
                internalPath: '/block-map',
              },
            },
          ],
        },
      }),
    ),
  )

  rows.push(
    ...[false, true].map((openSubmenusOnClick) =>
      sampleRow({
        label: `Navigation: openSubmenusOnClick = ${String(openSubmenusOnClick)}`,
        description: 'Navigation submenu interaction sample.',
        sampleBlock: {
          _type: 'cbNavigation',
          _key: nextKey('navigation'),
          overlayMenu: 'mobile',
          openSubmenusOnClick,
          showSubmenuIcon: true,
          icon: 'menu',
          layout: 'horizontal',
          links: [
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'Products',
              url: '/products',
              opensInNewTab: false,
              description: 'Sample navigation item',
              type: 'custom',
            },
          ],
        },
      }),
    ),
  )

  rows.push(
    ...[true, false].map((showSubmenuIcon) =>
      sampleRow({
        label: `Navigation: showSubmenuIcon = ${String(showSubmenuIcon)}`,
        description: 'Navigation submenu icon sample.',
        sampleBlock: {
          _type: 'cbNavigation',
          _key: nextKey('navigation'),
          overlayMenu: 'mobile',
          openSubmenusOnClick: false,
          showSubmenuIcon,
          icon: 'menu',
          layout: 'horizontal',
          links: [
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'Services',
              url: '/services',
              opensInNewTab: false,
              description: 'Sample navigation item',
              type: 'custom',
            },
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['menu', 'dots'].map((icon) =>
      sampleRow({
        label: `Navigation: icon = ${icon}`,
        description: 'Navigation icon sample.',
        sampleBlock: {
          _type: 'cbNavigation',
          _key: nextKey('navigation'),
          overlayMenu: 'mobile',
          openSubmenusOnClick: false,
          showSubmenuIcon: true,
          icon,
          layout: 'horizontal',
          links: [
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'About',
              url: '/about',
              opensInNewTab: false,
              description: 'Sample navigation item',
              type: 'custom',
            },
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['horizontal', 'vertical'].map((layout) =>
      sampleRow({
        label: `Navigation: layout = ${layout}`,
        description: 'Navigation layout sample.',
        sampleBlock: {
          _type: 'cbNavigation',
          _key: nextKey('navigation'),
          overlayMenu: 'mobile',
          openSubmenusOnClick: false,
          showSubmenuIcon: true,
          icon: 'menu',
          layout,
          links: [
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'Contact',
              url: '/contact',
              opensInNewTab: false,
              description: 'Sample navigation item',
              type: 'custom',
            },
            {
              _type: 'cbNavigationLink',
              _key: nextKey('navLink'),
              label: 'External link',
              url: 'https://example.com',
              opensInNewTab: true,
              description: 'External sample navigation item',
              type: 'custom',
              link: {
                _type: 'cbLink',
                linkType: 'external',
                externalUrl: 'https://example.com',
                openInNewTab: true,
              },
            },
          ],
        },
      }),
    ),
  )

  rows.push(
    sampleRow({
      label: 'Nested Row (`cbColumns`) inside a Column',
      description: 'Shows that rows are also available as nested composable blocks within column contents.',
      sampleBlock: {
        _type: 'cbColumns',
        _key: nextKey('nestedRow'),
        isStackedOnMobile: true,
        verticalAlignment: 'top',
        gap: 'sm',
        columns: [
          column([paragraph('Nested row column one.')], {width: '1/2'}),
          column([paragraph('Nested row column two.')], {width: '1/2'}),
        ],
      },
    }),
  )

  rows.push(
    sampleRow({
      label: 'Cover: base',
      description: 'Base cover sample with image background.',
      sampleBlock: {
        _type: 'cbCover',
        _key: nextKey('cover'),
        url: PLACEHOLDER_IMAGE_URL,
        backgroundType: 'image',
        alt: 'Cover placeholder image',
        dimRatio: 50,
        overlayColor: '#000000',
        contentPosition: 'center-center',
        minHeight: 'md',
        hasParallax: false,
        contents: [
          heading('Cover sample', {level: 'h4'}),
          paragraph('Foreground content inside the cover block.'),
          button('Cover CTA'),
        ],
      },
    }),
  )

  rows.push(
    ...['image', 'video'].map((backgroundType) =>
      sampleRow({
        label: `Cover: backgroundType = ${backgroundType}`,
        description: 'Cover background media type sample.',
        sampleBlock: {
          _type: 'cbCover',
          _key: nextKey('cover'),
          url: backgroundType === 'video' ? PLACEHOLDER_VIDEO_URL : PLACEHOLDER_IMAGE_URL,
          backgroundType,
          alt: `Cover ${backgroundType} background`,
          dimRatio: 50,
          overlayColor: '#000000',
          contentPosition: 'center-center',
          minHeight: 'md',
          hasParallax: false,
          contents: [
            heading(`Cover ${backgroundType}`, {level: 'h4'}),
            paragraph('Foreground content inside the cover block.'),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...[
      'top-left',
      'top-center',
      'top-right',
      'center-left',
      'center-center',
      'center-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ].map((contentPosition) =>
      sampleRow({
        label: `Cover: contentPosition = ${contentPosition}`,
        description: 'Cover foreground content position sample.',
        sampleBlock: {
          _type: 'cbCover',
          _key: nextKey('cover'),
          url: PLACEHOLDER_IMAGE_URL,
          backgroundType: 'image',
          alt: 'Cover placeholder image',
          dimRatio: 50,
          overlayColor: '#000000',
          contentPosition,
          minHeight: 'md',
          hasParallax: false,
          contents: [
            heading(contentPosition, {level: 'h4'}),
            paragraph('Foreground content position sample.'),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...['sm', 'md', 'lg', 'full'].map((minHeight) =>
      sampleRow({
        label: `Cover: minHeight = ${minHeight}`,
        description: 'Cover minimum height sample.',
        sampleBlock: {
          _type: 'cbCover',
          _key: nextKey('cover'),
          url: PLACEHOLDER_IMAGE_URL,
          backgroundType: 'image',
          alt: 'Cover placeholder image',
          dimRatio: 50,
          overlayColor: '#000000',
          contentPosition: 'center-center',
          minHeight,
          hasParallax: false,
          contents: [
            heading(`Cover height ${minHeight}`, {level: 'h4'}),
            paragraph('Foreground content inside the cover block.'),
          ],
        },
      }),
    ),
  )

  rows.push(
    ...[false, true].map((hasParallax) =>
      sampleRow({
        label: `Cover: hasParallax = ${String(hasParallax)}`,
        description: 'Cover parallax sample.',
        sampleBlock: {
          _type: 'cbCover',
          _key: nextKey('cover'),
          url: PLACEHOLDER_IMAGE_URL,
          backgroundType: 'image',
          alt: 'Cover placeholder image',
          dimRatio: 50,
          overlayColor: '#000000',
          contentPosition: 'center-center',
          minHeight: 'md',
          hasParallax,
          contents: [
            heading(`Cover parallax ${String(hasParallax)}`, {level: 'h4'}),
            paragraph('Foreground content inside the cover block.'),
          ],
        },
      }),
    ),
  )

  return rows
}

function buildPageBuilder() {
  return [
    ...createOverviewRows(),
    ...createRowSamples(),
    ...createColumnSamples(),
    ...createAtomSamples(),
    ...createContainerSamples(),
  ]
}

function stripSystemFields(doc) {
  if (!doc) return {}

  const {
    _rev,
    _createdAt,
    _updatedAt,
    _originalId,
    ...rest
  } = doc

  return rest
}

async function resolveTargetDocument() {
  const existing = await client.fetch(
    `*[
      _type == "homePage" &&
      coalesce(language, "en") == $language
    ] | order(_updatedAt desc)[0]`,
    {language},
  )

  if (!existing) {
    const baseId = language === DEFAULT_LANGUAGE ? DEFAULT_HOME_ID : `homePage-${language}`
    return {
      existing: null,
      publishedId: baseId,
      targetId: isPublished ? baseId : `drafts.${baseId}`,
    }
  }

  const publishedId = String(existing._id).replace(/^drafts\./, '')

  return {
    existing,
    publishedId,
    targetId: isPublished ? publishedId : `drafts.${publishedId}`,
  }
}

async function main() {
  const {existing, targetId, publishedId} = await resolveTargetDocument()
  const pageBuilder = buildPageBuilder()
  const baseDoc = stripSystemFields(existing)

  const document = {
    ...baseDoc,
    _id: targetId,
    _type: 'homePage',
    name: baseDoc.name || 'Home',
    language,
    pageBuilder,
  }

  await client.createOrReplace(document)

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        mode: isPublished ? 'published' : 'draft',
        language,
        targetId,
        publishedId,
        rowsCreated: pageBuilder.length,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
