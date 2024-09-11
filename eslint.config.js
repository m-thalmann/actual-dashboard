const globals = require('globals');

const baseConfig = require('@m-thalmann/eslint-config-base');
const typescriptConfig = require('@m-thalmann/eslint-config-typescript');

const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['dist/'],
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.base.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },

  ...baseConfig,
  ...typescriptConfig,

  prettierConfig,
];
