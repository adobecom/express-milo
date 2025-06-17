module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: { browser: true, mocha: true },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'no-await-in-loop': 0,
    'max-statements-per-line': ['error', { max: 2 }],
    'import/extensions': ['error', { js: 'always' }],
    'object-curly-newline': "off",
    'no-return-assign': ['error', 'except-parens'],
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': "off",
    'import/no-cycle': 1,
    'import/no-extraneous-dependencies': 0,
    'no-restricted-syntax': 0,
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      rules: { 'no-console': 'off' },
    },
  ],
  plugins: [
    'chai-friendly',
  ],
  ignorePatterns: ['*.min.js'],
};
