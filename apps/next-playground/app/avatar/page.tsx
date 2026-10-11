import { Avatar } from '@vkieu/mui/vk';

/** Avatars rendered by a server component: a photo, a broken photo and initials. */
export default function AvatarPage() {
  return (
    <main className="flex gap-4 p-6">
      <Avatar data-testid="photo" name="Omar Haddad" alt="Omar" src="/avatar-photo.svg" size="lg" />
      <Avatar data-testid="broken" name="Priya Shah" alt="Priya" src="/missing.png" size="lg" />
      <Avatar data-testid="initials" name="Nora Lindqvist" alt="Nora" size="lg" />
    </main>
  );
}
