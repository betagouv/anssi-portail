import type { TSESLint } from '@typescript-eslint/utils';
import routeSansValidation from './route-sans-validation.js';

const rules: Record<string, TSESLint.LooseRuleDefinition> = {
  'route-sans-validation': routeSansValidation,
};

const plugin: TSESLint.FlatConfig.Plugin = {
  rules,
};

const configs: { all: TSESLint.FlatConfig.ConfigArray } = {
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
};

export default {
  rules,
  configs,
};
