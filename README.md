# tyto-template-banner

`banner`, a [Tyto](https://github.com/rafaelsilvalor/tyto) code template in its own repository:
roxo's product banner — the product's name over a fixed background, in three sizes (1200 × 628,
600 × 600 and 345 × 146). The lines are broken by the template, balanced, with a group in
parentheses kept whole and no line ending on `de` or `e`.

It replaces Tyto's built-in `banner-roxo` with **one template and one configuration, `roxo`**,
which is the template's default and keeps the built-in's name as its alias (TYTO-435, Tyto
ADR 0151 and ADR 0155).

**This repository holds the composition and its backgrounds only.** The three PNGs in
`templates/banner/assets/` are the shapes the logo was painted out of (Tyto TYTO-225): no logo,
no wordmark, no copy. The logo and the wordmark come from the brand kit installed on the
machine; without one the template draws a placeholder logo and no wordmark (Tyto ADR 0063,
ADR 0065). The example briefs carry the invented copy of Tyto's built-in fixtures.

## Use it from a plugin file

A plugin file fetches the template at a tag and names its configurations (Tyto ADR 0151). Put
this in `.tyto/plugin-files/banner.yaml` beside a project's briefs, or in
`TYTO_HOME/plugin-files/` for every project on the machine:

```yaml
version: 1
templates:
  banner:
    source:
      git: https://github.com/rafaelsilvalor/tyto-template-banner.git
      ref: v1.0.0
    default: roxo # `template: banner` renders as `roxo`
    configurations:
      roxo:
        alias: banner-roxo # what briefs already write today
        brand: roxo
```

A brief then starts as it does today, or with the bare name:

```
---
template: banner-roxo
formats: [banner, banner-1x1, banner-345x146]
---
```

A pack brings templates and no formats. Copy `templates/formats.yaml` into the project that
renders `banner`, or merge its three lines into the project's own.

**While Tyto still ships its built-in copy, the alias does not load.** An alias equal to a
built-in template's name is refused and the built-in stands (ADR 0151 decision 7); it loads once
Tyto's TYTO-436 removes the built-in folder.

**The backgrounds need Tyto's TYTO-478.** An installed plugin's code template is handed no files
from its own folder yet (Tyto ADR 0062), so until a Tyto with TYTO-478 is released the banner
renders without its background.

## What a configuration may change

| What         | Where             | Why there                                                                         |
| ------------ | ----------------- | --------------------------------------------------------------------------------- |
| The brand    | `brand:`          | The logo and the wordmark come with the brand's kit (ADR 0155).                   |
| The formats  | `formats:`        | A subset of the manifest's three that a brief cannot widen (ADR 0155, TYTO-475).  |
| Nothing else | `values` is empty | A move with the same bytes: the boxes, sizes and inks stay constants in the code. |

The brief owns `titulo`, the product's name; `**bold**` is the bold face.

## What it may reach

| Permission        | Why                                                              |
| ----------------- | ---------------------------------------------------------------- |
| `font:CircularXX` | The name is sized and broken into lines by measuring CircularXX. |

**The install asks for it once.** Without it the render warns `W_PLUGIN_FONT_WITHHELD` and the
name falls back to its unmeasured size. On a machine without CircularXX, Tyto measures and
draws its bundled substitute and needs no permission.

## Development

`pnpm check` runs Prettier, the type checker, ESLint and the tests; `pnpm build` writes
`dist/index.js`, one ES module with every `@tyto` import inlined, which is committed and which
CI rebuilds and compares. Tyto runs no build of a fetched repository, so every ref a plugin file
names must hold it.

The template depends on Tyto's published contract, held by GitHub Packages under the owner's
scope (Tyto ADR 0149) and aliased in `package.json`: `@tyto/house-style` draws the piece,
`@tyto/template-kit` and `@tyto/core` are what it is drawn with, and `@tyto/plugin-api` is what
loads it. The committed `.npmrc` names the scope only. GitHub asks for a token with
`read:packages` even for public packages, and it goes in your user-level `~/.npmrc`:

```sh
gh auth refresh -s read:packages
echo '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> ~/.npmrc
NODE_AUTH_TOKEN=$(gh auth token) pnpm install
```

The tests, all without Tyto:

- `src/template.test.ts`: the composition's rules on the scene, Tyto's own tests for the
  built-in moved with it — every line inside its box, the group in parentheses kept whole, no
  line ending on a function word, the floor and its overflow report, the logo and the wordmark
  in the boxes the painted-out art took, in both purples.
- `tests/examples.test.ts`: the two example briefs compiled as Tyto compiles them through
  `@tyto/template-kit/testing` (Tyto ADR 0152), against the HTML in `tests/__snapshots__/`.
  Those six files are Tyto's own snapshots of the built-in, copied byte for byte, so the test
  passing is the move keeping its bytes.
- `tests/faces.test.ts`: every face the examples draw is declared in the manifest's `faces`, and
  nothing else. A plugin's process measures only the declared faces, so a face left out would
  draw the name smaller than the built-in did.
- `tests/plugin.test.ts`: the built `dist/index.js`, loaded through `@tyto/plugin-api/testing`
  (Tyto ADR 0150), drawing a banner across the isolation protocol.

**Renders made on a machine with the private brand kit carry the brand.** Never commit one:
`.gitignore` refuses `*.png` and `*.svg`, except the three backgrounds.

The `contract` workflow runs every day against the newest published contract, past the ranges
`package.json` asks for, and opens a pull request when it passes (Tyto ADR 0154).
