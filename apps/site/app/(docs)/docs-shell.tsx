'use client';

import {
  IconButton,
  NavigationBar,
  NavigationBarItem,
  NavigationRail,
  NavigationRailItem,
  SearchAppBar,
  SheetTrigger,
  SideSheet,
  TopAppBar,
} from '@vkieu/mui';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { CloseIcon, MenuIcon, SettingsIcon } from '../../components/icons';
import { DocsSearch } from './docs-search';
import type { SearchEntry } from './search-index';
import { DOCS_SECTIONS } from './sections';
import { ThemeControls } from './theme-controls';

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The display settings (theme, mode, contrast, motion, direction) in a modal side sheet. */
function DisplaySettings() {
  return (
    <SheetTrigger>
      <IconButton icon={<SettingsIcon />} aria-label="Display settings" />
      <SideSheet
        title="Display"
        className="w-[320px]"
        actions={({ close }) => (
          <IconButton icon={<CloseIcon />} aria-label="Close display settings" onPress={close} />
        )}
      >
        <ThemeControls />
      </SideSheet>
    </SheetTrigger>
  );
}

/**
 * The documentation shell: a navigation rail (medium+) and flexible navigation bar
 * (compact), a modal navigation drawer on compact widths, and a top bar with the page
 * search and the display settings: a top app bar on medium+ windows and an app bar with
 * search on compact ones. Every element is a `@vkieu/mui` component; active-route state
 * comes from `usePathname()`.
 */
export function DocsShell({
  children,
  searchEntries,
}: {
  children: ReactNode;
  searchEntries: SearchEntry[];
}) {
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
        {/* Medium and wider: title, search and settings. */}
        <TopAppBar
          variant="small"
          className="hidden medium:flex"
          title={
            // The package name reads left to right on RTL pages too.
            <span dir="ltr" className="text-title-large text-on-surface">
              @vkieu/mui
            </span>
          }
          actions={
            <>
              <DocsSearch entries={searchEntries} view="docked" className="w-[280px]" />
              <DisplaySettings />
            </>
          }
        />
        {/* Compact: the search fills the bar between the drawer button and the settings. */}
        <SearchAppBar
          className="medium:hidden"
          navigationIcon={
            <IconButton
              icon={<MenuIcon />}
              aria-label="Open navigation"
              onPress={() => setNavOpen(true)}
            />
          }
          actions={<DisplaySettings />}
        >
          <DocsSearch entries={searchEntries} view="full-screen" />
        </SearchAppBar>
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
