"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton, AppBar, NavigationRail } from "@mui/index";
import type { NavigationRailSection } from "@mui/index";

const navCategories: NavigationRailSection[] = [
  {
    label: "Buttons",
    icon: "buttons_alt",
    links: [
      { value: "/buttons", label: "Buttons", href: "/buttons" },
      { value: "/buttons/icon-buttons", label: "Icon Buttons", href: "/buttons/icon-buttons" },
      { value: "/buttons/fabs", label: "FABs", href: "/buttons/fabs" },
      { value: "/buttons/split-button", label: "Split Button", href: "/buttons/split-button" },
      { value: "/buttons/button-group", label: "Button Group", href: "/buttons/button-group" },
    ],
  },
  {
    label: "Inputs",
    icon: "input",
    links: [
      { value: "/inputs/text-fields", label: "Text Fields", href: "/inputs/text-fields" },
      { value: "/inputs/checkbox", label: "Checkbox", href: "/inputs/checkbox" },
      { value: "/inputs/radio", label: "Radio", href: "/inputs/radio" },
      { value: "/inputs/switch", label: "Switch", href: "/inputs/switch" },
      { value: "/inputs/slider", label: "Slider", href: "/inputs/slider" },
      { value: "/inputs/search", label: "Search", href: "/inputs/search" },
    ],
  },
  {
    label: "Data Display",
    icon: "dashboard",
    links: [
      { value: "/data-display/cards", label: "Cards", href: "/data-display/cards" },
      { value: "/data-display/badges", label: "Badges", href: "/data-display/badges" },
      { value: "/data-display/chips", label: "Chips", href: "/data-display/chips" },
      { value: "/data-display/lists", label: "Lists", href: "/data-display/lists" },
      { value: "/data-display/tooltip", label: "Tooltips", href: "/data-display/tooltip" },
      { value: "/data-display/divider", label: "Divider", href: "/data-display/divider" },
      { value: "/data-display/icon", label: "Icon", href: "/data-display/icon" },
    ],
  },
  {
    label: "Feedback",
    icon: "feedback",
    links: [
      { value: "/feedback/dialog", label: "Dialogs", href: "/feedback/dialog" },
      { value: "/feedback/snackbar", label: "Snackbar", href: "/feedback/snackbar" },
      { value: "/feedback/menu", label: "Menus", href: "/feedback/menu" },
      { value: "/feedback/progress", label: "Progress", href: "/feedback/progress" },
    ],
  },
  {
    label: "Navigation",
    icon: "near_me",
    links: [
      { value: "/navigation/bar", label: "Navigation Bar", href: "/navigation/bar" },
      { value: "/navigation/rail", label: "Navigation Rail", href: "/navigation/rail" },
    ],
  },
  {
    label: "Layout",
    icon: "view_sidebar",
    links: [
      { value: "/layout/app-bar", label: "App Bar", href: "/layout/app-bar" },
      { value: "/layout/tabs", label: "Tabs", href: "/layout/tabs" },
      { value: "/layout/bottom-sheet", label: "Bottom Sheet", href: "/layout/bottom-sheet" },
      { value: "/layout/side-sheet", label: "Side Sheet", href: "/layout/side-sheet" },
      { value: "/layout/toolbar", label: "Toolbar", href: "/layout/toolbar" },
      { value: "/layout/carousel", label: "Carousel", href: "/layout/carousel" },
    ],
  },
  {
    label: "Pickers",
    icon: "calendar_month",
    links: [
      { value: "/pickers/date", label: "Date Picker", href: "/pickers/date" },
      { value: "/pickers/time", label: "Time Picker", href: "/pickers/time" },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  // Determine active value from pathname — match exact or startsWith for nested routes
  const activeValue = React.useMemo(() => {
    for (const section of navCategories) {
      for (const link of section.links) {
        if (pathname === link.value || pathname.startsWith(link.value + "/")) {
          return link.value;
        }
      }
    }
    return undefined;
  }, [pathname]);

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* Header — M3 AppBar */}
        <AppBar
          className="fixed top-0 left-0 right-0 z-40"
          headline={
            <Link href="/" className="text-[22px] leading-7 font-normal text-surface-foreground no-underline">
              M3 Components
            </Link>
          }
          trailingIcons={
            <IconButton
              variant="standard"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <Icon name={dark ? "light_mode" : "dark_mode"} />
            </IconButton>
          }
        />

        {/* Sidebar — MUI NavigationRail (expanded variant with sections) */}
        <NavigationRail
          variant="expanded"
          sections={navCategories}
          activeValue={activeValue}
          className="top-16 z-30 border-r border-outline-variant"
          renderLink={({ href, isActive, children, className }) => (
            <Link href={href ?? "#"} className={className}>
              {children}
            </Link>
          )}
        />

        {/* Main content */}
        <main className="ml-90 mt-16 p-8 max-w-240">
          {children}
        </main>
      </body>
    </html>
  );
}
