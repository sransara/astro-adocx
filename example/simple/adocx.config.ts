import path from 'node:path';
import type { Block } from 'asciidoctor';
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
  },
  withDocument(filePath, document) {
  },
  templates,
} satisfies AstroAdocxOptions;

export const asciidoctorConfig = {
  attributes: {
    // Default layout for adoc files: attribute is used by astro-adocx/src/extensions/postprocessorLayout.ts
    'astro-layout-path': '@/src/layouts/AdocLayout.astro', // `@/` is defined as a path alias in tsconfig.json
  },
} satisfies AdocOptions;
