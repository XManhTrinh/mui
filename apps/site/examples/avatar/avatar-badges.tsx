import { Avatar } from '@vkieu/mui/vk';

/** Material Symbols `check`, used here as a "verified" badge. */
const CheckIcon = () => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>
);

/**
 * A presence dot (online, away, offline) and a badge with any content, each in any corner.
 * Both join the accessible name, and their colours are CSS variables an app can override.
 */
export function AvatarBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar name="Trần Thị Lan" alt="Trần Thị Lan" size="lg" presence="online" />
      <Avatar name="Lê Minh" alt="Lê Minh" size="lg" presence="away" />
      <Avatar name="Đỗ Ứng" alt="Đỗ Ứng" size="lg" presence="offline" />
      <Avatar
        name="Nguyễn Văn An"
        alt="Nguyễn Văn An"
        size="lg"
        badge={<CheckIcon />}
        badgeLabel="verified"
      />
      <Avatar
        name="Phạm Bảo Châu"
        alt="Phạm Bảo Châu"
        size="lg"
        presence="online"
        presencePlacement="top-start"
        badge="3"
        badgeLabel="3 unread messages"
        badgePlacement="bottom-end"
      />
    </div>
  );
}
