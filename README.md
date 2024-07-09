# @sransara/astro-adocx
Like MDX, but for Asciidoc in Astro using passthroughs.

## Sample adoc file
```adoc
---
import Counter from './Counter.jsx';
---
= Hello, World!

This is a sample Asciidoc file that you can use with the `astro-adocx` integration.

Here is a counter:
++++
<Counter init={5} client:load />
++++

Built with +++{Astro.generator}+++
```

## Setup
```bash
npm install @sransara/astro-adocx
```

```js
// file: astro.config.js
import { defineConfig } from 'astro/config';
import { adocx } from '@sransara/astro-adocx/integration.js';
import solid from '@astrojs/solid-js';

import { adocxConfig, asciidoctorConfig } from './adocx/config';

export default defineConfig({
  integrations: [
    adocx(adocxConfig, asciidoctorConfig),
    solid({ devtools: true }),
  ]
});
```

## Configuration
```js
// file: adocx/config.js
import path from 'node:path';
import { register as krokiPluginRegisterHandle } from 'asciidoctor-kroki';
import type { AdocOptions, AstroAdocxOptions, Template } from '@sransara/astro-adocx/types.js';

const templates: Record<string, Template> = {
  'paragraph': {
    convert: (node, opts) => {
      return `<p>${node.getContent()}</p>`;
    }
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
    'listing-caption': 'Listing',
    sectanchors: '',
    idprefix: 'id:',
    idseparator: '-',
    icons: 'font',
    stem: 'latexmath',
    toc: 'macro',
    imagesdir: './_assets/',
    'kroki-fetch-diagram': true,
    'kroki-default-format': 'png',
    // Default layout for adoc files: attribute is used by src/extensions/postprocessorLayout.ts
    'astro-layout-path': '@/src/layouts/adocLayout/AdocLayout.astro',
  },
} satisfies AdocOptions;
```
