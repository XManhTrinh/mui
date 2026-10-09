/**
 * Pan and zoom maths for {@link ImageCropper}, as pure functions.
 *
 * Sizes are in CSS pixels on screen unless named `natural`. The photo is centred on the
 * frame and then moved by `offset`; `zoom` is relative to the smallest scale at which the
 * photo still covers the frame, so `zoom: 1` is "just covers" and the photo can never leave
 * a gap inside the frame.
 */

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface CropView {
  /** 1 = the photo just covers the frame. */
  zoom: number;
  /** How far the photo's centre sits from the frame's centre, in screen pixels. */
  offset: Point;
}

/** A crop in the oriented photo's natural pixels, as integers. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const INITIAL_VIEW: CropView = { zoom: 1, offset: { x: 0, y: 0 } };

/** The screen scale at which the photo just covers the frame. */
export function coverScale(natural: Size, frame: Size): number {
  return Math.max(frame.width / natural.width, frame.height / natural.height);
}

/** Keeps the zoom within its range and the photo covering the frame. */
export function clampView(view: CropView, natural: Size, frame: Size, maxZoom: number): CropView {
  const zoom = Math.min(Math.max(view.zoom, 1), maxZoom);
  const scale = coverScale(natural, frame) * zoom;
  const limitX = Math.max(0, (natural.width * scale - frame.width) / 2);
  const limitY = Math.max(0, (natural.height * scale - frame.height) / 2);
  return {
    zoom,
    offset: {
      x: Math.min(Math.max(view.offset.x, -limitX), limitX),
      y: Math.min(Math.max(view.offset.y, -limitY), limitY),
    },
  };
}

/** Moves the photo by a screen distance. */
export function panBy(
  view: CropView,
  delta: Point,
  natural: Size,
  frame: Size,
  maxZoom: number,
): CropView {
  return clampView(
    { zoom: view.zoom, offset: { x: view.offset.x + delta.x, y: view.offset.y + delta.y } },
    natural,
    frame,
    maxZoom,
  );
}

/**
 * Zooms to `zoom`, keeping the photo point under `anchor` (relative to the frame's centre)
 * where it is, as a pinch or the mouse wheel expects.
 */
export function zoomTo(
  view: CropView,
  zoom: number,
  anchor: Point,
  natural: Size,
  frame: Size,
  maxZoom: number,
): CropView {
  const next = Math.min(Math.max(zoom, 1), maxZoom);
  const ratio = next / view.zoom;
  return clampView(
    {
      zoom: next,
      offset: {
        x: anchor.x - (anchor.x - view.offset.x) * ratio,
        y: anchor.y - (anchor.y - view.offset.y) * ratio,
      },
    },
    natural,
    frame,
    maxZoom,
  );
}

/**
 * The part of the photo inside the frame, in natural pixels: integers inside the photo,
 * with exactly `aspect` after rounding (within one pixel). Pass the crop's own `aspect`:
 * the frame is measured in whole screen pixels, so its ratio is only close (a 3:1 frame
 * 340px wide measures 113px tall), and that error grows with the photo's size.
 */
export function cropRect(
  view: CropView,
  natural: Size,
  frame: Size,
  aspect: number = frame.width / frame.height,
): CropRect {
  const scale = coverScale(natural, frame) * view.zoom;
  // At least one pixel, however far a tiny photo is zoomed.
  let width = Math.min(natural.width, Math.max(1, Math.round(frame.width / scale)));
  let height = Math.max(1, Math.round(width / aspect));
  if (height > natural.height) {
    height = natural.height;
    width = Math.min(natural.width, Math.max(1, Math.round(height * aspect)));
  }
  const centreX = natural.width / 2 - view.offset.x / scale;
  const centreY = natural.height / 2 - view.offset.y / scale;
  const x = Math.min(Math.max(Math.round(centreX - width / 2), 0), natural.width - width);
  const y = Math.min(Math.max(Math.round(centreY - height / 2), 0), natural.height - height);
  return { x, y, width, height };
}

/** The distance and midpoint of two pointers, for pinch zoom. */
export function pinchOf(a: Point, b: Point): { distance: number; centre: Point } {
  return {
    distance: Math.hypot(a.x - b.x, a.y - b.y),
    centre: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  };
}
