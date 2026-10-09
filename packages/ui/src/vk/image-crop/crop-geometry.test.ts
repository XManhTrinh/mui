import { describe, expect, it } from 'vitest';
import {
  clampView,
  coverScale,
  cropRect,
  INITIAL_VIEW,
  panBy,
  pinchOf,
  zoomTo,
  type CropView,
  type Size,
} from './crop-geometry';

const square: Size = { width: 300, height: 300 };
const landscape: Size = { width: 4000, height: 3000 };
const portrait: Size = { width: 3000, height: 4000 };

describe('coverScale', () => {
  it('scales the shorter side to the frame', () => {
    expect(coverScale(landscape, square)).toBe(0.1);
    expect(coverScale(portrait, square)).toBe(0.1);
    expect(coverScale({ width: 100, height: 100 }, square)).toBe(3);
  });
});

describe('clampView', () => {
  it('keeps the zoom between 1 and the maximum', () => {
    expect(clampView({ zoom: 0.5, offset: { x: 0, y: 0 } }, landscape, square, 4).zoom).toBe(1);
    expect(clampView({ zoom: 9, offset: { x: 0, y: 0 } }, landscape, square, 4).zoom).toBe(4);
  });

  it('never leaves a gap inside the frame', () => {
    // At zoom 1 a 4:3 photo is 400×300 on screen: it can move 50px sideways and not at all up.
    const view = clampView({ zoom: 1, offset: { x: 500, y: -500 } }, landscape, square, 4);
    expect(view.offset).toEqual({ x: 50, y: -0 });
  });
});

describe('panBy and zoomTo', () => {
  it('pans within the limits', () => {
    const view = panBy(INITIAL_VIEW, { x: -30, y: 10 }, landscape, square, 4);
    expect(view.offset).toEqual({ x: -30, y: 0 });
  });

  it('keeps the point under the anchor still while zooming', () => {
    const anchor = { x: 60, y: -40 };
    const before: CropView = { zoom: 2, offset: { x: 20, y: 10 } };
    const after = zoomTo(before, 3, anchor, landscape, square, 4);
    // The photo point under the anchor, in natural pixels, is the same before and after.
    const under = (view: CropView) => {
      const scale = coverScale(landscape, square) * view.zoom;
      return {
        x: (anchor.x - view.offset.x) / scale,
        y: (anchor.y - view.offset.y) / scale,
      };
    };
    expect(under(after).x).toBeCloseTo(under(before).x);
    expect(under(after).y).toBeCloseTo(under(before).y);
  });

  it('clamps when zooming out near an edge', () => {
    const view = zoomTo(
      { zoom: 4, offset: { x: 750, y: 0 } },
      1,
      { x: 0, y: 0 },
      landscape,
      square,
      4,
    );
    expect(view).toEqual({ zoom: 1, offset: { x: 50, y: 0 } });
  });
});

describe('cropRect', () => {
  it('is the centred square of the shorter side at zoom 1', () => {
    expect(cropRect(INITIAL_VIEW, landscape, square)).toEqual({
      x: 500,
      y: 0,
      width: 3000,
      height: 3000,
    });
    expect(cropRect(INITIAL_VIEW, portrait, square)).toEqual({
      x: 0,
      y: 500,
      width: 3000,
      height: 3000,
    });
  });

  it('follows zoom and offset', () => {
    // Zoom 2: 1500px of the photo in the frame. Moved 50px right on screen at scale 0.2,
    // so the frame shows 250px further left in the photo.
    expect(cropRect({ zoom: 2, offset: { x: 50, y: 0 } }, landscape, square)).toEqual({
      x: 1000,
      y: 750,
      width: 1500,
      height: 1500,
    });
  });

  it('keeps the frame aspect ratio for non-square frames', () => {
    const frame = { width: 320, height: 400 }; // 4:5
    for (const zoom of [1, 1.37, 2.9]) {
      const rect = cropRect({ zoom, offset: { x: 0, y: 0 } }, landscape, frame);
      expect(Math.abs(rect.width / rect.height - 0.8)).toBeLessThan(1 / rect.height);
      expect(rect.x + rect.width).toBeLessThanOrEqual(landscape.width);
      expect(rect.y + rect.height).toBeLessThanOrEqual(landscape.height);
    }
  });

  it('stays inside very large and very small photos', () => {
    for (const natural of [
      { width: 8000, height: 6000 },
      { width: 100, height: 80 },
      { width: 1, height: 1 },
    ]) {
      for (const view of [INITIAL_VIEW, { zoom: 4, offset: { x: 10000, y: -10000 } }]) {
        const rect = cropRect(clampView(view, natural, square, 4), natural, square);
        expect(rect.x).toBeGreaterThanOrEqual(0);
        expect(rect.y).toBeGreaterThanOrEqual(0);
        expect(rect.width).toBeGreaterThanOrEqual(1);
        expect(rect.x + rect.width).toBeLessThanOrEqual(natural.width);
        expect(rect.y + rect.height).toBeLessThanOrEqual(natural.height);
        expect(Number.isInteger(rect.x + rect.y + rect.width + rect.height)).toBe(true);
      }
    }
  });
});

describe('pinchOf', () => {
  it('gives the distance and midpoint', () => {
    expect(pinchOf({ x: 0, y: 0 }, { x: 30, y: 40 })).toEqual({
      distance: 50,
      centre: { x: 15, y: 20 },
    });
  });
});
