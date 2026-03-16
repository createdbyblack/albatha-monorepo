# Gutenberg Blocks — CMS Field Reference

> Fields are trimmed to only what the CMS needs to store. React handles all style/token resolution internally.

---

## `core/block` — Reusable Pattern

| Field | Default | Renders As |
|---|---|---|
| `ref` | `null` | component lookup ID |

---

## `core/button`

| Field | Default | Renders As |
|---|---|---|
| `text` | `""` | button label |
| `url` | `""` | `href` |
| `linkTarget` | `"_self"` | `target` attr |
| `size` | `"md"` | padding + font-size via size map |
| `variant` | `"primary"` | bg/text color from theme token |

**Size map:**
```
sm → padding: 0.5rem 1rem,    font-size: 0.75rem
md → padding: 0.875rem 1.5rem, font-size: 0.875rem
lg → padding: 1rem 2rem,      font-size: 1rem
```

---

## `core/buttons`

| Field | Default | Renders As |
|---|---|---|
| `align` | `"left"` | `justify-content: flex-start` |
| `orientation` | `"horizontal"` | `flex-direction: row` |

**Align map:**
```
left   → justify-content: flex-start
center → justify-content: center
right  → justify-content: flex-end
```

---

## `core/column`

| Field | Default | Renders As |
|---|---|---|
| `width` | `"auto"` | `flex: 1` |
| `verticalAlignment` | `"top"` | `align-self: flex-start` |

**Width map:**
```
auto → flex: 1
1/2  → width: 50%
1/3  → width: 33.333%
1/4  → width: 25%
2/3  → width: 66.666%
3/4  → width: 75%
```

**Vertical alignment map:**
```
top    → align-self: flex-start
center → align-self: center
bottom → align-self: flex-end
```

---

## `core/columns`

| Field | Default | Renders As |
|---|---|---|
| `isStackedOnMobile` | `true` | `flex-wrap: wrap` below breakpoint |
| `verticalAlignment` | `"top"` | `align-items: flex-start` |
| `gap` | `"md"` | `gap: 1.5rem` |

**Gap map:**
```
none → gap: 0
sm   → gap: 0.75rem
md   → gap: 1.5rem
lg   → gap: 2.5rem
```

---

## `core/cover`

| Field | Default | Renders As |
|---|---|---|
| `url` | `""` | `background-image` or `<video src>` |
| `backgroundType` | `"image"` | `div` with bg-image or `<video>` element |
| `alt` | `""` | `aria-label` on wrapper |
| `dimRatio` | `50` | overlay opacity |
| `overlayColor` | `"#000000"` | overlay div bg color |
| `contentPosition` | `"center-center"` | `align-items` + `justify-content` |
| `minHeight` | `"md"` | `min-height: 400px` |
| `hasParallax` | `false` | `background-attachment: fixed` |

**dimRatio map:**
```
0   → rgba(0,0,0,0)
10  → rgba(0,0,0,0.1)
50  → rgba(0,0,0,0.5)   ← default
100 → rgba(0,0,0,1)
```

**contentPosition map:**
```
top-left      → align-items: flex-start, justify-content: flex-start
top-center    → align-items: flex-start, justify-content: center
top-right     → align-items: flex-start, justify-content: flex-end
center-left   → align-items: center,     justify-content: flex-start
center-center → align-items: center,     justify-content: center      ← default
center-right  → align-items: center,     justify-content: flex-end
bottom-left   → align-items: flex-end,   justify-content: flex-start
bottom-center → align-items: flex-end,   justify-content: center
bottom-right  → align-items: flex-end,   justify-content: flex-end
```

**minHeight map:**
```
sm   → min-height: 200px
md   → min-height: 400px   ← default
lg   → min-height: 600px
full → min-height: 100vh
```

---

## `core/group`

| Field | Default | Renders As |
|---|---|---|
| `tagName` | `"div"` | HTML element |
| `layout` | `"default"` | `display: block` |
| `align` | `"left"` | margin behavior |

**Layout map:**
```
default     → display: block
constrained → display: block, max-width: var(--content-width), margin: 0 auto
flex        → display: flex
grid        → display: grid
```

**Align map:**
```
left   → margin-right: auto
center → margin: 0 auto
right  → margin-left: auto
wide   → max-width: var(--wide-width), margin: 0 auto
full   → max-width: 100%
```

---

## `core/heading`

| Field | Default | Renders As |
|---|---|---|
| `content` | `""` | inner text |
| `level` | `2` | `<h2>` |
| `textAlign` | `"left"` | `text-align: left` |
| `placeholder` | `"Heading..."` | placeholder attr |

---

## `core/html`

| Field | Default | Renders As |
|---|---|---|
| `content` | `""` | `dangerouslySetInnerHTML` |

---

## `core/image`

| Field | Default | Renders As |
|---|---|---|
| `url` | `""` | `<img src>` |
| `alt` | `""` | `<img alt>` |
| `caption` | `""` | `<figcaption>` |
| `href` | `""` | wraps `<img>` in `<a>` |
| `linkTarget` | `"_self"` | `<a target>` |
| `aspectRatio` | `"auto"` | `aspect-ratio` CSS |
| `scale` | `"cover"` | `object-fit` |
| `sizeSlug` | `"large"` | src variant from media library |

**aspectRatio map:**
```
auto → aspect-ratio: unset
1/1  → aspect-ratio: 1 / 1
4/3  → aspect-ratio: 4 / 3
16/9 → aspect-ratio: 16 / 9
3/4  → aspect-ratio: 3 / 4
9/16 → aspect-ratio: 9 / 16
```

---

## `core/list`

| Field | Default | Renders As |
|---|---|---|
| `ordered` | `false` | `<ul>` or `<ol>` |
| `values` | `[]` | inner `<li>` items |
| `start` | `1` | `<ol start>` attr |
| `reversed` | `false` | `<ol reversed>` attr |

---

## `core/list-item`

| Field | Default | Renders As |
|---|---|---|
| `content` | `""` | `<li>` inner HTML |

---

## `core/navigation`

| Field | Default | Renders As |
|---|---|---|
| `overlayMenu` | `"mobile"` | drawer visible below `768px` |
| `openSubmenusOnClick` | `false` | hover vs click for dropdowns |
| `showSubmenuIcon` | `true` | chevron icon on parent items |
| `icon` | `"menu"` | hamburger icon variant |
| `layout` | `"horizontal"` | `flex-direction: row` |

**overlayMenu map:**
```
never  → always show full nav
mobile → collapse to hamburger below 768px   ← default
always → always show hamburger
```

---

## `core/navigation-link`

| Field | Default | Renders As |
|---|---|---|
| `label` | `""` | link text |
| `url` | `""` | `href` |
| `opensInNewTab` | `false` | `target="_blank"` |
| `description` | `""` | `title` attr |
| `type` | `"custom"` | used for internal resolution |

---

## `core/paragraph`

| Field | Default | Renders As |
|---|---|---|
| `content` | `""` | inner HTML |
| `dropCap` | `false` | `::first-letter` large cap style |
| `textAlign` | `"left"` | `text-align` |
| `placeholder` | `"Start writing..."` | placeholder |
| `fontSize` | `"md"` | `font-size: 1rem` |

**fontSize map:**
```
sm → font-size: 0.875rem
md → font-size: 1rem      ← default
lg → font-size: 1.125rem
xl → font-size: 1.25rem
```

---

## `core/shortcode`

| Field | Default | Renders As |
|---|---|---|
| `text` | `""` | passed to shortcode resolver |

---

## `core/site-logo`

| Field | Default | Renders As |
|---|---|---|
| `width` | `"md"` | `width: 120px` |
| `isLink` | `true` | wraps in `<a href="/">` |
| `linkTarget` | `"_self"` | `<a target>` |

**Width map:**
```
sm → width: 80px
md → width: 120px   ← default
lg → width: 200px
```

---

## `core/video`

| Field | Default | Renders As |
|---|---|---|
| `src` | `""` | `<video src>` |
| `poster` | `""` | `<video poster>` |
| `caption` | `""` | `<figcaption>` |
| `autoplay` | `false` | `autoPlay` attr |
| `loop` | `false` | `loop` attr |
| `muted` | `false` | `muted` attr |
| `controls` | `true` | `controls` attr |
| `playsInline` | `false` | `playsInline` attr |

---

## Token Convention

All size/spacing tokens use `1rem = 16px` as the base. Centralize maps in a single `tokens.js` or `theme.js` so any scale change propagates everywhere.

| Drop from CMS | Keep in CMS |
|---|---|
| Raw `px` / `rem` values | Semantic size tokens (`sm`, `md`, `lg`) |
| Hex color values | Color tokens or role names (`primary`, `overlay`) |
| Computed style props | Layout intent labels (`horizontal`, `constrained`) |
| Redundant URL variants (`href`, `blob`, `textLinkHref`) | Single canonical `url` / `src` |
| Deprecated/internal fields (`rgbTextColor`, `isDark`) | Clean semantic equivalents |
