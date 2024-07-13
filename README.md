# @sransara/astro-adocx
Like MDx, but for Asciidoctor in Astro using passthroughs.

![](./assets/screenshot.png)

## Sample adoc file
```adoc
---
import { Counter } from './_counter.jsx';
---
= Hello, World!

This is a sample Asciidoc file.

Here is a counter:
++++
<Counter init={5} client:load />
++++

Built with +++{Astro.generator}+++
```

## Installation
```bash
npm install @sransara/astro-adocx
```

`asciidoctor.js` and `astro` are intentionally marked as peer dependencies to allow you to use your own versions.

And add the plugin to your `astro.config.js`:

```js
import { adocx } from '@sransara/astro-adocx/integration';

const  { adocxConfig, asciidoctorConfig } = ...; // sample configs can be found in the `examples` directory

export default {
  plugins: [
    adocx(adocxConfig, asciidoctorConfig)
  ]
}
```

## Why not MDx?

Markdown is great, but I like Asciidoctor, for it's support of cross references and counters.
It is a mature and feature-rich markup language much suitable for technical documentation.

Something that I didn't like about MDx is that there are no markers for when we pass through the content to the underlying component.
Asciidoctor has a specific feature for called [passthrough](https://docs.asciidoctor.org/asciidoc/latest/pass/)s specifically for this usecase.
This plugin uses passes through the Astro template content to the underlying Astro component.

## How it works?

As you can imagine, `src/integration.ts` is the main file that does the magic.
It adds a Vite plugin that loads and transforms the `.adoc` files.

1. In load stage, it reads the `.adoc` file and pass it over to the Asciidoctor.js engine to produce an Astro component as string.
2. In transform stage, Astro component string is passed to the Astro compiler to produce the final component.

### Hacks

1. To re-use the same implementation that Astro uses internally to compile an Astro file, I re-used the functions here: `node_modules/astro/dist/vite-plugin-astro/compile.js`. But since it is not exported, I had to use dynamic imports to workaround it.
2. By default Asciidoctor doesn't consider curly braces (`{`, `}`) as special characters that needs to be encoded. Although angle brackets are considered special characters.  Asciidoctor.js doesn't seem to implement a way to customize these characters. I added a ruby patch that gets compiled to Javascript by using the Opal compiler: `src/patches/sub_specialchars.rb`

## TODO

- Inline scripts and styles are not supported yet. IMO it is better to use them through Astro components or by passing values to the layout.
- Move asciidoctor engine to a worker thread inspired by https://github.com/shishkin/astro-asciidoc (hopefully this solves node caching templates issue)

## Stability

This plugin is in early development and may have breaking changes in the future.
It is usable and tested with latest versions of Astro and Asciidoctor.
My main motivation is to use it in: https://github.com/sransara/com.sransara (https://sransara.com/)

## Alternatives

1. https://github.com/shishkin/astro-asciidoc - At the moment doesn't support passthrough to Astro, but probably more stable.
