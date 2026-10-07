import { Avatar } from '@vkieu/mui/vk';

/**
 * Without a photo, an avatar shows initials from `name` in a stable container tone, or an
 * icon when there is no name (a person by default, or your own with `icon`). Sizes run from
 * 24px to 96px.
 */
export function AvatarFallbacks() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Avatar name="Nguyễn Văn An" alt="Nguyễn Văn An" size="xs" />
      <Avatar name="Trần Thị Lan" alt="Trần Thị Lan" size="sm" />
      <Avatar name="Lê Minh" alt="Lê Minh" />
      <Avatar name="Đỗ Ứng" alt="Đỗ Ứng" size="lg" />
      <Avatar alt="No name" size="lg" />
      <Avatar alt="No name" size="lg" shape="rounded" />
    </div>
  );
}
