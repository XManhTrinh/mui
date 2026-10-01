import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Library layers (architecture §3). Dependencies only point downward:
 * tokens → utils → theme / motion → primitives → components → composites.
 * Composites are built from public components only, never from primitives.
 */
const layers = [
  { type: 'tokens', pattern: 'packages/ui/src/tokens' },
  { type: 'utils', pattern: 'packages/ui/src/utils' },
  { type: 'theme', pattern: 'packages/ui/src/theme' },
  { type: 'motion', pattern: 'packages/ui/src/motion' },
  { type: 'primitives', pattern: 'packages/ui/src/primitives' },
  { type: 'components', pattern: 'packages/ui/src/components' },
  { type: 'composites', pattern: 'packages/ui/src/composites' },
  { type: 'next', pattern: 'packages/ui/src/next' },
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
      '**/storybook-static/**',
      '**/generated/**',
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
            allow('primitives', ['tokens', 'utils', 'theme', 'motion', 'primitives']),
            allow('components', ['tokens', 'utils', 'theme', 'motion', 'primitives', 'components']),
            allow('composites', ['tokens', 'utils', 'theme', 'motion', 'components', 'composites']),
            allow('next', ['tokens', 'utils', 'theme', 'next']),
          ],
        },
      ],
    },
  },
  prettier,
);
