// This is an example template that converts a inline image node to Astro:
// - it shows a way to use astro:asset Image component to render images
// - it shows how to add an import statement to the Astro code, while processing the template
//
// This template is not meant to be complete. It is just a starting point.
//
// For a full template that covers all cases refer to:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/inline_image.html.erb

const { convertImageNode } = require('./_helper_image.cjs');

/**
 * Converts a inlint image node to HTML.
 * @param {Object} params - The parameters object.
 * @param {import('asciidoctor').Inline} params.node
 * @param {any} params.opts
 * @returns {string}
 */
function convert({ node, opts }) {
  if (node.getType() === 'icon' && node.getDocument().getAttribute('icons') === 'font') {
    throw new Error('Image icon templating is not yet implemented');
  }
  const target = node.getTarget();
  if (!target) {
    throw new Error('Missing target');
  }
  return convertImageNode(node, target, opts);
};


module.exports = convert;

