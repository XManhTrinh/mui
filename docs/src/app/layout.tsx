"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationRail, Icon } from "@mui/index";
import type { NavigationRailItem } from "@mui/index";

const navItems: (NavigationRailItem & { href: string })[] = [
  { value: "/", icon: "home", activeIcon: "home", label: "Home", href: "/" },
  {
    value: "/buttons",
    icon: "buttons_alt",
    activeIcon: "buttons_alt",
    label: "Buttons",
    href: "/buttons",
  },
  {
    value: "/inputs",
    icon: "input",
    activeIcon: "input",
    label: "Inputs",
    href: "/inputs",
  },
  {
    value: "/data-display",
    icon: "dashboard",
    activeIcon: "dashboard",
    label: "Data Display",
    href: "/data-display",
  },
  {
    value: "/feedback",
    icon: "feedback",
    activeIcon: "feedback",
    label: "Feedback",
    href: "/feedback",
  },
  {
    value: "/navigation",
    icon: "menu",
    activeIcon: "menu",
    label: "Navigation",
    href: "/navigation",
  },
  {
    value: "/layout-components",
    icon: "view_sidebar",
    activeIcon: "view_sidebar",
    label: "Layout",
    href: "/layout-components",
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <NavigationRail
      variant="expanded"
      items={navItems}
      activeValue={pathname}
      onValueChange={() => {}}
      header={
        <Link href="/" className="flex items-center gap-2 px-4">
          <Icon name="palette" size={24} filled className="text-primary" />
          <span className="text-sm font-semibold text-surface-foreground">
            M3 Components
          </span>
        </Link>
      }
    />
  );
}

function SidebarLink() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-surface-container border-r border-outline-variant flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-outline-variant">
        <Icon name="palette" size={24} filled className="text-primary" />
        <span className="text-base font-semibold text-surface-foreground">
          M3 Components
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.value}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary-container text-secondary-container-foreground"
                      : "text-surface-variant-foreground hover:bg-surface-container-high"
                  }`}
                >
                  <Icon
                    name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
                    size={24}
                    filled={isActive}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-surface-foreground min-h-screen">
        <SidebarLink />
        <main className="ml-64 p-8">{children}</main>
      </body>
    </html>
  );
}
