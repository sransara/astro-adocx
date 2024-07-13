// This is an example template that converts a block image node to Astro:
// - it shows a way to use astro:asset Image component to render images
// - it shows how to add an import statement to the Astro code, while processing the template
//
// This template is not meant to be complete. It is just a starting point.
//
// For a full template that covers all cases refer to:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_image.html.erb

const { atag } = require('@sransara/astro-adocx/utils/asx');
const { convertImageNode } = require('./_helper_image.cjs');

/**
 * Converts a block image node to HTML.
 * @param {Object} params - The parameters object.
 * @param {import('asciidoctor').Block} params.node
 * @param {any} params.opts
 * @returns {string}
 */
function convert({ node, opts }) {
  const target = node.getAttribute('target');
  if (!target) {
    throw new Error('Missing target');
  }
  const inlineImage = convertImageNode(node, target, opts);
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles();
  return atag('div', {
    id,
    class: ['imageblock', ...roles].join(' '),
    children: [
      atag('div', {
        class: 'content',
        children: [inlineImage],
      }),
      title &&
        atag('div', {
          class: 'title',
          children: [title],
        }),
    ],
  });
}

module.exports = convert;
