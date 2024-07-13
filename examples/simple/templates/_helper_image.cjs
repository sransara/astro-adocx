const { addOnceToAstroFence } = require('@sransara/astro-adocx/utils/astroFence');
const { Aexpr, aexpr, atag } = require('@sransara/astro-adocx/utils/asx');

/**
 * Converts an almost inline image node to HTML.
 *
 * @param {import('asciidoctor').Inline | import('asciidoctor').Block} node - The inline image node to convert.
 * @param {string} target - Explicitly pass the target of the image node because it is accessed differently in Block vs Inline nodes.
 * @param {any} opts - The conversion options.
 * @returns {string} - The converted HTML element or null if conversion fails.
 */
function convertImageNode(node, target, opts) {
  /** @type {string | Aexpr} */ let src = node.getImageUri(target);
  let alt = node.getAttribute('alt');
  if (!alt) {
    alt = '';
  }
  let inferSize = false;
  if (src.startsWith('/') && !src.startsWith('//')) {
    if (!node.getAttribute('width') || !node.getAttribute('height')) {
      console.warn(`Root path image ${src} is missing width and height attributes`);
      throw new Error(`Root path image ${src} is missing width and height attributes`);
    }
  } else if (src.startsWith('http') || src.startsWith('//')) {
    inferSize = true;
  } else if (src.startsWith('data:')) {
    throw new Error('Data URI images templating is not yet implemented');
  } else {
    let srcPath = src;
    if (!src.startsWith('.')) {
      srcPath = `./${src}`;
    }
    src = aexpr(`import("${srcPath}")`);
  }
  const width = node.getAttribute('width');
  const height = node.getAttribute('height');
  addOnceToAstroFence(node, "import { Image } from 'astro:assets';");
  const image = atag('Image', {
    src: src,
    alt: alt,
    inferSize: inferSize,
    width: width,
    height: height,
  });
  const link = node.getAttribute('link');
  const window = node.getAttribute('window');
  if (link) {
    return atag('a', { href: link, target: window, children: [image] });
  } else {
    return image;
  }
}

module.exports = {
  convertImageNode,
};
