// Reference:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/block_image.html.erb

import type { Block, Inline } from 'asciidoctor';
import { type AdocNodeConverter, UnsupportedNode } from '../types.js';
import { atag } from '../utils/asx.js';
import { convertImageNode } from './inline_image.js';

export const convert: AdocNodeConverter<Block> = (node: Block, opts?: any) => {
  const target = node.getAttribute('target');
  if (!target) {
    throw new Error('Missing target');
  }
  const inlineImage = convertImageNode(node as unknown as Inline, target, opts);
  if (inlineImage === UnsupportedNode) {
    return UnsupportedNode;
  }
  const id = node.getId();
  const title = node.getCaptionedTitle();
  const roles = node.getRoles().join(' ');

  return atag('div', {
    id,
    class: `imageblock ${roles}`,
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
};

export default convert;
