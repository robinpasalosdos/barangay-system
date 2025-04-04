import js from '@eslint/js'
import globals from 'globals'
import stylisticJs from '@stylistic/eslint-plugin-js';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx,cjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic/js': stylisticJs, // new plugin for addtl. rules
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // additional rules for consistent formatting
      eqeqeq: ['error', 'smart'],
      'no-unused-vars': 1,
      'no-console': [1, { 'allow': ['info', 'warn', 'error', 'assert', 'table'] }],
      semi: ['error', 'always'],
      '@stylistic/js/indent': ['error', 4],
      '@stylistic/js/quotes': [
          'error',
          'single',
          { 'avoidEscape': true },
      ],
      '@stylistic/js/comma-spacing': ['error', { 'before': false, 'after': true }]
    },
  },
]
