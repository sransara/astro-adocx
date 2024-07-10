import type { Document as AdocDocument, Extensions } from 'asciidoctor';

import { isExtensionSingleton } from '../types.js';
import { addOnceToAstroFence } from '../utils/astroFence.js';
import { decodeSpecialChars } from '../utils/string.js';

export function register(registry: typeof Extensions | Extensions.Registry) {
  if (isExtensionSingleton(registry)) {
    registry.register(function () {
      this.postprocessor(extension);
    });
  } else {
    registry.postprocessor(extension);
  }
}

function extension(this: Extensions.PostprocessorDsl) {
  this.process(function (adoc: AdocDocument, output: string) {
    const layout = (adoc.getAttribute('astro-layout-path') ?? '').trim();
    if (!layout) {
      return output;
    }
    addOnceToAstroFence(adoc, `import AstroLayout from '${layout}';`);
    let layoutArgs = (adoc.getAttribute('astro-layout-args') ?? '').trim();
    layoutArgs = decodeSpecialChars(layoutArgs);
    const layoutComponent = 'AstroLayout';
    const openTag = `<${layoutComponent} ${layoutArgs}>`;
    const closeTag = `</${layoutComponent}>`;
    return openTag + '\n' + output + '\n' + closeTag;
  });
}
