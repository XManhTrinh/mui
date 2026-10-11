import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Button } from '../../components/button/Button';
import { IconButton } from '../../components/icon-button/IconButton';
import { Tooltip, TooltipTrigger } from '../../components/tooltip/Tooltip';
import { FileTrigger, useFileTrigger } from './FileTrigger';

const Icon = () => <svg viewBox="0 0 24 24" />;
const photo = (name = 'photo.png') => new File(['x'], name, { type: 'image/png' });
const choose = (input: HTMLInputElement, files: File[]) =>
  fireEvent.change(input, { target: { files } });

describe('FileTrigger', () => {
  it('opens the picker from the button, by pointer and keyboard', async () => {
    const onSelect = vi.fn();
    const { container } = render(
      <FileTrigger accept={['image/jpeg', 'image/png']} onSelect={onSelect}>
        <Button>Upload</Button>
      </FileTrigger>,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));
    expect(click).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(2);
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png');
    // The button is the control: the input is hidden from everyone.
    expect(input).toHaveAttribute('hidden');
    expect(input).toHaveAttribute('aria-hidden', 'true');
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('reports what was chosen, again for the same file, and never an empty choice', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <FileTrigger multiple onSelect={onSelect}>
        <Button>Upload</Button>
      </FileTrigger>,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const first = photo('a.png');
    choose(input, [first, photo('b.png')]);
    expect(onSelect).toHaveBeenLastCalledWith([first, expect.any(File)]);
    expect(input.value).toBe('');
    choose(input, [first]);
    expect(onSelect).toHaveBeenCalledTimes(2);
    choose(input, []);
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(input).toHaveAttribute('multiple');
  });

  it('opens the camera on phones, and chooses folders where supported', () => {
    const { container } = render(
      <>
        <FileTrigger capture="environment" onSelect={() => {}}>
          <Button>Take photo</Button>
        </FileTrigger>
        <FileTrigger directory onSelect={() => {}}>
          <Button>Upload folder</Button>
        </FileTrigger>
      </>,
    );
    const [camera, folder] = container.querySelectorAll('input[type="file"]');
    expect(camera).toHaveAttribute('capture', 'environment');
    expect(folder).toHaveAttribute('webkitdirectory', '');
  });

  it('works inside a tooltip trigger, keeping the tooltip', async () => {
    const onSelect = vi.fn();
    const { container } = render(
      <TooltipTrigger>
        <FileTrigger onSelect={onSelect}>
          <IconButton icon={<Icon />} aria-label="Change photo" />
        </FileTrigger>
        <Tooltip>Change photo</Tooltip>
      </TooltipTrigger>,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    const button = screen.getByRole('button', { name: 'Change photo' });
    await userEvent.tab();
    expect(button).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Change photo');
    await userEvent.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('does nothing while its button is disabled', async () => {
    const { container } = render(
      <FileTrigger onSelect={() => {}}>
        <Button disabled>Upload</Button>
      </FileTrigger>,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));
    expect(click).not.toHaveBeenCalled();
  });
});

describe('useFileTrigger', () => {
  function MenuLike({ onSelect }: { onSelect: (files: File[]) => void }) {
    const picker = useFileTrigger({ accept: ['image/*'], onSelect });
    const [opened, setOpened] = useState(0);
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setOpened((count) => count + 1);
            picker.open();
          }}
        >
          Upload photo ({opened})
        </button>
        {picker.input}
      </>
    );
  }

  it('opens the picker from any handler and reports the choice', async () => {
    const onSelect = vi.fn();
    const { container } = render(<MenuLike onSelect={onSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    await userEvent.click(screen.getByRole('button', { name: /Upload photo/ }));
    expect(click).toHaveBeenCalledTimes(1);
    const file = photo();
    choose(input, [file]);
    expect(onSelect).toHaveBeenCalledWith([file]);
    expect(input).toHaveAttribute('accept', 'image/*');
  });
});
