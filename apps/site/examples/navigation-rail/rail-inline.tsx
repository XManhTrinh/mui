'use client';

import { Fab, IconButton, NavigationRail, NavigationRailItem } from '@vkieu/mui';
import { useState } from 'react';
import {
  EditIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  SendIcon,
  StarIcon,
} from '../../components/icons';

const DESTINATIONS = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'search', label: 'Search', icon: <SearchIcon /> },
  { id: 'starred', label: 'Starred', icon: <StarIcon /> },
  { id: 'sent', label: 'Sent', icon: <SendIcon /> },
];

/**
 * A navigation rail along the start edge of a bounded layout. The menu button in `header`
 * toggles `expanded`, which springs the rail between its 96px collapsed width (icon above
 * label) and its expanded width (icon beside label). Each item is a button that marks the
 * current destination with `selected`.
 */
export function RailInline() {
  const [current, setCurrent] = useState('home');
  return (
    <div className="flex h-[420px] w-full overflow-hidden rounded-corner-large border border-outline-variant">
      <NavigationRail
        aria-label="Mail"
        header={({ expanded, toggle }) => (
          <>
            <IconButton
              icon={<MenuIcon />}
              aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
              onPress={toggle}
            />
            <Fab icon={<EditIcon />} aria-label="Compose" lowered className="mt-1" />
          </>
        )}
      >
        {DESTINATIONS.map(({ id, label, icon }) => (
          <NavigationRailItem
            key={id}
            icon={icon}
            selected={current === id}
            onPress={() => setCurrent(id)}
          >
            {label}
          </NavigationRailItem>
        ))}
      </NavigationRail>
      <main className="flex-1 bg-surface-container-low p-6 text-body-large text-on-surface-variant">
        Current: {current}
      </main>
    </div>
  );
}
