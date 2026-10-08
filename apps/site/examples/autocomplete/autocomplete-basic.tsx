'use client';

import { Autocomplete, AutocompleteItem, type AutocompleteKey } from '@vkieu/mui';
import { useState } from 'react';

const CITIES = [
  { id: 'hn', name: 'Hà Nội', country: 'Việt Nam' },
  { id: 'hcm', name: 'Hồ Chí Minh', country: 'Việt Nam' },
  { id: 'dn', name: 'Đà Nẵng', country: 'Việt Nam' },
  { id: 'ldn', name: 'London', country: 'United Kingdom' },
  { id: 'bham', name: 'Birmingham', country: 'United Kingdom' },
  { id: 'syd', name: 'Sydney', country: 'Australia' },
  { id: 'mel', name: 'Melbourne', country: 'Australia' },
  { id: 'hou', name: 'Houston', country: 'United States' },
];

/**
 * Type to find an option in a long list. Matching ignores case and accents, so "da nang"
 * finds "Đà Nẵng"; the arrow keys move through the matches while focus stays in the field.
 */
export function AutocompleteBasic() {
  const [city, setCity] = useState<AutocompleteKey | null>(null);
  return (
    <Autocomplete
      label="City"
      supportingText="Where you live"
      defaultItems={CITIES}
      value={city}
      onChange={setCity}
    >
      {(item) => (
        <AutocompleteItem key={item.id} description={item.country}>
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
