"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton, AppBar, NavigationRail } from "@mui/index";

// ─── Navigation data with child routes ────────────────────────────────────────

type NavChild = { label: string; href: string };
type NavItem = {
  value: string;
  icon: string;
  label: string;
  href: string;
  children: NavChild[];
};

const navItems: NavItem[] = [
  {
    value: "buttons",
    icon: "buttons_alt",
    label: "Buttons",
    href: "/buttons",
    children: [
      { label: "Common Buttons", href: "/buttons" },
      { label: "Icon Buttons", href: "/buttons/icon-buttons" },
      { label: "FABs", href: "/buttons/fabs" },
      { label: "Split Button", href: "/buttons/split-button" },
      { label: "Button Group", href: "/buttons/button-group" },
    ],
  },
  {
    value: "inputs",
    icon: "input",
    label: "Inputs",
    href: "/inputs/text-fields",
    children: [
      { label: "Text Fields", href: "/inputs/text-fields" },
      { label: "Select", href: "/inputs/select" },
      { label: "Checkbox", href: "/inputs/checkbox" },
      { label: "Radio", href: "/inputs/radio" },
      { label: "Switch", href: "/inputs/switch" },
      { label: "Slider", href: "/inputs/slider" },
      { label: "Search", href: "/inputs/search" },
    ],
  },
  {
    value: "data-display",
    icon: "dashboard",
    label: "Display",
    href: "/data-display/cards",
    children: [
      { label: "Cards", href: "/data-display/cards" },
      { label: "Badges", href: "/data-display/badges" },
      { label: "Chips", href: "/data-display/chips" },
      { label: "Lists", href: "/data-display/lists" },
      { label: "Tooltip", href: "/data-display/tooltip" },
      { label: "Divider", href: "/data-display/divider" },
      { label: "Icon", href: "/data-display/icon" },
    ],
  },
  {
    value: "feedback",
    icon: "feedback",
    label: "Feedback",
    href: "/feedback/dialog",
    children: [
      { label: "Dialog", href: "/feedback/dialog" },
      { label: "Snackbar", href: "/feedback/snackbar" },
      { label: "Menu", href: "/feedback/menu" },
      { label: "Progress", href: "/feedback/progress" },
    ],
  },
  {
    value: "navigation",
    icon: "near_me",
    label: "Navigation",
    href: "/navigation/bar",
    children: [
      { label: "Navigation Bar", href: "/navigation/bar" },
      { label: "Navigation Rail", href: "/navigation/rail" },
    ],
  },
  {
    value: "layout",
    icon: "view_sidebar",
    label: "Layout",
    href: "/layout/app-bar",
    children: [
      { label: "App Bar", href: "/layout/app-bar" },
      { label: "Tabs", href: "/layout/tabs" },
      { label: "Bottom Sheet", href: "/layout/bottom-sheet" },
      { label: "Side Sheet", href: "/layout/side-sheet" },
      { label: "Toolbar", href: "/layout/toolbar" },
      { label: "Carousel", href: "/layout/carousel" },
      { label: "Typography", href: "/layout/typography" },
    ],
  },
  {
    value: "pickers",
    icon: "calendar_month",
    label: "Pickers",
    href: "/pickers/date",
    children: [
      { label: "Date Picker", href: "/pickers/date" },
      { label: "Time Picker", href: "/pickers/time" },
    ],
  },
];

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, setDark] = React.useState(false);
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  // Which top-level category is active based on the current route
  const activeValue = React.useMemo(() => {
    for (const item of navItems) {
      if (
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        pathname.startsWith("/" + item.value)
      ) {
        return item.value;
      }
    }
    return undefined;
  }, [pathname]);

  // Open the flyout immediately, cancel any pending close
  const openFlyout = (value: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setHoveredCategory(value);
  };

  // Close with a short grace period so the user can move from the rail item
  // to the flyout panel without it disappearing
  const closeFlyout = () => {
    closeTimerRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  const hoveredItem = navItems.find((n) => n.value === hoveredCategory);

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* ── Sidebar: collapsed rail + flyout sub-nav ──────────────── */}
        <div className="fixed inset-t-0 inset-l-0 h-screen z-40 flex">
          {/* Primary rail — always collapsed (w-24 = 96px) */}
          <NavigationRail className="h-full shrink-0">
            <NavigationRail.Header>
              <Link href="/">
                <IconButton icon="home" variant="standard" aria-label="Home" />
              </Link>
            </NavigationRail.Header>

            <NavigationRail.Content>
              {navItems.map((item) => (
                <div
                  key={item.value}
                  onMouseEnter={() => openFlyout(item.value)}
                  onMouseLeave={closeFlyout}
                >
                  <Link href={item.href} className="no-underline">
                    <NavigationRail.Item
                      icon={item.icon}
                      label={item.label}
                      active={activeValue === item.value}
                    />
                  </Link>
                </div>
              ))}
            </NavigationRail.Content>

            <NavigationRail.Footer>
              <IconButton
                icon={dark ? "light_mode" : "dark_mode"}
                variant="standard"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              />
            </NavigationRail.Footer>
          </NavigationRail>

          {/* Flyout sub-nav panel — appears on hover */}
          {hoveredItem && (
            <div
              onMouseEnter={() => openFlyout(hoveredItem.value)}
              onMouseLeave={closeFlyout}
              className="h-full w-56 shrink-0 border-e border-outline-variant bg-surface-container py-3 px-2 overflow-y-auto animate-in slide-in-from-left-2 duration-150"
            >
              {/* Category heading */}
              <Link
                href={hoveredItem.href}
                className="no-underline flex items-center gap-2 px-3 py-2 mb-1 rounded-full text-[14px] font-medium text-surface-foreground hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors"
              >
                <Icon name={hoveredItem.icon} size={20} className="text-primary" />
                {hoveredItem.label}
              </Link>

              {/* Child links */}
              <nav className="flex flex-col gap-0.5">
                {hoveredItem.children.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setHoveredCategory(null)}
                      className={[
                        "no-underline flex items-center gap-3 px-3 py-2.5 rounded-full",
                        "text-[13px] leading-5 transition-colors",
                        isChildActive
                          ? "bg-secondary-container text-secondary-container-foreground font-medium"
                          : "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--on-surface)/0.08)]",
                      ].join(" ")}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="ml-24">
          <AppBar
            className="sticky inset-t-0 z-30"
            headline={
              <Link
                href="/"
                className="text-[22px] leading-7 font-normal text-surface-foreground no-underline"
              >
                M3 Components
              </Link>
            }
          />

          <main className="p-8 max-w-240">{children}</main>
        </div>
      </body>
    </html>
  );
}
