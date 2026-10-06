import { tv, type VariantProps } from '../../utils/tv';

/*
 * CodeBlock is a docs-support `vk` component, NOT an M3 component (architecture decision
 * #22). Syntax highlighting is produced at build time by Shiki's CSS-variables theme,
 * which emits inline `color:var(--shiki-token-…)` references on the token spans. Binding
 * those `--shiki-*` custom properties to the library's semantic colour roles on the root
 * lets a single build-time highlight follow every theme, mode and contrast level.
 * Every class is written out in full so Tailwind can find it.
 */

/**
 * Shiki's `createCssVariablesTheme` custom properties mapped to M3 semantic colour roles.
 * The variable names are the full set that theme emits (verified against shiki 4.5.0); the
 * `--shiki-foreground` default keeps any unmapped future token legible rather than invisible.
 */
const shikiTokens = [
  '[--shiki-foreground:var(--md-sys-color-on-surface)]',
  '[--shiki-background:transparent]',
  '[--shiki-token-keyword:var(--md-sys-color-primary)]',
  '[--shiki-token-string:var(--md-sys-color-tertiary)]',
  '[--shiki-token-string-expression:var(--md-sys-color-tertiary)]',
  '[--shiki-token-constant:var(--md-sys-color-secondary)]',
  '[--shiki-token-function:var(--md-sys-color-primary)]',
  '[--shiki-token-parameter:var(--md-sys-color-on-surface)]',
  '[--shiki-token-comment:var(--md-sys-color-on-surface-variant)]',
  '[--shiki-token-punctuation:var(--md-sys-color-on-surface)]',
  '[--shiki-token-link:var(--md-sys-color-primary)]',
  '[--shiki-token-inserted:var(--md-sys-color-tertiary)]',
  '[--shiki-token-deleted:var(--md-sys-color-error)]',
  '[--shiki-token-changed:var(--md-sys-color-secondary)]',
];

/** Variant definitions for {@link CodeBlock}. */
export const codeBlockStyles = tv({
  slots: {
    root: [
      'relative flex flex-col overflow-hidden rounded-corner-medium',
      'border border-outline-variant bg-surface-container text-on-surface',
      ...shikiTokens,
    ],
    header: [
      'flex min-h-[48px] items-center justify-between gap-2 ps-4 pe-2',
      'border-b border-outline-variant',
    ],
    title: 'min-w-0 truncate font-plain text-label-large text-on-surface-variant',
    pre: 'overflow-x-auto p-4 font-mono text-body-medium [color:var(--shiki-foreground)]',
    code: 'font-mono [color:var(--shiki-foreground)]',
    copyButton: '',
  },
  variants: {
    showLineNumbers: {
      true: {
        code: [
          '[counter-reset:line]',
          '[&_.line]:before:mr-6 [&_.line]:before:inline-block [&_.line]:before:w-6',
          '[&_.line]:before:text-right [&_.line]:before:text-on-surface-variant [&_.line]:before:select-none',
          '[&_.line]:before:[counter-increment:line] [&_.line]:before:[content:counter(line)]',
        ],
      },
      false: {},
    },
  },
  defaultVariants: { showLineNumbers: false },
});

export type CodeBlockStyleProps = VariantProps<typeof codeBlockStyles>;
