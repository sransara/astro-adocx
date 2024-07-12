import type {
  AdocOptions,
  AstroAdocxOptions,
} from '@sransara/astro-adocx/types';

const astroFenced = `
// This code block is automatically added to the generated Astro code
// const something = "thing";
`;

export const adocxConfig = {
  astroFenced,
  withAsciidocEngine(asciidoctorEngine) {
    // asciidoctorEngine is the asciidoctor.js engine
    // you can for example register extensions here
  },
  withDocument(filePath, document) {
    // filePath is the path of the adoc file
    // document is the asciidoctor.js document object
    // you can for example modify document attributes to be relative to current adoc file here
  },
  astroLayouts: {
    basic: { // add `:astro-layout: basic` in the document to use this layout
      path: '@/src/layouts/AdocLayout.astro', // `@/` is defined in tsconfig.json
      // args: something={something} // optionally pass args to the layout. docattrs are automatically passed
    },
  },
} satisfies AstroAdocxOptions;

export const asciidoctorConfig = {
  attributes: {
    // sectnums: true
    // any other asciidoctor attributes
  },
} satisfies AdocOptions;
