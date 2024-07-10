import path from 'node:path';
import type { Block } from 'asciidoctor';
// @ts-expect-error: missing type definitions for asciidoctor-kroki
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';
import type { AdocOptions, AstroAdocxOptions, Template } from '@sransara/astro-adocx/types';

const templates: Record<string, Template> = {
  'paragraph': {
    convert: (node: Block, opts: any) => {
      return `<p>${node.getContent()}</p>`;
    },
  },
};

const astroFenced = `
// This code block is automatically added to the generated Astro code
`;

export const adocxConfig = {
  astroFenced,
  withAsciidocEngine(asciidoctorEngine) {
    krokiPluginRegisterHandle(asciidoctorEngine.Extensions);
  },
  withDocument(filePath, document) {
    // useful for asciidoctor-diagrams/kroki
    // to output images in the same directory as the adoc file
    document.setAttribute('outdir', path.dirname(filePath));
  },
  templates,
} satisfies AstroAdocxOptions;

export const asciidoctorConfig = {
  attributes: {
    xrefstyle: 'full',
    stem: 'latexmath',
    imagesdir: './_assets/',
    'kroki-fetch-diagram': true,
    'kroki-default-format': 'png',
    // Default layout for adoc files: attribute is used by astro-adocx/src/extensions/postprocessorLayout.ts
    'astro-layout-path': '@/src/layouts/adocLayout/AdocLayout.astro', // `@/` is defined as a path alias in tsconfig.json
  },
} satisfies AdocOptions;
