import { Tag } from '@vkieu/mui/vk';

/**
 * The component tokens: set `--vk-tag-*` on a tag or any ancestor. Here a section gives all
 * its tags a taller, square-cornered look without a new variant.
 */
export function TagTokens() {
  return (
    <div className="flex flex-wrap gap-2 [--vk-tag-corner:var(--md-sys-shape-corner-extra-small)] [--vk-tag-height:28px]">
      <Tag tone="primary">Full-time</Tag>
      <Tag tone="primary">On site</Tag>
      <Tag tone="secondary">£12–14 an hour</Tag>
    </div>
  );
}
