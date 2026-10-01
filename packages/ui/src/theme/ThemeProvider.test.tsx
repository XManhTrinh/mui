import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setMediaQueries } from '../../test/setup';
import { useTheme } from './context';
import { createTheme } from './create-theme';
import { serializeThemeState } from './state';
import { ThemeProvider } from './ThemeProvider';

function ThemeControls() {
  const { theme, mode, resolvedMode, contrast, motion, themes, setTheme, setMode } = useTheme();
  return (
    <div>
      <output aria-label="state">{`${theme} ${mode} ${resolvedMode} ${contrast} ${motion}`}</output>
      <output aria-label="themes">{themes.join(',')}</output>
      <button onClick={() => setTheme('ocean')}>ocean</button>
      <button onClick={() => setTheme('unknown')}>unknown</button>
      <button onClick={() => setMode('dark')}>dark</button>
    </div>
  );
}

const html = document.documentElement;
const state = () => screen.getByLabelText('state').textContent;

describe('ThemeProvider', () => {
  it('applies the defaults to <html>', () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    );
    expect(state()).toBe('baseline system light standard expressive');
    expect(html).toHaveAttribute('data-theme', 'baseline');
    expect(html).toHaveAttribute('data-mode', 'system');
    expect(html).toHaveAttribute('data-contrast', 'standard');
    expect(html).toHaveAttribute('data-motion', 'expressive');
    expect(screen.getByLabelText('themes')).toHaveTextContent(
      'baseline,ocean,forest,sunset,rose,slate',
    );
  });

  it('updates attributes and the cookie when the theme changes', async () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'ocean' }));
    await userEvent.click(screen.getByRole('button', { name: 'dark' }));
    expect(html).toHaveAttribute('data-theme', 'ocean');
    expect(html).toHaveAttribute('data-mode', 'dark');
    expect(state()).toBe('ocean dark dark standard expressive');
    expect(document.cookie).toContain(
      `vkieu-mui-theme=${serializeThemeState({ theme: 'ocean', mode: 'dark', contrast: 'standard', motion: 'expressive' })}`,
    );
  });

  it('restores the stored selection on mount', () => {
    document.cookie = `vkieu-mui-theme=${serializeThemeState({ theme: 'forest', mode: 'light', contrast: 'high', motion: 'standard' })}`;
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    );
    expect(state()).toBe('forest light light high standard');
    expect(html).toHaveAttribute('data-contrast', 'high');
  });

  it('supports localStorage and no persistence', async () => {
    const { unmount } = render(
      <ThemeProvider storage="local-storage">
        <ThemeControls />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'ocean' }));
    expect(window.localStorage.getItem('vkieu-mui-theme')).toContain('ocean');
    expect(document.cookie).not.toContain('vkieu-mui-theme');
    unmount();
    window.localStorage.clear();

    render(
      <ThemeProvider storage="none">
        <ThemeControls />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'ocean' }));
    expect(window.localStorage.getItem('vkieu-mui-theme')).toBeNull();
    expect(document.cookie).not.toContain('vkieu-mui-theme');
  });

  it('resolves system mode from prefers-color-scheme and follows changes', () => {
    setMediaQueries({ '(prefers-color-scheme: dark)': true });
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    );
    expect(state()).toBe('baseline system dark standard expressive');
    act(() => setMediaQueries({ '(prefers-color-scheme: dark)': false }));
    expect(state()).toBe('baseline system light standard expressive');
  });

  it('can be controlled', async () => {
    const onThemeChange = vi.fn();
    render(
      <ThemeProvider theme="rose" onThemeChange={onThemeChange}>
        <ThemeControls />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'ocean' }));
    expect(onThemeChange).toHaveBeenCalledWith('ocean');
    expect(html).toHaveAttribute('data-theme', 'rose');
  });

  it('ignores themes that are not available', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ThemeProvider themes={['baseline', 'forest']}>
        <ThemeControls />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'ocean' }));
    expect(html).toHaveAttribute('data-theme', 'baseline');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('setTheme("ocean") ignored'));
    warn.mockRestore();
  });

  it('injects CSS for custom themes and allows selecting them', () => {
    const acme = createTheme({ name: 'acme', seed: '#0B57D0', contrast: 'standard' });
    render(
      <ThemeProvider themes={['baseline', acme]} defaultTheme="acme">
        <ThemeControls />
      </ThemeProvider>,
    );
    expect(html).toHaveAttribute('data-theme', 'acme');
    const style = document.head.querySelector('style[data-href="vkieu-mui-theme-acme"]');
    expect(style?.textContent).toContain('[data-theme="acme"]');
  });

  it('leaves <html> alone when applyToDocument is false', () => {
    render(
      <ThemeProvider applyToDocument={false}>
        <ThemeControls />
      </ThemeProvider>,
    );
    expect(html).not.toHaveAttribute('data-theme');
  });
});
