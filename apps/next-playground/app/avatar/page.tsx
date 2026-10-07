import { Avatar } from '@vkieu/mui/vk';

/** Avatars rendered by a server component: a photo, a broken photo and initials. */
export default function AvatarPage() {
  return (
    <main className="flex gap-4 p-6">
      <Avatar data-testid="photo" name="Trần Thị Lan" alt="Lan" src="/avatar-photo.svg" size="lg" />
      <Avatar data-testid="broken" name="Lê Minh" alt="Minh" src="/missing.png" size="lg" />
      <Avatar data-testid="initials" name="Nguyễn Văn An" alt="An" size="lg" />
    </main>
  );
}
