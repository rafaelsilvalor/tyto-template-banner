# How to write a `banner` brief

`banner` is a product banner: **only a name** (of a product, a course or an institution) over a
fixed background, in up to three sizes. Recognise it by the request: "banner", "product
banner", or the sizes 1200×628, 600×600 and 345×146.

## Slots

| Slot     | Where     | Rule                                                                                                                                                       |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `titulo` | directive | Required, at most 120 characters, bold allowed. The name, on one line. An acronym or a state in brackets at the end goes in bold: `**(VA)**`, `**(AGX)**`. |

There is no other slot: the background, the logo and the colour come from the template. **There
is no `selo`**: the seal belongs to templates with a `grid` format, and this one has none, so
`selo:` here is `E_UNKNOWN_SLOT`.

## Formats

| Format           | Size     |
| ---------------- | -------- |
| `banner`         | 1200×628 |
| `banner-1x1`     | 600×600  |
| `banner-345x146` | 345×146  |

List only the sizes asked for. When the request names none, use all three:
`formats: [banner, banner-1x1, banner-345x146]`.

## Normalisation

- **Write the name on one line and let the template break it.** It balances the lines, keeps
  `(VA)` with the word before it, and never ends a line on "de", "do", "da" or "e" when a
  better break exists, even where a reference artwork breaks differently.
- **Do not break lines by hand** unless the person asks for a specific break. A break you write
  is kept.
- **Bold only on the acronym or state in brackets.** No italics.
- The text is literal: do not abbreviate, correct or translate.

## How much fits

It is a name, not a sentence. The template picks the largest type size that fits each format.
A text too long for the smallest size still renders, with `W_TEMPLATE_OVERFLOW`. Above about
80 characters, say so and ask whether there is a short form.

## Example

Request (invented): "banner for the product AGX — Agência de Gestão Hídrica do Vale Alto".

```brief
---
template: banner
formats: [banner, banner-1x1, banner-345x146]
---
::titulo
  Agência de Gestão Hídrica do Vale Alto **(AGX)**
```

## Known traps

- `selo:` in the frontmatter is `E_UNKNOWN_SLOT` (see Slots).
- A configuration may give this template another name (an alias); the brief writes whichever
  name the person uses, and the slots are the same.
