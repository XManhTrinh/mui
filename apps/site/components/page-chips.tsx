/**
 * The "Expressive" and "VK" chips beside a component's name, in the gallery and the side
 * navigation. Expressive is `tertiary-container`, VK `primary-container`, so neither blends
 * into the navigation's current-page `secondary-container`.
 */
export function PageChips({ expressive, vk }: { expressive?: boolean; vk?: boolean }) {
  if (!expressive && !vk) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {expressive ? (
        <span className="rounded-corner-full bg-tertiary-container px-2 py-0.5 text-label-small text-on-tertiary-container">
          Expressive
        </span>
      ) : null}
      {vk ? (
        <span className="rounded-corner-full bg-primary-container px-2 py-0.5 text-label-small text-on-primary-container">
          VK
        </span>
      ) : null}
    </span>
  );
}
