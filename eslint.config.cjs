// eslint.config.cjs

/** @type {import('eslint').Linter.Config} */
module.exports = [
  {
    languageOptions: {
      parser: require('@babel/eslint-parser'), // Use Babel parser for JSX
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      'no-unused-vars': 'warn',
      'react/prop-types': 'off', // Turn off if you don't need prop-types checking
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['*.js', '*.jsx'],
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+ doesn't require `React` in scope
    },
  },
];
