/**
 * The "Expressive" and "VK" chips beside a component's name, in the gallery and the side
 * navigation. Expressive is `tertiary-container`, VK `primary-container`, so neither blends
 * into the navigation's current-page `secondary-container`. `compact` (the side navigation)
 * shows Expressive as "M3E", the short name for M3 Expressive, while screen readers still
 * hear "Expressive" and a pointer shows the full name.
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
        <span
          title={compact ? 'M3 Expressive' : undefined}
          className="rounded-corner-full bg-tertiary-container px-2 py-0.5 text-label-small text-on-tertiary-container"
        >
          {compact ? (
            <>
              <span aria-hidden="true">M3E</span>
              <span className="sr-only">Expressive</span>
            </>
          ) : (
            'Expressive'
          )}
        </span>
      ) : null}
      {vk ? (
        <span
          title={compact ? 'VK: not part of Material 3' : undefined}
          className="rounded-corner-full bg-primary-container px-2 py-0.5 text-label-small text-on-primary-container"
        >
          VK
        </span>
      ) : null}
    </span>
  );
}
