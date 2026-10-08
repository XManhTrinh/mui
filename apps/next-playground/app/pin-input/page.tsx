import { PinInput } from '@vkieu/mui/vk';

/** A PIN input rendered by a server component, with a value, so its boxes are in the HTML. */
export default function PinInputPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <PinInput data-testid="code" label="6-digit code" groups={[3, 3]} defaultValue="123" />
    </main>
  );
}
