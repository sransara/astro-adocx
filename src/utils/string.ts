/**
 * Decode special characters from asciidoc.
 * Asciidoctor substitutes special characters in different places: https://docs.asciidoctor.org/asciidoc/latest/subs/
 * This reverts the substitution to get back the raw text.
 * (by default asciidoctor doesn't have curly brace substition,
 * but we do because of the `sub_specialchars` patch: src/patches/sub_specialchars.rb)
 */
export function decodeSpecialChars(str: string) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&lbrace;/g, '{')
    .replace(/&rbrace;/g, '}');
}
