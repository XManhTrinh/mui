'use client';

import {
  IconButton,
  NavigationBar,
  NavigationBarItem,
  NavigationRail,
  NavigationRailItem,
  SearchBar,
  TopAppBar,
} from '@vkieu/mui';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { MenuIcon, SearchIcon } from '../../components/icons';
import { DOCS_SECTIONS } from './sections';
import { ThemeControls } from './theme-controls';

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The documentation shell: a navigation rail (medium+) and flexible navigation bar
 * (compact), a top app bar with search and theme controls, and a modal navigation drawer
 * opened from the app bar on compact widths. Every element is a `@vkieu/mui` component;
 * active-route state comes from `usePathname()`.
 */
export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const items = DOCS_SECTIONS.map((section) => (
    <NavigationRailItem
      key={section.href}
      href={section.href}
      icon={section.icon}
      selected={isActive(pathname, section.href)}
    >
      {section.label}
    </NavigationRailItem>
  ));

  return (
    <div className="flex min-h-dvh bg-surface text-on-surface">
      <NavigationRail
        aria-label="Sections"
        className="hidden medium:flex"
        header={({ toggle }) => (
          <IconButton icon={<MenuIcon />} aria-label="Toggle navigation width" onPress={toggle} />
        )}
      >
        {items}
      </NavigationRail>

      {/* Compact: a modal drawer opened from the top app bar's navigation icon. */}
      <NavigationRail
        aria-label="Documentation sections"
        modal
        hideOnCollapse
        expanded={navOpen}
        onExpandedChange={setNavOpen}
      >
        {items}
      </NavigationRail>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopAppBar
          variant="small"
          title={<span className="text-title-large text-on-surface">@vkieu/mui</span>}
          navigationIcon={
            <IconButton
              className="medium:hidden"
              icon={<MenuIcon />}
              aria-label="Open navigation"
              onPress={() => setNavOpen(true)}
            />
          }
          actions={
            <div className="flex items-center gap-2">
              <SearchBar
                aria-label="Search documentation"
                placeholder="Search"
                leadingIcon={<SearchIcon />}
                view="docked"
                className="hidden w-56 medium:flex"
              />
              <ThemeControls />
            </div>
          }
        />
        <main className="min-w-0 flex-1 p-6 pb-28 medium:pb-6">{children}</main>
      </div>

      <NavigationBar aria-label="Primary" className="fixed inset-x-0 bottom-0 medium:hidden">
        {DOCS_SECTIONS.map((section) => (
          <NavigationBarItem
            key={section.href}
            href={section.href}
            icon={section.icon}
            selected={isActive(pathname, section.href)}
          >
            {section.label}
          </NavigationBarItem>
        ))}
      </NavigationBar>
    </div>
  );
}
