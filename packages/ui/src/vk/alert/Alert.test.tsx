import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Button } from '../../components/button/Button';
import { generateSchemeColors } from '../../theme/scheme';
import {
  BUILT_IN_THEMES,
  BUILT_IN_THEME_NAMES,
  CONTRAST_LEVEL_NAMES,
  type ColorRole,
} from '../../tokens/color';
import { Alert } from './Alert';
import { alertStyles, type AlertTone } from './alert-styles';

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
};

/** The role a style string reads for a variable, e.g. `content` → `on-error-container`. */
const roleOf = (classes: string, name: string) =>
  new RegExp(`--vk-alert-${name},var\\(--md-sys-color-([a-z-]+)\\)`).exec(classes)?.[1] as
    ColorRole | undefined;

const TONES: AlertTone[] = ['error', 'info', 'success', 'warning', 'neutral'];

describe('Alert', () => {
  it('reads an error at once and other tones politely', () => {
    const { rerender } = render(<Alert>That email and password don't match.</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent("That email and password don't match.");
    expect(screen.getByRole('alert')).toHaveAttribute('data-tone', 'error');
    rerender(<Alert tone="info">You're offline.</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent("You're offline.");
  });

  it('shows a title, the tone icon, actions and a close button', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Alert
        tone="warning"
        title="Payment pending"
        titleAs="h2"
        actions={<Button variant="text">Update card</Button>}
        onClose={onClose}
        labels={{ close: 'Đóng' }}
      >
        Your bank hasn't confirmed the payment yet.
      </Alert>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Payment pending' })).toBeInTheDocument();
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Update card' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Đóng' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('replaces or removes the icon', () => {
    const { container, rerender } = render(<Alert icon={null}>No icon</Alert>);
    expect(container.querySelector('svg')).toBeNull();
    rerender(<Alert icon={<span data-testid="custom" />}>Custom</Alert>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('takes focus when asked, once', () => {
    render(<Alert focusOnMount>Fix the highlighted fields.</Alert>);
    expect(screen.getByRole('alert')).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveAttribute('tabindex', '-1');
  });

  it('keeps the text readable and the outline and icon visible everywhere', () => {
    for (const name of BUILT_IN_THEME_NAMES) {
      for (const isDark of [false, true]) {
        for (const level of CONTRAST_LEVEL_NAMES) {
          const colors = generateSchemeColors(BUILT_IN_THEMES[name], isDark, level);
          for (const tone of TONES) {
            const where = `${name} ${isDark ? 'dark' : 'light'} ${level} ${tone}`;
            const tonal = alertStyles({ tone, variant: 'tonal' });
            const container = colors[roleOf(tonal.root(), 'container') as ColorRole];
            const content = colors[roleOf(tonal.root(), 'content') as ColorRole];
            expect(contrast(content, container), `${where} tonal`).toBeGreaterThanOrEqual(4.5);
            const outlined = alertStyles({ tone, variant: 'outlined' });
            const text = colors[roleOf(outlined.root(), 'content') as ColorRole];
            const outline = colors[roleOf(outlined.root(), 'outline') as ColorRole];
            const iconColor = colors[roleOf(outlined.icon(), 'icon') as ColorRole];
            expect(contrast(text, colors.surface), `${where} outlined`).toBeGreaterThanOrEqual(4.5);
            expect(contrast(outline, colors.surface), `${where} outline`).toBeGreaterThanOrEqual(3);
            expect(contrast(iconColor, colors.surface), `${where} icon`).toBeGreaterThanOrEqual(3);
          }
        }
      }
    }
  });

  it('gives text buttons the tonal alert colour, which is readable on its container', () => {
    render(
      <Alert actions={<Button variant="text">Update card</Button>}>Your card was declined.</Alert>,
    );
    const actions = screen.getByRole('button', { name: 'Update card' }).parentElement;
    expect(actions).toHaveClass('[&_.text-primary]:text-inherit');
    expect(alertStyles({ variant: 'outlined' }).actions()).not.toContain('text-inherit');
  });

  it('lets consumer classes win', () => {
    render(
      <Alert className="py-2" classNames={{ message: 'text-body-large' }}>
        Message
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveClass('py-2');
    expect(screen.getByRole('alert')).not.toHaveClass('py-[14px]');
    expect(screen.getByText('Message')).toHaveClass('text-body-large');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <Alert title="Your payment failed" actions={<Button variant="text">Update card</Button>}>
          Your card was declined.
        </Alert>
        <Alert tone="success" variant="outlined" onClose={() => undefined}>
          Saved.
        </Alert>
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
