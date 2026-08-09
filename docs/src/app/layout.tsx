"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton, AppBar, Divider } from "@mui/index";

type NavCategory = {
  label: string;
  links: { href: string; label: string; icon: string }[];
};

const navCategories: NavCategory[] = [
  {
    label: "Buttons",
    links: [
      { href: "/buttons", label: "Buttons", icon: "buttons_alt" },
      { href: "/buttons/icon-buttons", label: "Icon Buttons", icon: "radio_button_checked" },
      { href: "/buttons/fabs", label: "FABs", icon: "add_circle" },
      { href: "/buttons/split-button", label: "Split Button", icon: "call_split" },
      { href: "/buttons/button-group", label: "Button Group", icon: "view_column" },
    ],
  },
  {
    label: "Inputs & Selection",
    links: [
      { href: "/inputs/text-fields", label: "Text Fields", icon: "input" },
      { href: "/inputs/checkbox", label: "Checkbox", icon: "check_box" },
      { href: "/inputs/radio", label: "Radio Button", icon: "radio_button_checked" },
      { href: "/inputs/switch", label: "Switch", icon: "toggle_on" },
      { href: "/inputs/slider", label: "Slider", icon: "tune" },
      { href: "/inputs/search", label: "Search", icon: "search" },
    ],
  },
  {
    label: "Data Display",
    links: [
      { href: "/data-display/cards", label: "Cards", icon: "crop_portrait" },
      { href: "/data-display/badges", label: "Badges", icon: "notifications" },
      { href: "/data-display/chips", label: "Chips", icon: "label" },
      { href: "/data-display/lists", label: "Lists", icon: "list" },
      { href: "/data-display/tooltip", label: "Tooltips", icon: "info" },
      { href: "/data-display/divider", label: "Divider", icon: "horizontal_rule" },
      { href: "/data-display/icon", label: "Icon", icon: "emoji_symbols" },
    ],
  },
  {
    label: "Feedback",
    links: [
      { href: "/feedback/dialog", label: "Dialogs", icon: "open_in_new" },
      { href: "/feedback/snackbar", label: "Snackbar", icon: "info" },
      { href: "/feedback/menu", label: "Menus", icon: "menu" },
      { href: "/feedback/progress", label: "Progress", icon: "progress_activity" },
    ],
  },
  {
    label: "Navigation",
    links: [
      { href: "/navigation/bar", label: "Navigation Bar", icon: "bottom_navigation" },
      { href: "/navigation/rail", label: "Navigation Rail", icon: "side_navigation" },
    ],
  },
  {
    label: "Layout & Containment",
    links: [
      { href: "/layout/app-bar", label: "App Bar", icon: "web_asset" },
      { href: "/layout/tabs", label: "Tabs", icon: "tab" },
      { href: "/layout/bottom-sheet", label: "Bottom Sheet", icon: "call_to_action" },
      { href: "/layout/side-sheet", label: "Side Sheet", icon: "view_sidebar" },
      { href: "/layout/toolbar", label: "Toolbar", icon: "toolbar" },
      { href: "/layout/carousel", label: "Carousel", icon: "view_carousel" },
    ],
  },
  {
    label: "Date & Time",
    links: [
      { href: "/pickers/date", label: "Date Picker", icon: "calendar_month" },
      { href: "/pickers/time", label: "Time Picker", icon: "schedule" },
    ],
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 w-70 border-r border-outline-variant bg-surface-container overflow-y-auto">
      <nav className="py-2">
        {navCategories.map((category, idx) => (
          <div key={category.label}>
            {idx > 0 && <Divider className="my-2" />}
            <div className="px-4 pt-4 pb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-surface-variant-foreground">
                {category.label}
              </span>
            </div>
            {category.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 mx-2 px-4 py-2.5 rounded-full text-[14px] leading-5 font-medium transition-colors ${
                    isActive
                      ? "bg-secondary-container text-secondary-container-foreground"
                      : "text-surface-variant-foreground hover:bg-[hsl(var(--on-surface)/0.08)]"
                  }`}
                >
                  <Icon
                    name={link.icon}
                    size={24}
                    filled={isActive}
                    className={isActive ? "text-secondary-container-foreground" : "text-surface-variant-foreground"}
                  />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
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
        {/* Header — using M3 AppBar */}
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

        {/* Sidebar — using M3 patterns (Divider, Icon, active indicator) */}
        <Sidebar />

        {/* Main content */}
        <main className="ml-70 mt-16 p-8 max-w-240">
          {children}
        </main>
      </body>
    </html>
  );
}
