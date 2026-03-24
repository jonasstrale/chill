import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: false
      }
    },
    rules: {
      'no-console': ['error', { allow: ['error', 'warn'] }]
    }
  }
];
