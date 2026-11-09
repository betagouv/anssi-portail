import type { TSESLint } from '@typescript-eslint/utils';
import espacesInsécablesPonctuationFrancaise from './espaces-insecables-ponctuation-francaise.js';
import routeSansValidation from './route-sans-validation.js';

const rules: Record<string, TSESLint.LooseRuleDefinition> = {
  'espaces-insécables-ponctuation-francaise': espacesInsécablesPonctuationFrancaise,
  'route-sans-validation': routeSansValidation,
};

const plugin: TSESLint.FlatConfig.Plugin = {
  rules,
};

const configs: Record<'all' | 'svelte', TSESLint.FlatConfig.ConfigArray> = {
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
};

export default {
  rules,
  configs,
};
