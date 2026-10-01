import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useM3Interaction, type M3InteractionOptions } from './use-m3-interaction';

function Pressable(props: M3InteractionOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const { interactionProps, dataAttributes } = useM3Interaction(props, ref);
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={props.isDisabled ? undefined : 0}
      aria-disabled={props.isDisabled || undefined}
      className="state-layer focus-ring"
      {...interactionProps}
      {...dataAttributes}
    >
      Press me
    </div>
  );
}

describe('useM3Interaction', () => {
  it('reports hover and press as data attributes', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Pressable onPress={onPress} />);
    const target = screen.getByRole('button');

    await user.hover(target);
    expect(target).toHaveAttribute('data-hovered');

    await user.pointer({ keys: '[MouseLeft>]', target });
    expect(target).toHaveAttribute('data-pressed');
    await user.pointer({ keys: '[/MouseLeft]', target });
    expect(target).not.toHaveAttribute('data-pressed');
    expect(onPress).toHaveBeenCalledTimes(1);

    await user.unhover(target);
    expect(target).not.toHaveAttribute('data-hovered');
  });

  it('handles keyboard presses', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Pressable onPress={onPress} />);
    const target = screen.getByRole('button');
    target.focus();

    await user.keyboard('[Space>]');
    expect(target).toHaveAttribute('data-pressed');
    await user.keyboard('[/Space]');
    expect(target).not.toHaveAttribute('data-pressed');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the focus ring for keyboard focus only', async () => {
    render(<Pressable />);
    const target = screen.getByRole('button');

    await userEvent.click(target);
    expect(target).toHaveAttribute('data-focused');
    expect(target).not.toHaveAttribute('data-focus-visible');

    target.blur();
    await userEvent.tab();
    expect(target).toHaveAttribute('data-focus-visible');
  });

  it('positions the ripple at the pointer and centres it for keyboard presses', () => {
    render(<Pressable />);
    const target = screen.getByRole('button');
    target.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 20,
        width: 100,
        height: 40,
        right: 110,
        bottom: 60,
        x: 10,
        y: 20,
      }) as DOMRect;

    fireEvent.pointerDown(target, { clientX: 30, clientY: 30, pointerId: 1 });
    expect(target.style.getPropertyValue('--m3-ripple-x')).toBe('20px');
    expect(target.style.getPropertyValue('--m3-ripple-y')).toBe('10px');
    // Farthest corner from (20, 10) in a 100×40 box is (100, 40).
    expect(target.style.getPropertyValue('--m3-ripple-size')).toBe(
      `${Math.ceil(Math.hypot(80, 30))}px`,
    );

    fireEvent.keyDown(target, { key: 'Enter' });
    expect(target.style.getPropertyValue('--m3-ripple-x')).toBe('50px');
    expect(target.style.getPropertyValue('--m3-ripple-y')).toBe('20px');
  });

  it('suppresses interaction states when disabled', async () => {
    const onPress = vi.fn();
    render(<Pressable isDisabled onPress={onPress} />);
    const target = screen.getByRole('button');
    await userEvent.hover(target);
    await userEvent.click(target);
    expect(target).toHaveAttribute('data-disabled');
    expect(target).not.toHaveAttribute('data-hovered');
    expect(target).not.toHaveAttribute('data-pressed');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses an external pressed state and exposes selected and dragged', () => {
    const onPress = vi.fn();
    render(<Pressable isPressed isSelected isDragged onPress={onPress} />);
    const target = screen.getByRole('button');
    expect(target).toHaveAttribute('data-pressed');
    expect(target).toHaveAttribute('data-selected');
    expect(target).toHaveAttribute('data-dragged');
    fireEvent.click(target);
    expect(onPress).not.toHaveBeenCalled();
  });
});
