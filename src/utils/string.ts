export function snakeCase(string: string): string {
  return string
    .toLowerCase()
    .replace(/[^0-9a-z]+/g, '_')
    .replace(/^_+|_+$/, '');
}

export function decodeSpecialChars(str: string) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&lbrace;/g, '{')
    .replace(/&rbrace;/g, '}');
}
