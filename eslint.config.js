const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'coverage/**',
      '.pnpm-store/**',
      '.home/**',
      'assets/**',
    ],
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-native',
                'expo',
                'expo/*',
                'expo-*',
                '@/data/*',
                '@/features/*',
                '@/components/*',
              ],
              message: 'domain/ debe ser puro: sin React, Expo, UI ni acceso a datos.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/data/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-native',
                'expo',
                'expo/*',
                'expo-*',
                '@/features/*',
                '@/components/*',
              ],
              message: 'data/ solo puede depender de domain/ y del driver.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/data/*', '@/features/*'],
              message: 'Los componentes presentacionales no acceden a datos ni a casos de uso.',
            },
          ],
        },
      ],
    },
  },
]);
