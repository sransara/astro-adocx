import type {
  AdocNodeConverters,
  AdocOptions,
  AstroAdocxOptions,
} from '@sransara/astro-adocx/types';
import type { Block } from 'asciidoctor';

const nodeConverters: AdocNodeConverters = {
  paragraph: (node: Block, opts: any) => {
    return `<p>${node.getContent()}</p>`;
  },
};

const astroFenced = `
// This code block is automatically added to the generated Astro code
`;

export const adocxConfig = {
  astroFenced,
  withAsciidocEngine(asciidoctorEngine) {},
  withDocument(filePath, document) {},
  nodeConverters,
  astroLayouts: {
    basic: { // add `:astro-layout: basic` in the document to use this layout
      path: '@/src/layouts/AdocLayout.astro', // `@/` is defined in tsconfig.json
    },
  },
} satisfies AstroAdocxOptions;

export const asciidoctorConfig = {
  attributes: {
    sectnum: true
    // any other asciidoctor attributes
  },
} satisfies AdocOptions;
