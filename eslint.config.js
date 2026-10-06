import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Library layers (architecture §3). Dependencies only point downward:
 * tokens → utils → theme / motion → primitives → components → composites.
 * `shapes` (the androidx.graphics.shapes port) is pure geometry and imports nothing.
 * Composites are built from public components only, never from primitives.
 */
const layers = [
  { type: 'tokens', pattern: 'packages/ui/src/tokens' },
  { type: 'utils', pattern: 'packages/ui/src/utils' },
  { type: 'theme', pattern: 'packages/ui/src/theme' },
  { type: 'motion', pattern: 'packages/ui/src/motion' },
  { type: 'shapes', pattern: 'packages/ui/src/shapes' },
  { type: 'primitives', pattern: 'packages/ui/src/primitives' },
  { type: 'components', pattern: 'packages/ui/src/components' },
  { type: 'composites', pattern: 'packages/ui/src/composites' },
  { type: 'next', pattern: 'packages/ui/src/next' },
  { type: 'vk', pattern: 'packages/ui/src/vk' },
];

const allow = (from, to) => ({
  from: { element: { type: from } },
  allow: { to: { element: { types: { anyOf: to } } } },
});

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/.next/**',
      '**/out/**',
      '**/storybook-static/**',
      '**/generated/**',
      '**/.generated/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['**/*.tsx', '**/use-*.ts', '**/context.ts'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': layers,
      'import/resolver': { typescript: { project: 'packages/ui/tsconfig.json' } },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            allow('tokens', ['tokens']),
            allow('utils', ['tokens', 'utils']),
            allow('theme', ['tokens', 'utils', 'theme']),
            allow('motion', ['tokens', 'theme', 'motion']),
            allow('shapes', ['shapes']),
            allow('primitives', ['tokens', 'utils', 'theme', 'motion', 'shapes', 'primitives']),
            allow('components', [
              'tokens',
              'utils',
              'theme',
              'motion',
              'shapes',
              'primitives',
              'components',
            ]),
            allow('composites', ['tokens', 'utils', 'theme', 'motion', 'components', 'composites']),
            allow('next', ['tokens', 'utils', 'theme', 'next']),
            allow('vk', [
              'tokens',
              'utils',
              'theme',
              'motion',
              'shapes',
              'primitives',
              'components',
              'vk',
            ]),
          ],
        },
      ],
    },
  },
  {
    // The docs site is built only with @vkieu/mui ("Only our components"). Allow the bare
    // entry and the three approved subpaths; block every other @vkieu/mui subpath and the
    // known third-party UI libraries and docs themes.
    files: ['apps/site/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@vkieu/mui/*',
                '!@vkieu/mui/next',
                '!@vkieu/mui/vk',
                '!@vkieu/mui/styles.css',
              ],
              message:
                'apps/site may import UI only from @vkieu/mui, @vkieu/mui/next or @vkieu/mui/vk.',
            },
            {
              group: [
                '@mui/*',
                '@mui/material',
                '@mui/material/*',
                '@radix-ui/*',
                '@headlessui/react',
                'shadcn',
                'shadcn/*',
                'nextra',
                'nextra/*',
                'fumadocs-*',
                'fumadocs',
                '@chakra-ui/*',
                'antd',
                'antd/*',
                '@mantine/*',
              ],
              message:
                'apps/site is built only with @vkieu/mui components (plan: "Only our components").',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
