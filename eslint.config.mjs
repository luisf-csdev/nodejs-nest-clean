import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      prettier,
      import: importPlugin,
      unicorn,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        parser: {
          ts: '@typescript-eslint/parser',
        },
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'no-type-imports',
        },
      ],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: '@/**/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'never',
        },
      ],
      'object-shorthand': ['error', 'always'],
      'no-useless-return': 'error',
      'linebreak-style': ['error', 'unix'],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts'],
        },
      },
    },
  },
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
)
