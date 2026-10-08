'use client';

import { Autocomplete, AutocompleteItem, Select, SelectItem } from '@vkieu/mui';

const CITIES = [
  { id: 'hn', name: 'Hà Nội' },
  { id: 'ldn', name: 'London' },
  { id: 'syd', name: 'Sydney' },
];

/**
 * Collection items (`SelectItem`, `AutocompleteItem`) must be created in a client component,
 * so the fields and their options live here; the page around them is a server component.
 */
export function SelectForm() {
  return (
    <form className="flex flex-col gap-6">
      <Select label="Sort by" name="sort" defaultValue="low">
        <SelectItem key="newest">Newest first</SelectItem>
        <SelectItem key="low">Price, low to high</SelectItem>
        <SelectItem key="high">Price, high to low</SelectItem>
      </Select>
      <Autocomplete label="City" name="city" defaultItems={CITIES} defaultValue="ldn">
        {(city) => <AutocompleteItem key={city.id}>{city.name}</AutocompleteItem>}
      </Autocomplete>
    </form>
  );
}
