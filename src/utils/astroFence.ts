import type { AbstractNode } from 'asciidoctor';
import { decodeSpecialChars } from './string';

export function addOnceToAstroFence(node: AbstractNode, fencedLines: string) {
  const document = node.getDocument();
  fencedLines = fencedLines.trim();
  const astroFenced: string = decodeSpecialChars(document.getAttribute('astro-fenced') ?? '');
  if (astroFenced.includes(fencedLines)) {
    return;
  }
  document.setAttribute('astro-fenced', astroFenced + `${fencedLines}\n`);
}
