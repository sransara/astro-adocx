import type { Document as AdocDocument, Extensions } from 'asciidoctor';

import { type AstroAdocxOptions, isExtensionSingleton } from '../types.js';
import { addOnceToAstroFence } from '../utils/astroFence.js';
import { decodeSpecialChars } from '../utils/string.js';

export function register(
  registry: typeof Extensions | Extensions.Registry,
  adocxConfig: AstroAdocxOptions,
) {
  if (isExtensionSingleton(registry)) {
    registry.register(function () {
      this.postprocessor(extension(adocxConfig));
    });
  } else {
    registry.postprocessor(extension(adocxConfig));
  }
}

function extension(adocxConfig: AstroAdocxOptions) {
  const layouts = adocxConfig.astroLayouts ?? {};

  return function (this: Extensions.PostprocessorDsl) {
    this.process(function (adoc: AdocDocument, output: string) {
      let layoutPath: string;
      let layoutArgs: string;
      if(adoc.getAttribute('astro-layout') ?? '') {
        const layout = layouts[adoc.getAttribute('astro-layout')];
        layoutPath = layout.path;
        layoutArgs = layout.args ?? '';
      }
      else if(adoc.getAttribute('astro-layout-path') ?? '') {
        layoutPath = adoc.getAttribute('astro-layout-path');
        layoutArgs = adoc.getAttribute('astro-layout-args') ?? '';
      }
      else {
        return output;
      }
      if (!layoutPath) {
        return output;
      }

      layoutPath = layoutPath.trim();
      layoutArgs = layoutArgs.trim();
      layoutArgs = decodeSpecialChars(layoutArgs);

      if (!layoutArgs.includes('docattrs={docattrs}')) {
        // docattrs is automatically defined in the integration
        // it doesn't hurt to pass that to the layout automatically
        // for example to add the doctitle in the layout with h1 tag
        layoutArgs = `docattrs={docattrs} ${layoutArgs}`;
      }
      if (!layoutArgs.includes('outline={outline}')) {
        // outline is automatically defined in the integration
        // it doesn't hurt to pass that to the layout automatically
        // for example to create a table of contents outside of the main article
        layoutArgs = `outline={outline} ${layoutArgs}`;
      }

      addOnceToAstroFence(adoc, `import AstroLayout from '${layoutPath}';`);
      const layoutComponent = 'AstroLayout';
      const openTag = `<${layoutComponent} ${layoutArgs}>`;
      const closeTag = `</${layoutComponent}>`;
      return openTag + '\n' + output + '\n' + closeTag;
    });
  };
}
