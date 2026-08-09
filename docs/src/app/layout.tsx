"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton } from "@mui/index";

type NavCategory = {
  label: string;
  links: { href: string; label: string }[];
};

const navCategories: NavCategory[] = [
  {
    label: "Action",
    links: [{ href: "/buttons", label: "Buttons" }],
  },
  {
    label: "Inputs",
    links: [{ href: "/inputs", label: "Inputs & Selection" }],
  },
  {
    label: "Data Display",
    links: [{ href: "/data-display", label: "Data Display" }],
  },
  {
    label: "Feedback",
    links: [{ href: "/feedback", label: "Feedback & Communication" }],
  },
  {
    label: "Navigation",
    links: [{ href: "/navigation", label: "Navigation" }],
  },
  {
    label: "Layout",
    links: [{ href: "/layout-components", label: "Layout & Containment" }],
  },
];

function SidebarLink() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 w-70 bg-surface overflow-y-auto">
      <nav className="py-4 px-3">
        {navCategories.map((category) => (
          <div key={category.label} className="mt-6 first:mt-0">
            <h3 className="px-4 mb-1 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
              {category.label}
            </h3>
            <ul className="flex flex-col">
              {category.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "text-primary bg-primary/8"
                          : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
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
      <body className="bg-surface text-on-surface min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6">
          <Link href="/" className="text-base font-semibold text-on-surface">
            M3 Components
          </Link>
          <IconButton
            variant="standard"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <Icon name={dark ? "light_mode" : "dark_mode"} />
          </IconButton>
        </header>

        {/* Sidebar */}
        <SidebarLink />

        {/* Main content */}
        <main className="ml-70 mt-16 p-8 max-w-240">
          {children}
        </main>
      </body>
    </html>
  );
}
