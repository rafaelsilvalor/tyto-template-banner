import { readFileSync } from 'node:fs';

import { defineTemplate, parseFormats, parseManifest } from '@tyto/core';
import { compileTemplate } from '@tyto/template-kit/testing';
import { describe, expect, it } from 'vitest';

import { build } from '../src/template.js';

import type { AssetRef, AssetResolver, TemplateFiles } from '@tyto/core';

/**
 * Each example brief, compiled the way Tyto compiles it (Tyto ADR 0152), against the HTML of
 * each format in `tests/__snapshots__/`.
 *
 * The six snapshot files are Tyto's own for the built-in `banner-roxo` (`packages/templates`,
 * TYTO-453), copied byte for byte when the template moved here (TYTO-435), and the resolvers
 * below are the ones that wrote them: every image found and none read, embedded by its path.
 * So this test passing is the move keeping its bytes, until the composition changes on purpose.
 * Tyto's SVG snapshots stay behind: `@tyto/export-svg` is not a published package.
 *
 * Nothing is measured and every face is a placeholder, so the snapshot moves when the
 * composition does and not when a machine has another font. No brand kit either: the logo is
 * the house's and stays out of this public repository.
 */

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');

function valueOf<T>(result: { ok: true; value: T } | { ok: false; error: unknown }): T {
  if (!result.ok) throw new Error(JSON.stringify(result.error, undefined, 2));
  return result.value;
}

/** A ref that stands for the file at `path` without its bytes; its id is what gets embedded. */
function refAt(path: string): AssetRef {
  return { id: path, source: 'file', path, hash: `test-${path}` };
}

const assets: AssetResolver = {
  base: '(snapshot test)',
  resolve: (reference) => Promise.resolve(refAt(reference)),
};
const files: TemplateFiles = { svg: () => undefined, image: refAt };

const manifest = valueOf(parseManifest(read('../templates/banner/manifest.yaml'), 'manifest.yaml'));
const template = defineTemplate(manifest, build, files);
const formats = valueOf(parseFormats(read('../templates/formats.yaml'), 'formats.yaml'));

describe.each(['agencia', 'prefeitura'])('the example %s', (name) => {
  it('compiles to the three formats, each the bytes the built-in copy wrote', async () => {
    const compiled = valueOf(
      await compileTemplate({
        brief: read(`../templates/banner/examples/${name}.brief`),
        template,
        formats,
        assets,
        asset: (ref: AssetRef) => `tyto-test-asset:${ref.id}`,
      }),
    );

    expect(compiled.frames.map((frame) => `${frame.artwork}.${frame.format}`)).toEqual([
      'artwork-1.banner',
      'artwork-1.banner-1x1',
      'artwork-1.banner-345x146',
    ]);
    for (const frame of compiled.frames) {
      await expect(frame.html).toMatchFileSnapshot(
        `./__snapshots__/${name}.${frame.artwork}.${frame.format}.html`,
      );
    }
  });
});
