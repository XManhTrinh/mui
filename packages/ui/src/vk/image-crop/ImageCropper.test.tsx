import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { ImageCropDialog } from './ImageCropDialog';
import { ImageCropper, type ImageCropResult } from './ImageCropper';

// jsdom has no layout, image decoding, ResizeObserver or pointer capture: the frame is
// 300×300 at the origin and every photo is 4000×3000.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 300,
    height: 300,
    right: 300,
    bottom: 300,
    toJSON: () => ({}),
  });
  Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
    configurable: true,
    get: () => 4000,
  });
  Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
    configurable: true,
    get: () => 3000,
  });
  HTMLElement.prototype.setPointerCapture = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const area = () => screen.getByRole('group', { name: 'Photo position' });

function loadPhoto(container: HTMLElement) {
  const image = container.querySelector('img');
  if (!image) throw new Error('no image');
  fireEvent.load(image);
  return image;
}

function renderCropper() {
  const onCropChange = vi.fn<(result: ImageCropResult | null) => void>();
  const view = render(<ImageCropper src="photo.jpg" guide="circle" onCropChange={onCropChange} />);
  const last = () => onCropChange.mock.lastCall?.[0];
  return { ...view, onCropChange, last };
}

describe('ImageCropper', () => {
  it('shows a skeleton until the photo loads, then reports the centred crop', () => {
    const { container, last } = renderCropper();
    expect(area()).toHaveAttribute('data-loading');
    expect(area()).toHaveAttribute('tabindex', '-1');
    expect(last()).toBeNull();

    loadPhoto(container);
    expect(area()).not.toHaveAttribute('data-loading');
    expect(area()).toHaveAttribute('tabindex', '0');
    expect(last()).toEqual({
      crop: { x: 500, y: 0, width: 3000, height: 3000 },
      naturalWidth: 4000,
      naturalHeight: 3000,
    });
  });

  it('moves with the arrow keys and zooms with plus, minus and 0', async () => {
    const { container, last } = renderCropper();
    loadPhoto(container);
    area().focus();

    // Right moves the photo right, so the crop moves left: 10px at 0.1 screen px per pixel.
    await userEvent.keyboard('{ArrowRight}');
    expect(last()?.crop.x).toBe(400);
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(last()?.crop.x).toBe(900);

    await userEvent.keyboard('+');
    expect(last()?.crop.width).toBe(Math.round(3000 / 1.1));
    await userEvent.keyboard('-');
    expect(last()?.crop.width).toBe(3000);

    await userEvent.keyboard('0');
    expect(last()?.crop).toEqual({ x: 500, y: 0, width: 3000, height: 3000 });
  });

  it('never leaves a gap: panning stops at the photo edge', async () => {
    const { container, last } = renderCropper();
    loadPhoto(container);
    area().focus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}{Shift>}{ArrowLeft}{ArrowLeft}{/Shift}');
    expect(last()?.crop).toEqual({ x: 1000, y: 0, width: 3000, height: 3000 });
  });

  it('drags with a pointer', () => {
    const { container, last } = renderCropper();
    loadPhoto(container);
    fireEvent.pointerDown(area(), { pointerId: 1, clientX: 150, clientY: 150 });
    expect(area()).toHaveAttribute('data-dragging');
    fireEvent.pointerMove(area(), { pointerId: 1, clientX: 120, clientY: 150 });
    expect(last()?.crop.x).toBe(800);
    fireEvent.pointerUp(area(), { pointerId: 1 });
    expect(area()).not.toHaveAttribute('data-dragging');
  });

  it('zooms with a two-finger pinch', () => {
    const { container, last } = renderCropper();
    loadPhoto(container);
    fireEvent.pointerDown(area(), { pointerId: 1, clientX: 100, clientY: 150 });
    fireEvent.pointerDown(area(), { pointerId: 2, clientX: 200, clientY: 150 });
    fireEvent.pointerMove(area(), { pointerId: 2, clientX: 300, clientY: 150 });
    // The fingers moved twice as far apart, so twice the zoom: half as much photo.
    expect(last()?.crop.width).toBe(1500);
  });

  it('zooms with the slider and the zoom buttons, which stop at the limits', async () => {
    const { container, last } = renderCropper();
    loadPhoto(container);
    const zoomOut = screen.getByRole('button', { name: 'Zoom out' });
    const zoomIn = screen.getByRole('button', { name: 'Zoom in' });
    expect(zoomOut).toBeDisabled();
    await userEvent.click(zoomIn);
    expect(last()?.crop.width).toBe(Math.round(3000 / 1.1));
    expect(zoomOut).toBeEnabled();

    const slider = screen.getByRole('slider', { name: 'Zoom' });
    act(() => slider.focus());
    await userEvent.keyboard('{End}');
    expect(last()?.crop.width).toBe(750);
    expect(zoomIn).toBeDisabled();
  });

  it('shows an error and reports nothing for a photo that cannot be opened', () => {
    const { container, last } = renderCropper();
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('alert')).toHaveTextContent("This photo can't be opened");
    expect(area()).toHaveAttribute('data-error');
    expect(last()).toBeNull();
  });

  it('starts over when the photo changes', () => {
    const { container, rerender, last, onCropChange } = renderCropper();
    loadPhoto(container);
    rerender(<ImageCropper src="other.jpg" onCropChange={onCropChange} />);
    expect(area()).toHaveAttribute('data-loading');
    expect(last()).toBeNull();
  });

  it('describes the keyboard controls and has no axe violations', async () => {
    const { container } = renderCropper();
    loadPhoto(container);
    expect(area()).toHaveAccessibleDescription(/arrow keys/);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('ImageCropDialog', () => {
  function Upload({ busy = false }: { busy?: boolean }) {
    const [open, setOpen] = useState(true);
    const [saved, setSaved] = useState<ImageCropResult | null>(null);
    return (
      <>
        <ImageCropDialog
          open={open}
          onOpenChange={setOpen}
          src="photo.jpg"
          busy={busy}
          onConfirm={setSaved}
        />
        {!open && <p>closed</p>}
        {saved && <p>saved {saved.crop.width}</p>}
      </>
    );
  }

  it('confirms the crop once the photo is ready', async () => {
    render(<Upload />);
    const dialog = screen.getByRole('dialog', { name: 'Adjust your photo' });
    const save = screen.getAllByRole('button', { name: 'Save' });
    for (const button of save) expect(button).toBeDisabled();
    loadPhoto(dialog);
    await userEvent.click(screen.getAllByRole('button', { name: 'Save' }).at(-1)!);
    expect(screen.getByText('saved 3000')).toBeInTheDocument();
  });

  it('cancels', async () => {
    render(<Upload />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.getByText('closed')).toBeInTheDocument());
  });

  it("can't be dismissed while busy, and shows progress", async () => {
    render(<Upload busy />);
    expect(screen.getByRole('progressbar', { name: 'Uploading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByText('closed')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { baseElement } = render(<Upload />);
    loadPhoto(screen.getByRole('dialog'));
    expect(await axeViolations(baseElement)).toEqual([]);
  });
});
