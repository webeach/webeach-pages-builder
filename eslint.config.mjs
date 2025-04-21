import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    ignores: ['lib/**'],
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 80,
          tabWidth: 2,
          semi: true,
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@?\\w'],
            ['^(\\.\\.\\/){2,}', '^\\.\\.\\/\\w'],
            ['^\\.\\/(\\w[\\w.-]*)\\/.+'],
            ['^\\.\\/(\\w[\\w.-]*)$'],
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
