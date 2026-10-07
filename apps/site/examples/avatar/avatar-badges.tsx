import { Avatar } from '@vkieu/mui/vk';

/**
 * A presence dot (online, away, offline) and a verified badge. Both join the accessible
 * name, and their colours are CSS variables an app can override.
 */
export function AvatarBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar name="Trần Thị Lan" alt="Trần Thị Lan" size="lg" presence="online" />
      <Avatar name="Lê Minh" alt="Lê Minh" size="lg" presence="away" />
      <Avatar name="Đỗ Ứng" alt="Đỗ Ứng" size="lg" presence="offline" />
      <Avatar name="Nguyễn Văn An" alt="Nguyễn Văn An" size="lg" verified />
    </div>
  );
}
