import { PhoneField } from '@vkieu/mui/vk';

/** A phone field rendered by a server component, with a value and a priority list. */
export default function PhoneFieldPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <PhoneField
        data-testid="phone"
        label="Phone"
        name="phone"
        defaultValue="+84912345678"
        priorityCountries={['GB', 'US', 'AU', 'VN']}
        locale="en"
      />
    </main>
  );
}
