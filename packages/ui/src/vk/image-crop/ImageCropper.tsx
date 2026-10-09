'use client';

import {
  useEffect,
  useId,
  useMemo,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { useFocusRing } from 'react-aria';
import { IconButton } from '../../components/icon-button/IconButton';
import { Slider } from '../../components/slider/Slider';
import { cn } from '../../utils/cn';
import { Skeleton } from '../skeleton/Skeleton';
import {
  clampView,
  coverScale,
  cropRect,
  INITIAL_VIEW,
  panBy,
  pinchOf,
  zoomTo,
  type CropRect,
  type CropView,
  type Point,
  type Size,
} from './crop-geometry';
import { imageCropStyles } from './image-crop-styles';

/** Material Symbols "remove" (Apache-2.0). */
function ZoomOutIcon() {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor">
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
}

/** Material Symbols "add" (Apache-2.0). */
function ZoomInIcon() {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor">
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
}

/** Where to crop, for the server to cut from the original photo. */
export interface ImageCropResult {
  /**
   * The crop in the photo's natural pixels, after its EXIF orientation is applied, so a
   * server must auto-rotate before cropping (`sharp().rotate().extract(crop)`).
   */
  crop: CropRect;
  /** The oriented photo's size, to check the crop against the uploaded file. */
  naturalWidth: number;
  naturalHeight: number;
}

export interface ImageCropperLabels {
  /** Names the area that holds the photo. */
  area: string;
  /** How to move and zoom without a pointer; read by screen readers. */
  instructions: string;
  zoom: string;
  zoomIn: string;
  zoomOut: string;
  /** Shown when the photo can't be opened. */
  error: string;
}

const DEFAULT_LABELS: ImageCropperLabels = {
  area: 'Photo position',
  instructions:
    'Drag, or use the arrow keys, to move the photo. Use plus and minus to zoom, and 0 to reset.',
  zoom: 'Zoom',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  error: "This photo can't be opened. Try a JPEG or PNG file.",
};

export interface ImageCropperClassNames {
  root?: string;
  area?: string;
  image?: string;
  frame?: string;
  controls?: string;
  slider?: string;
}

export interface ImageCropperProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** The photo: an object URL of a picked file, or any image URL. */
  src: string;
  /** The frame's width divided by its height. @default 1 */
  aspect?: number;
  /** `circle` draws a dashed circle in the frame, showing what a round avatar shows. @default "none" */
  guide?: 'circle' | 'none';
  /** How far the photo can be zoomed past "just covers the frame". @default 4 */
  maxZoom?: number;
  /** Called with the crop whenever it changes, and with `null` while loading or on error. */
  onCropChange?: (result: ImageCropResult | null) => void;
  labels?: Partial<ImageCropperLabels>;
  classNames?: ImageCropperClassNames;
}

type Status = 'loading' | 'ready' | 'error';

const ARROW_STEPS: Record<string, Point> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};
const KEY_ZOOM_FACTOR = 1.1;

/**
 * Frames a photo for upload: drag (or pinch, scroll, or use the keyboard and the zoom
 * slider) to move and zoom it behind a fixed frame. Reports the crop in the original
 * photo's pixels, so a server crops at full quality; nothing is re-encoded in the browser.
 *
 * Not an M3 component (`@vkieu/mui/vk`, docs/plans/image-crop-dialog.md). Usually opened
 * through `ImageCropDialog`.
 *
 * @example
 * <ImageCropper src={objectUrl} guide="circle" onCropChange={setCrop} />
 */
export function ImageCropper({
  src,
  aspect = 1,
  guide = 'none',
  maxZoom = 4,
  onCropChange,
  labels: labelsProp,
  className,
  classNames,
  ...props
}: ImageCropperProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const styles = imageCropStyles();
  const instructionsId = useId();
  const areaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, Point>());

  const [shownSrc, setShownSrc] = useState(src);
  const [status, setStatus] = useState<Status>('loading');
  const [natural, setNatural] = useState<Size | null>(null);
  const [frame, setFrame] = useState<Size | null>(null);
  const [view, setView] = useState<CropView>(INITIAL_VIEW);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const { focusProps, isFocusVisible } = useFocusRing();

  // A new photo starts over (adjusting state while rendering, as React recommends).
  if (src !== shownSrc) {
    setShownSrc(src);
    setStatus('loading');
    setNatural(null);
    setView(INITIAL_VIEW);
  }

  const ready = status === 'ready' && natural !== null && frame !== null;
  // Clamped while rendering, so the photo keeps covering the frame when the frame resizes.
  const shown = useMemo(
    () => (natural && frame ? clampView(view, natural, frame, maxZoom) : view),
    [view, natural, frame, maxZoom],
  );

  // The frame's size on screen, kept current as the window or dialog resizes.
  useLayoutEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    // Layout size, not getBoundingClientRect: a dialog's opening scale would shrink it.
    const measure = () => {
      const { offsetWidth: width, offsetHeight: height } = element;
      if (width > 0 && height > 0) setFrame({ width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // A photo that finished loading before hydration never fires `load`.
  useLayoutEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setNatural({ width: image.naturalWidth, height: image.naturalHeight });
      setStatus('ready');
    }
  }, [shownSrc]);

  useEffect(() => {
    if (!onCropChange) return;
    if (!ready) {
      onCropChange(null);
      return;
    }
    onCropChange({
      crop: cropRect(shown, natural, frame),
      naturalWidth: natural.width,
      naturalHeight: natural.height,
    });
  }, [ready, shown, natural, frame, onCropChange]);

  // The mouse wheel and trackpad pinch zoom around the pointer. React's wheel listener is
  // passive, so the page would scroll too; this one can prevent that.
  useEffect(() => {
    const area = areaRef.current;
    if (!area || !ready) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Trackpad pinches arrive as wheel events with ctrlKey and small deltas.
      const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002));
      const anchor = fromFrameCentre(frameRef.current, { x: event.clientX, y: event.clientY });
      setSettling(false);
      setView((current) => zoomTo(current, current.zoom * factor, anchor, natural, frame, maxZoom));
    };
    area.addEventListener('wheel', onWheel, { passive: false });
    return () => area.removeEventListener('wheel', onWheel);
  }, [ready, natural, frame, maxZoom]);

  const update = (next: (current: CropView) => CropView) => {
    if (!ready) return;
    setSettling(false);
    setView(next);
  };

  const reset = () => {
    if (!ready) return;
    setSettling(true);
    setView(INITIAL_VIEW);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!ready) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous || !ready) return;
    const point = { x: event.clientX, y: event.clientY };
    const others = [...pointers.current.entries()].filter(([id]) => id !== event.pointerId);
    pointers.current.set(event.pointerId, point);
    if (others.length === 0) {
      update((current) =>
        panBy(
          current,
          { x: point.x - previous.x, y: point.y - previous.y },
          natural,
          frame,
          maxZoom,
        ),
      );
      return;
    }
    // Two fingers: zoom by the change in their distance around their midpoint, and move with it.
    const other = others[0]?.[1];
    if (!other) return;
    const before = pinchOf(previous, other);
    const after = pinchOf(point, other);
    if (before.distance === 0) return;
    const anchor = fromFrameCentre(frameRef.current, after.centre);
    update((current) =>
      panBy(
        zoomTo(
          current,
          (current.zoom * after.distance) / before.distance,
          anchor,
          natural,
          frame,
          maxZoom,
        ),
        { x: after.centre.x - before.centre.x, y: after.centre.y - before.centre.y },
        natural,
        frame,
        maxZoom,
      ),
    );
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) setDragging(false);
  };

  const zoomBy = (factor: number) => {
    if (!ready) return;
    update((current) =>
      zoomTo(current, current.zoom * factor, { x: 0, y: 0 }, natural, frame, maxZoom),
    );
  };

  const zoomToPercent = (percent: number) => {
    if (!ready) return;
    update((current) => zoomTo(current, percent / 100, { x: 0, y: 0 }, natural, frame, maxZoom));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!ready) return;
    const step = ARROW_STEPS[event.key];
    if (step) {
      const distance = event.shiftKey ? 50 : 10;
      update((current) =>
        panBy(current, { x: step.x * distance, y: step.y * distance }, natural, frame, maxZoom),
      );
    } else if (event.key === '+' || event.key === '=') {
      zoomBy(KEY_ZOOM_FACTOR);
    } else if (event.key === '-' || event.key === '_') {
      zoomBy(1 / KEY_ZOOM_FACTOR);
    } else if (event.key === '0') {
      reset();
    } else {
      return;
    }
    event.preventDefault();
  };

  const scale = ready ? coverScale(natural, frame) * shown.zoom : 0;
  const loading = status === 'loading' || undefined;
  const error = status === 'error' || undefined;

  return (
    <div {...props} className={styles.root({ class: cn(classNames?.root, className) })}>
      <div
        {...focusProps}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
        ref={areaRef}
        role="group"
        aria-label={labels.area}
        aria-describedby={instructionsId}
        tabIndex={status === 'ready' ? 0 : -1}
        data-loading={loading}
        data-error={error}
        data-dragging={dragging || undefined}
        data-focus-visible={isFocusVisible || undefined}
        className={styles.area({ class: classNames?.area })}
      >
        <img
          ref={imageRef}
          src={shownSrc}
          alt=""
          draggable={false}
          onLoad={(event) => {
            const image = event.currentTarget;
            setNatural({ width: image.naturalWidth, height: image.naturalHeight });
            setStatus('ready');
          }}
          onError={() => setStatus('error')}
          onTransitionEnd={() => setSettling(false)}
          data-loading={ready ? undefined : true}
          data-settling={settling || undefined}
          style={
            ready
              ? {
                  width: natural.width * scale,
                  height: natural.height * scale,
                  translate: `calc(-50% + ${shown.offset.x}px) calc(-50% + ${shown.offset.y}px)`,
                }
              : undefined
          }
          className={styles.image({ class: classNames?.image })}
        />
        <div
          ref={frameRef}
          aria-hidden="true"
          data-loading={loading}
          data-error={error}
          style={{ aspectRatio: aspect }}
          className={styles.frame({ class: classNames?.frame })}
        >
          {status === 'loading' && <Skeleton corner="none" className={styles.skeleton()} />}
          {status === 'ready' && guide === 'circle' && <span className={styles.guide()} />}
        </div>
        {status === 'error' && (
          <p role="alert" className={styles.error()}>
            {labels.error}
          </p>
        )}
        <p id={instructionsId} className={styles.instructions()}>
          {labels.instructions}
        </p>
      </div>
      <div className={styles.controls({ class: classNames?.controls })}>
        <IconButton
          icon={<ZoomOutIcon />}
          aria-label={labels.zoomOut}
          disabled={!ready || shown.zoom <= 1}
          onPress={() => zoomBy(1 / KEY_ZOOM_FACTOR)}
        />
        <Slider
          aria-label={labels.zoom}
          minValue={100}
          maxValue={maxZoom * 100}
          value={Math.round(shown.zoom * 100)}
          onChange={zoomToPercent}
          disabled={!ready}
          formatOptions={{ style: 'unit', unit: 'percent', maximumFractionDigits: 0 }}
          className={styles.slider({ class: classNames?.slider })}
        />
        <IconButton
          icon={<ZoomInIcon />}
          aria-label={labels.zoomIn}
          disabled={!ready || shown.zoom >= maxZoom}
          onPress={() => zoomBy(KEY_ZOOM_FACTOR)}
        />
      </div>
    </div>
  );
}

/** A screen point relative to the frame's centre. */
function fromFrameCentre(frame: HTMLElement | null, point: Point): Point {
  if (!frame) return { x: 0, y: 0 };
  const rect = frame.getBoundingClientRect();
  return { x: point.x - (rect.left + rect.width / 2), y: point.y - (rect.top + rect.height / 2) };
}
