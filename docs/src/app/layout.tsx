"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, IconButton, AppBar, NavigationRail, Divider } from "@mui/index";

const navItems = [
  { value: "buttons", icon: "buttons_alt", label: "Buttons", href: "/buttons" },
  { value: "inputs", icon: "input", label: "Inputs", href: "/inputs/text-fields" },
  { value: "data-display", icon: "dashboard", label: "Display", href: "/data-display/cards" },
  { value: "feedback", icon: "feedback", label: "Feedback", href: "/feedback/dialog" },
  { value: "navigation", icon: "near_me", label: "Navigation", href: "/navigation/bar" },
  { value: "layout", icon: "view_sidebar", label: "Layout", href: "/layout/app-bar" },
  { value: "pickers", icon: "calendar_month", label: "Pickers", href: "/pickers/date" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = React.useState(false);
  const [navExpanded, setNavExpanded] = React.useState(true);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const activeValue = React.useMemo(() => {
    for (const item of navItems) {
      if (pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith("/" + item.value)) {
        return item.value;
      }
    }
    return undefined;
  }, [pathname]);

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* Sidebar — fixed position, full height */}
        <NavigationRail expanded={navExpanded} className="fixed top-0 left-0 h-screen z-40">
          <NavigationRail.Header>
            <IconButton
              icon="menu"
              variant="standard"
              aria-label={navExpanded ? "Collapse navigation" : "Expand navigation"}
              onClick={() => setNavExpanded((prev) => !prev)}
            />
          </NavigationRail.Header>

          <NavigationRail.Content>
            {navItems.map((item) => (
              <Link key={item.value} href={item.href} className="no-underline">
                <NavigationRail.Item
                  icon={item.icon}
                  label={item.label}
                  active={activeValue === item.value}
                />
              </Link>
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

        {/* Main content — offset by sidebar width */}
        <div className={`transition-[margin-left] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${navExpanded ? "ml-90" : "ml-24"}`}>
          <AppBar
            className="sticky top-0 z-30"
            headline={
              <Link href="/" className="text-[22px] leading-7 font-normal text-surface-foreground no-underline">
                M3 Components
              </Link>
            }
          />

          <main className="p-8 max-w-240">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
