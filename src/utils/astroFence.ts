import type { AbstractNode } from 'asciidoctor';
import { decodeSpecialChars } from '#src/utils/string';

/**
 * Add the fenced lines to the astro-fenced attribute of the document.
 * Content of this attribute gets added to the final astro code string's fenced block.
 */
export function addOnceToAstroFence(node: AbstractNode, fencedLines: string) {
  const document = node.getDocument();
  fencedLines = fencedLines.trim();
  // asciidoc seems to run all attributes through sub_specialchars, so we need to decode them
  const astroFenced: string = decodeSpecialChars(document.getAttribute('astro-fenced') ?? '');
  if (astroFenced.includes(fencedLines)) {
    return;
  }
  document.setAttribute('astro-fenced', astroFenced + `${fencedLines}\n`);
}
