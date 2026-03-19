import type { Config } from 'prettier';

const config: Config = {
  singleQuote: true,
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-organize-imports'],
  organizeImportsSkipDestructiveCodeActions: true,
};

export default config;
