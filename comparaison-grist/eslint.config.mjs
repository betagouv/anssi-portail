// @ts-check
import { defineConfig } from 'eslint/config';
import { createConfig } from '../eslint.config.base.mjs';

export default defineConfig(createConfig(import.meta.dirname), {
  files: ['src/**/*.ts'],
  rules: {
    'no-console': 'off',
  },
});
