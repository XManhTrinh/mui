import { Tag } from '@vkieu/mui/vk';

/**
 * The "Expressive" and "VK" tags beside a component's name, in the gallery and the side
 * navigation. Expressive is tertiary, VK primary, so neither blends into the navigation's
 * current-page `secondary-container`. `compact` (the side navigation) shows Expressive as
 * "M3E", the short name for M3 Expressive; screen readers still hear "Expressive" and a
 * pointer shows the full name.
 */
export function PageChips({
  expressive,
  vk,
  compact = false,
}: {
  expressive?: boolean;
  vk?: boolean;
  compact?: boolean;
}) {
  if (!expressive && !vk) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {expressive ? (
        compact ? (
          <Tag size="sm" tone="tertiary" fullLabel="Expressive" title="M3 Expressive">
            M3E
          </Tag>
        ) : (
          <Tag size="sm" tone="tertiary">
            Expressive
          </Tag>
        )
      ) : null}
      {vk ? (
        <Tag size="sm" tone="primary" {...(compact && { title: 'VK: not part of Material 3' })}>
          VK
        </Tag>
      ) : null}
    </span>
  );
}
