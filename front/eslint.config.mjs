import { defineConfig } from 'eslint/config';
import reglesEslint from 'regles-eslint';

export default defineConfig(
  { ignores: ['_site/**', 'vendor/**', 'node_modules/**', 'lib-svelte/**'] },
  ...reglesEslint.configs.html,
  ...reglesEslint.configs.markdown
);
