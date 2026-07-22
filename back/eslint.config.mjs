// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reglesEslint from 'regles-eslint';
import tseslint from 'typescript-eslint';
import { createConfig } from '../eslint.config.base.mjs';

export default defineConfig(createConfig(import.meta.dirname), {
  files: ['src/api/**/*.ts'],
  extends: [eslint.configs.recommended, tseslint.configs.recommended, reglesEslint.configs.all],
});
