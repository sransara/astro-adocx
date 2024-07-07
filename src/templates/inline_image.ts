// References:
// - https://github.com/asciidoctor/asciidoctor-backends/blob/master/erb/html5/inline_image.html.erb

import type { Inline } from 'asciidoctor';
import { UnsupportedNode, type Template } from '../types.js';
import { addOnceToAstroFence } from '../utils/astroFence.js';
import { Aexpr, aexpr, atag } from '../utils/asx.js';

export const convert: Template<Inline>['convert'] = (node: Inline, _opts?: any) => {
  if (node.getType() === 'icon' && node.getDocument().getAttribute('icons') === 'font') {
    return UnsupportedNode;
  }
  const target = node.getTarget();
  if (!target) {
    throw new Error('Missing target');
  }
  return convertImageNode(node, target, _opts);
};

export const convertImageNode = (node: Inline, target: string, _opts?: any) => {
  let src: string | Aexpr = node.getImageUri(target);

  let alt = node.getAttribute('alt');
  if (!alt) {
    // Astro images require an alt attribute
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
    return UnsupportedNode;
  } else {
    let srcPath = src;
    if (!src.startsWith('.')) {
      srcPath = `./${src}`;
    }
    src = aexpr(`import("${srcPath}")`);
  }

  const width = node.getAttribute('width');
  const height = node.getAttribute('height');

  // const roles = node.getRoles().join(' ');

  addOnceToAstroFence(node, "import { Image } from 'astro:assets';");

  const image = atag('Image', {
    src: src,
    alt: alt,
    inferSize: inferSize,
    width: width,
    height: height,
    // 'data-role': role,
  });

  const link = node.getAttribute('link');
  const window = node.getAttribute('window');

  if (link) {
    return atag('a', { href: link, target: window, children: [image] });
  } else {
    return image;
  }
};
