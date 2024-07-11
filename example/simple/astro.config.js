import solid from '@astrojs/solid-js';
import { adocx } from '@sransara/astro-adocx/integration';
import { defineConfig } from 'astro/config';

import { adocxConfig, asciidoctorConfig } from './adocx.config';

// https://astro.build/config
export default defineConfig({
  integrations: [adocx(adocxConfig, asciidoctorConfig), solid()],
});
