const importOrder = [
  '<BUILTIN_MODULES>',
  '<THIRD_PARTY_MODULES>',
  '^@anssi-portail/',
  '^\\$plateforme/',
  '^@metier/',
  '^@(api|bus|infra)/',
  '^[.]',
];

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-svelte'],
  importOrder: [],
  importOrderTypeScriptVersion: '6.0.3',
  overrides: [
    {
      files: '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}',
      options: { importOrder },
    },
    {
      files: '*.svelte',
      options: { parser: 'svelte', importOrder },
    },
  ],
};
