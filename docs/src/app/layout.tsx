"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton } from "@mui/index";

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

// Rail collapsed width: 80px (w-20). Expanded drawer width: 280px (w-70).
const RAIL_W = "w-20";
const RAIL_ML = "ml-20";
const DRAWER_W = "w-70";
const DRAWER_ML = "ml-70";

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, setDark] = React.useState(false);
  // Which category drawer is open — null means collapsed rail only
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Auto-expand the drawer for the active category on route change
  React.useEffect(() => {
    if (pathname === "/") {
      setOpenCategory(null);
      return;
    }
    for (const item of navItems) {
      if (
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        pathname.startsWith("/" + item.value + "/") ||
        pathname === "/" + item.value
      ) {
        setOpenCategory(item.value);
        return;
      }
    }
  }, [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

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

  const handleCategoryClick = (value: string) => {
    // Toggle: clicking the same category collapses back to rail
    setOpenCategory((prev) => (prev === value ? null : value));
  };

  const drawerItem = navItems.find((n) => n.value === openCategory);
  const isExpanded = !!drawerItem;

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside
          className={[
            "fixed inset-t-0 inset-l-0 h-screen z-40 flex flex-col bg-surface-container",
            "transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden",
            isExpanded ? DRAWER_W : RAIL_W,
          ].join(" ")}
        >
          {/* ── Collapsed rail view ────────────────────────────────── */}
          {!isExpanded && (
            <div className="flex flex-col h-full">
              {/* Home button */}
              <div className="flex items-center justify-center pt-3 pb-6">
                <Link href="/">
                  <IconButton icon="home" variant="standard" aria-label="Home" />
                </Link>
              </div>

              {/* Category items */}
              <nav className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = activeValue === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleCategoryClick(item.value)}
                      className={[
                        "group relative flex flex-col items-center justify-center w-full py-1 cursor-pointer outline-none",
                        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-lg",
                      ].join(" ")}
                    >
                      {/* Indicator pill */}
                      <span className="relative flex items-center justify-center w-14 h-8">
                        <span
                          className={[
                            "absolute inset-0 rounded-full transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center",
                            isActive
                              ? "bg-secondary-container scale-x-100 opacity-100"
                              : "scale-x-0 opacity-0",
                          ].join(" ")}
                        />
                        {/* State layer */}
                        <span
                          className={[
                            "absolute inset-0 rounded-full transition-colors duration-200",
                            isActive
                              ? "group-hover:bg-[hsl(var(--on-secondary-container)/0.08)]"
                              : "group-hover:bg-[hsl(var(--on-surface-variant)/0.08)]",
                          ].join(" ")}
                        />
                        <Icon
                          name={item.icon}
                          size={24}
                          filled={isActive}
                          className={[
                            "relative z-10 transition-colors duration-200",
                            isActive
                              ? "text-secondary-container-foreground"
                              : "text-[hsl(var(--on-surface-variant))]",
                          ].join(" ")}
                        />
                      </span>
                      {/* Label */}
                      <span
                        className={[
                          "text-[12px] leading-4 font-medium tracking-[0.5px] truncate mt-0.5",
                          isActive ? "text-secondary" : "text-[hsl(var(--on-surface-variant))]",
                        ].join(" ")}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Theme toggle */}
              <div className="flex items-center justify-center py-4">
                <IconButton
                  icon={dark ? "light_mode" : "dark_mode"}
                  variant="standard"
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                />
              </div>
            </div>
          )}

          {/* ── Expanded drawer view ───────────────────────────────── */}
          {isExpanded && drawerItem && (
            <div className="flex flex-col h-full">
              {/* Header: back arrow to collapse + category title */}
              <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                <button
                  onClick={() => setOpenCategory(null)}
                  className="flex items-center justify-center size-10 rounded-full cursor-pointer hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Collapse navigation"
                >
                  <Icon name="arrow_back" size={24} className="text-[hsl(var(--on-surface-variant))]" />
                </button>
                <span className="text-[14px] font-medium text-surface-foreground truncate">
                  {drawerItem.label}
                </span>
              </div>

              {/* Category items — compact icons row to switch categories */}
              <div className="flex items-center gap-1 px-3 pb-3 overflow-x-auto">
                {navItems.map((item) => {
                  const isCurrent = item.value === openCategory;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleCategoryClick(item.value)}
                      className={[
                        "flex items-center justify-center size-10 shrink-0 rounded-full cursor-pointer transition-colors outline-none",
                        "focus-visible:ring-2 focus-visible:ring-primary",
                        isCurrent
                          ? "bg-secondary-container"
                          : "hover:bg-[hsl(var(--on-surface)/0.08)]",
                      ].join(" ")}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <Icon
                        name={item.icon}
                        size={20}
                        filled={isCurrent}
                        className={
                          isCurrent
                            ? "text-secondary-container-foreground"
                            : "text-[hsl(var(--on-surface-variant))]"
                        }
                      />
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-outline-variant mx-3" />

              {/* Child links */}
              <nav className="flex-1 flex flex-col gap-0.5 px-3 py-2 overflow-y-auto">
                {drawerItem.children.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={[
                        "no-underline flex items-center px-4 py-2.5 rounded-full",
                        "text-[14px] leading-5 transition-colors",
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

              {/* Footer: theme toggle */}
              <div className="flex items-center px-3 py-3 border-t border-outline-variant">
                <IconButton
                  icon={dark ? "light_mode" : "dark_mode"}
                  variant="standard"
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                />
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content — pushes over with the sidebar ──────────── */}
        <div
          className={[
            "transition-[margin-left] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            isExpanded ? DRAWER_ML : RAIL_ML,
          ].join(" ")}
        >
          <main className="p-8 max-w-240">{children}</main>
        </div>
      </body>
    </html>
  );
}
