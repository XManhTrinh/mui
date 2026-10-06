import { LoadingIndicator } from '@vkieu/mui';

/**
 * `shapes` takes at least two shapes to morph through, named from `MaterialShapes`. (A
 * sequence of `RoundedPolygon`s from `@vkieu/mui/primitives` also works.) Omitting `shapes`
 * uses Compose's default sequences.
 */
export function LoadingShapes() {
  return (
    <div className="flex items-center gap-8">
      <LoadingIndicator shapes={['Heart', 'Flower', 'Clover4Leaf', 'Burst']} aria-label="Loading" />
      <LoadingIndicator
        variant="contained"
        shapes={['Pill', 'Diamond', 'Pentagon', 'Gem']}
        aria-label="Loading"
      />
    </div>
  );
}
