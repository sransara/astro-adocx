/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  plugins: [
    'prettier-plugin-organize-imports',
  ]
};

export default config;
