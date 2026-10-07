// @vitest-environment node
import { compile } from '@tailwindcss/node';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const base = fileURLToPath(new URL('../src/styles/', import.meta.url));

describe('vk-skeleton utility', () => {
  let css: string;

  beforeAll(async () => {
    const compiler = await compile(`@import 'tailwindcss';\n@import './styles.css';`, {
      base,
      onDependency: () => {},
    });
    css = compiler.build(['vk-skeleton']);
  });

  it('fills with the tone variable, defaulting to surface-container-highest', () => {
    expect(css).toContain(
      'background-color: var(--vk-skeleton-fill, var(--md-sys-color-surface-container-highest))',
    );
  });

  it('pulses on the M3 duration and easing tokens by default', () => {
    expect(css).toMatch(/@keyframes vk-skeleton-pulse/);
    expect(css).toMatch(
      /animation: vk-skeleton-pulse var\(--md-sys-motion-duration-extra-long-4\)\s+var\(--md-sys-motion-easing-standard\) infinite alternate/,
    );
  });

  it('shimmers with an on-surface highlight at the hover state-layer opacity, mirrored in RTL', () => {
    expect(css).toMatch(/@keyframes vk-skeleton-shimmer/);
    expect(css).toContain('var(--md-sys-state-hover-state-layer-opacity)');
    expect(css).toContain("[data-skeleton-animation='shimmer']");
    expect(css).toMatch(/\[dir='rtl'\] \*\)[\s\S]*?animation-direction: reverse/);
    // `:dir()` is rewritten to `:lang()` by Lightning CSS for older targets, so it isn't used.
    expect(css).not.toContain(':dir(rtl)');
  });

  it('stops under reduced motion and stays visible in forced colours', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none/);
    expect(css).toMatch(/@media \(forced-colors: active\)[\s\S]*?outline: 1px solid CanvasText/);
  });
});
