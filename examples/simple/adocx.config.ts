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
  async withAsciidocEngine(asciidoctorEngine) {
    // asciidoctorEngine is the asciidoctor.js engine
    // you can for example register extensions here
  },
  async withDocument(filePath, document) {
    // filePath is the path of the adoc file
    // document is the asciidoctor.js document object
    // you can for example modify document attributes to be relative to current adoc file here
  },
  async withAstroComponent(filePath, astroComponent) {
    // to do any modifications to the final generated Astro component code
    // must return the modified Astro component code
    return astroComponent;
  },
  astroLayouts: {
    basic: { // add `:astro-layout: basic` in the document to use this layout
      path: '@/src/layouts/AdocLayout.astro', // `@/` is defined in tsconfig.json
      // args: something={something} // optionally pass args to the layout. docattrs are automatically passed
    },
  },
  watchFiles: [
    './adocx.config.ts',
    /*
    // TODO: node seems to cache the templates/*.cjs modules,
    // will have to look into worker threads, or find some way to invalidate the node module cache
    */
    // ...fg.sync('./templates/*', { onlyFiles: true }),
  ],
} satisfies AstroAdocxOptions;

export const asciidoctorConfig = {
  template_dirs: ['./templates'], // to rewrite image templates to use Image component
  attributes: {
    imagesdir: './', // to use relative paths for images, in Astro we need to use the Image component
    // any other asciidoctor attributes
  },
} satisfies AdocOptions;
