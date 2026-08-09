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
    label: "Action",
    links: [
      { href: "/buttons", label: "Buttons", icon: "buttons_alt" },
    ],
  },
  {
    label: "Inputs & Selection",
    links: [
      { href: "/inputs", label: "Text Fields, Checkbox, Radio, Switch, Slider", icon: "input" },
    ],
  },
  {
    label: "Data Display",
    links: [
      { href: "/data-display", label: "Card, Badge, Chip, List, Tooltip", icon: "dashboard" },
    ],
  },
  {
    label: "Feedback",
    links: [
      { href: "/feedback", label: "Dialog, Snackbar, Menu, Progress", icon: "feedback" },
    ],
  },
  {
    label: "Navigation",
    links: [
      { href: "/navigation", label: "NavigationBar, NavigationRail", icon: "menu" },
    ],
  },
  {
    label: "Layout",
    links: [
      { href: "/layout-components", label: "AppBar, Tabs, Sheets, Toolbar", icon: "view_sidebar" },
    ],
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 w-70 border-r border-outline-variant bg-surface overflow-y-auto">
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
