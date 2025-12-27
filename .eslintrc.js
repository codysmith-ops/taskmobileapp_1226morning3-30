/**
 * ESLint Configuration
 * React Native with TypeScript
 */

module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
};
