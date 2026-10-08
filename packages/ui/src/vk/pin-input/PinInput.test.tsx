import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { PinInput } from './PinInput';
import { pinInputStyles } from './pin-input-styles';

const root = (input: HTMLElement) => input.closest('[data-variant]') as HTMLElement;
const boxes = (input: HTMLElement) => [...root(input).querySelectorAll('[data-state]')];
const shown = (input: HTMLElement) =>
  boxes(input)
    .map((box) => box.textContent)
    .join('');

describe('PinInput', () => {
  it('renders one labelled input and a box per character', () => {
    render(<PinInput label="Code" />);
    const input = screen.getByLabelText('Code');
    expect(input.tagName).toBe('INPUT');
    expect(boxes(input)).toHaveLength(6);
    expect(root(input)).toHaveAttribute('data-variant', 'outlined');
    expect(root(input)).toHaveAttribute('data-size', 'medium');
    // The boxes only draw the input; assistive technology sees one field.
    expect(boxes(input)[0]!.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('sets the attributes for one-time codes and the number pad', () => {
    render(<PinInput label="Code" />);
    const input = screen.getByLabelText('Code');
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('turns one-time-code autofill off for PINs and masks the characters', async () => {
    render(<PinInput label="PIN" length={4} mask otp={false} />);
    const input = screen.getByLabelText('PIN');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('type', 'password');
    await userEvent.type(input, '1234');
    expect(input).toHaveValue('1234');
    expect(shown(input)).toBe('');
  });

  it('fills the boxes in order and ignores characters the type does not accept', async () => {
    render(<PinInput label="Code" />);
    const input = screen.getByLabelText('Code');
    await userEvent.type(input, '1a2b3');
    expect(input).toHaveValue('123');
    expect(shown(input)).toBe('123');
    expect(boxes(input)[3]).toHaveAttribute('data-state', 'focus');
  });

  it('upper-cases letter codes', async () => {
    render(<PinInput label="Voucher" length={4} type="alphanumeric" />);
    const input = screen.getByLabelText('Voucher');
    await userEvent.type(input, 'ab12');
    expect(input).toHaveValue('AB12');
  });

  it('cleans a pasted code and fires onComplete once', async () => {
    const onComplete = vi.fn();
    render(<PinInput label="Code" onComplete={onComplete} />);
    const input = screen.getByLabelText('Code');
    await userEvent.click(input);
    await userEvent.paste('Code: 123 456');
    expect(input).toHaveValue('123456');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect(root(input)).toHaveAttribute('data-complete');
    await userEvent.paste('123456');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('deletes with Backspace and moves between boxes with the arrow keys', async () => {
    render(<PinInput label="Code" defaultValue="1234" />);
    const input = screen.getByLabelText('Code') as HTMLInputElement;
    await userEvent.click(input);
    input.setSelectionRange(4, 4);
    fireEvent.select(input);
    await userEvent.keyboard('{Backspace}');
    expect(input).toHaveValue('123');
    await userEvent.keyboard('{ArrowLeft}');
    expect(boxes(input)[2]).toHaveAttribute('data-state', 'focus');
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 3]);
    // Typing replaces the character in the active box.
    await userEvent.keyboard('9');
    expect(input).toHaveValue('129');
    await userEvent.keyboard('{Home}');
    expect(boxes(input)[0]).toHaveAttribute('data-state', 'focus');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [code, setCode] = useState('');
      return (
        <>
          <PinInput label="Code" value={code} onChange={setCode} />
          <output>{code}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText('Code'), '42');
    expect(screen.getByRole('status')).toHaveTextContent('42');
  });

  it('groups the boxes with a decorative separator', () => {
    render(<PinInput label="Code" groups={[2, 2, 2]} separator="·" />);
    const input = screen.getByLabelText('Code');
    expect(root(input).textContent).toBe('Code··');
  });

  it('ignores groups that do not add up to the length, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<PinInput label="Code" groups={[3, 4]} />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('must be positive and add up to length 6'),
    );
    expect(root(screen.getByLabelText('Code')).textContent).toBe('Code');
    warn.mockRestore();
  });

  it('announces the error and marks every box invalid', () => {
    render(
      <PinInput
        label="Code"
        invalid
        errorMessage="That code didn't work."
        supportingText="Check your email"
      />,
    );
    const input = screen.getByLabelText('Code');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/That code didn't work\./);
    expect(boxes(input).every((box) => box.getAttribute('data-state') === 'error')).toBe(true);
  });

  it('is disabled', () => {
    render(<PinInput label="Code" disabled />);
    const input = screen.getByLabelText('Code');
    expect(input).toBeDisabled();
    expect(boxes(input)[0]).toHaveAttribute('data-state', 'disabled');
  });

  it('submits its value under its name', () => {
    const { container } = render(
      <form>
        <PinInput label="Code" name="code" defaultValue="123456" />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).get('code')).toBe('123456');
  });

  it('lets className and classNames win', () => {
    render(<PinInput label="Code" className="w-full" classNames={{ box: 'w-[60px]' }} />);
    const input = screen.getByLabelText('Code');
    expect(root(input)).toHaveClass('w-full');
    expect(boxes(input)[0]).toHaveClass('w-[60px]');
    expect(boxes(input)[0]).not.toHaveClass('w-[48px]');
  });

  it('maps variants, sizes and corners to tokens', () => {
    const filled = pinInputStyles({ variant: 'filled', size: 'large', corner: 'full' });
    expect(filled.box()).toContain('bg-surface-container-highest');
    expect(filled.box()).toContain('rounded-t-(--vk-pin-corner)');
    expect(filled.box()).toContain('text-headline-medium');
    expect(filled.root()).toContain('[--vk-pin-corner:var(--md-sys-shape-corner-full)]');
    const outlined = pinInputStyles({});
    expect(outlined.box()).toContain('border-outline');
    expect(outlined.box()).toContain('h-[56px]');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <PinInput
          label="Code"
          groups={[3, 3]}
          defaultValue="123"
          supportingText="From your email"
        />
        <PinInput
          aria-label="PIN"
          length={4}
          variant="filled"
          mask
          invalid
          errorMessage="Wrong PIN"
        />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
