module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:security/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/indent': 'off',
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error'
    ],
    'no-console': 'off',
    'no-extra-semi': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'prefer-const': 'off',
    quotes: [
      'error',
      'single'
    ],
    'no-trailing-spaces': [
      'error'
    ],
    'symbol-description': [
      'warn'
    ]
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  parser: "@typescript-eslint/parser",
};