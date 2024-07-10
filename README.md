# @sransara/astro-adocx
Like MDX, but for Asciidoc in Astro using passthroughs.

## Sample adoc file
```adoc
---
import { Counter } from './_counter.jsx';
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
