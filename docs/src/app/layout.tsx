"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton, AppBar } from "@mui/index";

type NavCategory = {
  label: string;
  icon: string;
  links: { href: string; label: string }[];
};

const navCategories: NavCategory[] = [
  {
    label: "Buttons",
    icon: "buttons_alt",
    links: [
      { href: "/buttons", label: "Buttons" },
      { href: "/buttons/icon-buttons", label: "Icon Buttons" },
      { href: "/buttons/fabs", label: "FABs" },
      { href: "/buttons/split-button", label: "Split Button" },
      { href: "/buttons/button-group", label: "Button Group" },
    ],
  },
  {
    label: "Inputs",
    icon: "input",
    links: [
      { href: "/inputs/text-fields", label: "Text Fields" },
      { href: "/inputs/checkbox", label: "Checkbox" },
      { href: "/inputs/radio", label: "Radio" },
      { href: "/inputs/switch", label: "Switch" },
      { href: "/inputs/slider", label: "Slider" },
      { href: "/inputs/search", label: "Search" },
    ],
  },
  {
    label: "Data Display",
    icon: "dashboard",
    links: [
      { href: "/data-display/cards", label: "Cards" },
      { href: "/data-display/badges", label: "Badges" },
      { href: "/data-display/chips", label: "Chips" },
      { href: "/data-display/lists", label: "Lists" },
      { href: "/data-display/tooltip", label: "Tooltips" },
      { href: "/data-display/divider", label: "Divider" },
      { href: "/data-display/icon", label: "Icon" },
    ],
  },
  {
    label: "Feedback",
    icon: "feedback",
    links: [
      { href: "/feedback/dialog", label: "Dialogs" },
      { href: "/feedback/snackbar", label: "Snackbar" },
      { href: "/feedback/menu", label: "Menus" },
      { href: "/feedback/progress", label: "Progress" },
    ],
  },
  {
    label: "Navigation",
    icon: "near_me",
    links: [
      { href: "/navigation/bar", label: "Navigation Bar" },
      { href: "/navigation/rail", label: "Navigation Rail" },
    ],
  },
  {
    label: "Layout",
    icon: "view_sidebar",
    links: [
      { href: "/layout/app-bar", label: "App Bar" },
      { href: "/layout/tabs", label: "Tabs" },
      { href: "/layout/bottom-sheet", label: "Bottom Sheet" },
      { href: "/layout/side-sheet", label: "Side Sheet" },
      { href: "/layout/toolbar", label: "Toolbar" },
      { href: "/layout/carousel", label: "Carousel" },
    ],
  },
  {
    label: "Pickers",
    icon: "calendar_month",
    links: [
      { href: "/pickers/date", label: "Date Picker" },
      { href: "/pickers/time", label: "Time Picker" },
    ],
  },
];

/**
 * Sidebar — M3 Expanded Navigation Rail with collapsible sections.
 * Each category expands/collapses on click to show sub-items.
 * Active item uses the M3 active indicator (scale from center).
 */
function Sidebar() {
  const pathname = usePathname();

  // Track which categories are expanded
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
    // Auto-expand the category that contains the current path
    const initial: Record<string, boolean> = {};
    navCategories.forEach((cat) => {
      initial[cat.label] = cat.links.some(
        (link) => pathname === link.href || pathname.startsWith(link.href + "/")
      );
    });
    return initial;
  });

  // Update expanded state when pathname changes
  React.useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      navCategories.forEach((cat) => {
        if (cat.links.some((link) => pathname === link.href || pathname.startsWith(link.href + "/"))) {
          next[cat.label] = true;
        }
      });
      return next;
    });
  }, [pathname]);

  const toggleCategory = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 w-70 border-r border-outline-variant bg-surface-container overflow-y-auto">
      <nav className="py-3 px-3" aria-label="Component navigation">
        {navCategories.map((category) => {
          const isExpanded = expanded[category.label] ?? false;
          const hasActiveChild = category.links.some(
            (link) => pathname === link.href || pathname.startsWith(link.href + "/")
          );

          return (
            <div key={category.label} className="mb-1">
              {/* Category header — clickable to expand/collapse */}
              <button
                onClick={() => toggleCategory(category.label)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-[14px] leading-5 font-medium transition-colors cursor-pointer ${
                  hasActiveChild && !isExpanded
                    ? "text-primary"
                    : "text-surface-variant-foreground"
                } hover:bg-[hsl(var(--on-surface)/0.08)]`}
                aria-expanded={isExpanded}
              >
                <Icon
                  name={category.icon}
                  size={24}
                  filled={hasActiveChild}
                  className={hasActiveChild ? "text-primary" : "text-surface-variant-foreground"}
                />
                <span className="flex-1 text-left truncate">{category.label}</span>
                <Icon
                  name="expand_more"
                  size={20}
                  className={`text-surface-variant-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {/* Sub-items — collapsible with smooth open/close */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="pl-6 py-1">
                  {category.links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="relative flex items-center px-4 py-2 rounded-full text-[13px] leading-5 font-medium transition-colors text-surface-variant-foreground hover:bg-[hsl(var(--on-surface)/0.08)]"
                      >
                        {/* Active indicator */}
                        <span
                          className={`absolute inset-0 rounded-full bg-secondary-container transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center ${
                            isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                          }`}
                        />
                        <span className={`relative z-10 ${isActive ? "text-secondary-container-foreground" : ""}`}>
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        {/* Sidebar — M3 Expanded Rail with collapsible sections */}
        <Sidebar />

        {/* Main content */}
        <main className="ml-70 mt-16 p-8 max-w-240">
          {children}
        </main>
      </body>
    </html>
  );
}
