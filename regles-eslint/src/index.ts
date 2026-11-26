import * as htmlParser from '@html-eslint/parser';
import type { TSESLint } from '@typescript-eslint/utils';
import type { ESLint } from 'eslint';
import type { ConfigObject } from 'eslint/config';

import espacesInsécablesPonctuationFrancaise from './espaces-insecables-ponctuation-francaise.js';
import { markdown } from './espaces-insecables-ponctuation-francaise/markdown.js';
import routeSansValidation from './route-sans-validation.js';

const rules: Record<string, TSESLint.LooseRuleDefinition> = {
  'espaces-insécables-ponctuation-francaise': espacesInsécablesPonctuationFrancaise,
  'route-sans-validation': routeSansValidation,
};

// Les types de règles de typescript-eslint et d’ESLint diffèrent à la frontière du plugin.
const plugin = { rules } as ESLint.Plugin;

const configs: Record<'all' | 'svelte' | 'html' | 'markdown', ConfigObject[]> = {
  all: [
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
      plugins: {
        'regles-eslint': plugin,
      },
      rules: {
        'regles-eslint/route-sans-validation': 'error',
      },
    },
  ],
  // Le parser `svelte-eslint-parser` doit être fourni par le consommateur (ex. `eslint-plugin-svelte`).
  svelte: [
    {
      files: ['**/*.svelte'],
      plugins: {
        'regles-eslint': plugin,
      },
      rules: {
        'regles-eslint/espaces-insécables-ponctuation-francaise': 'warn',
      },
    },
  ],
  markdown: [
    {
      files: ['**/*.md'],
      processor: markdown,
      languageOptions: {
        parser: htmlParser,
        parserOptions: { templateEngineSyntax: { '{{': '}}', '{%': '%}' } },
      },
      plugins: { 'regles-eslint': plugin },
      rules: { 'regles-eslint/espaces-insécables-ponctuation-francaise': 'warn' },
    },
  ],
  html: [
    {
      files: ['**/*.html'],
      languageOptions: {
        parser: htmlParser,
        parserOptions: {
          frontmatter: true,
          templateEngineSyntax: { '{{': '}}', '{%': '%}' },
        },
      },
      plugins: { 'regles-eslint': plugin },
      rules: { 'regles-eslint/espaces-insécables-ponctuation-francaise': 'warn' },
    },
  ],
};

export default {
  rules,
  configs,
};
