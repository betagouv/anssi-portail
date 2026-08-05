import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export function createConfig(tsconfigRootDir, { autoriseImportAxios = false } = {}) {
  return defineConfig(
    {
      ignores: ['dist/**', 'node_modules/**'],
    },
    {
      files: ['**/*.ts'],
      extends: [eslint.configs.recommended, tseslint.configs.recommended],
      rules: {
        ...(autoriseImportAxios
          ? {}
          : {
              'no-restricted-imports': [
                'error',
                {
                  paths: [
                    {
                      name: 'axios',
                      message: "Utilise '@anssi-portail/axios' à la place.",
                    },
                  ],
                  patterns: [
                    {
                      group: ['axios/*'],
                      message: "Utilise '@anssi-portail/axios' à la place.",
                    },
                  ],
                },
              ],
            }),
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: false,
          },
        ],
      },
      languageOptions: {
        parserOptions: {
          tsconfigRootDir,
        },
      },
    }
  );
}
