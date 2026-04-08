const parentConfig = require('../../.prettierrc.cjs');

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...parentConfig,
  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
};

module.exports = config;
