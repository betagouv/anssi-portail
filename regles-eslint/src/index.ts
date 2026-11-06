import type { TSESLint } from '@typescript-eslint/utils';
import nbspPonctuationFrancaise from './nbsp-ponctuation-francaise.js';
import routeSansValidation from './route-sans-validation.js';

const rules: Record<string, TSESLint.LooseRuleDefinition> = {
  'nbsp-ponctuation-francaise': nbspPonctuationFrancaise,
  'route-sans-validation': routeSansValidation,
};

const plugin: TSESLint.FlatConfig.Plugin = {
  rules,
};

const configs: { all: TSESLint.FlatConfig.ConfigArray; svelte: TSESLint.FlatConfig.ConfigArray } = {
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
        'regles-eslint/nbsp-ponctuation-francaise': 'warn',
      },
    },
  ],
};

export default {
  rules,
  configs,
};
