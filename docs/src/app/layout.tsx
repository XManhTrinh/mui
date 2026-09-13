"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton, FAB } from "@mui/index";

// ─── Navigation data ──────────────────────────────────────────────────────────

type NavCategory = {
  value: string;
  icon: string;
  label: string;
  href: string;
  children: { label: string; href: string }[];
};

const categories: NavCategory[] = [
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
    label: "Nav",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Find which category owns the current path. */
function findActiveCategory(pathname: string): string | undefined {
  for (const cat of categories) {
    if (
      pathname === cat.href ||
      cat.children.some((c) => pathname === c.href) ||
      pathname.startsWith("/" + cat.value + "/") ||
      pathname.startsWith("/" + cat.value)
    ) {
      return cat.value;
    }
  }
  return undefined;
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, setDark] = React.useState(false);

  // Which category's drawer is showing — null means collapsed (rail only).
  const [openDrawer, setOpenDrawer] = React.useState<string | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const activeCategory = React.useMemo(
    () => findActiveCategory(pathname),
    [pathname]
  );

  // ── Hover logic ─────────────────────────────────────────────────
  // Open instantly, close with a grace period so the cursor can travel
  // from the rail item to the drawer without it snapping shut.

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openCategory = (value: string) => {
    cancelClose();
    setOpenDrawer(value);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenDrawer(null), 250);
  };

  // The drawer content for the currently hovered category (if any).
  const drawerCat = categories.find((c) => c.value === openDrawer);
  const isDrawerVisible = !!drawerCat;

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* ── Sidebar: rail + drawer ───────────────────────────────── */}
        <div className="fixed inset-t-0 inset-l-0 h-screen z-40 flex">
          {/* Rail — always visible (80px) */}
          <nav className="flex flex-col items-center w-20 shrink-0 bg-surface-container h-full py-3 z-10">
            {/* Home */}
            <Link href="/" className="no-underline mb-4">
              <FAB
                size="fab"
                shape="rounded"
                color="tertiary-container"
                icon={<Icon name="home" />}
                aria-label="Home"
                onMouseEnter={scheduleClose}
              />
            </Link>

            {/* Category items */}
            <div className="flex flex-col items-center gap-1 flex-1 overflow-y-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.value;
                const isHovered = openDrawer === cat.value;

                return (
                  <div
                    key={cat.value}
                    onMouseEnter={() => openCategory(cat.value)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link href={cat.href} className="no-underline">
                      <button
                        className={[
                          "group relative flex flex-col items-center justify-center cursor-pointer outline-none",
                          "focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1",
                        ].join(" ")}
                      >
                        <span className="relative flex items-center justify-center w-14 h-8">
                          {/* Active indicator pill */}
                          <span
                            className={[
                              "absolute inset-0 rounded-full transition-[transform,opacity] duration-200 origin-center",
                              isActive || isHovered
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
                            name={cat.icon}
                            size={24}
                            filled={isActive}
                            className={[
                              "relative z-10 transition-colors duration-200",
                              isActive || isHovered
                                ? "text-secondary-container-foreground"
                                : "text-[hsl(var(--on-surface-variant))]",
                            ].join(" ")}
                          />
                        </span>
                        <span
                          className={[
                            "text-[12px] leading-4 font-medium tracking-[0.5px] mt-0.5",
                            isActive || isHovered
                              ? "text-secondary"
                              : "text-[hsl(var(--on-surface-variant))]",
                          ].join(" ")}
                        >
                          {cat.label}
                        </span>
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Theme toggle */}
            <div className="pt-2">
              <IconButton
                icon={dark ? "light_mode" : "dark_mode"}
                variant="standard"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              />
            </div>
          </nav>

          {/* Divider between rail and drawer */}
          <div
            className={[
              "w-px shrink-0 bg-outline-variant transition-opacity duration-200",
              isDrawerVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          {/* Drawer — child links for the hovered category */}
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className={[
              "h-full bg-surface-container overflow-hidden",
              "rounded-e-2xl",
              // M3 Level 1 shadow on the end edge
              "shadow-[4px_0_12px_0_hsl(var(--elevation-1))]",
              // Open: emphasized-decelerate (fast start, gentle settle)
              // Close: emphasized-accelerate (gentle start, fast exit)
              isDrawerVisible
                ? "w-56 opacity-100 duration-400 ease-[cubic-bezier(0.05,0.7,0.1,1)]"
                : "w-0 opacity-0 duration-200 ease-[cubic-bezier(0.3,0,0.8,0.15)]",
              "transition-[width,opacity]",
            ].join(" ")}
          >
            {drawerCat && (
              <div
                key={drawerCat.value}
                className="w-56 h-full flex flex-col animate-[drawer-fade-in_150ms_ease-out]"
              >
                {/* Category title */}
                <div className="px-4 pt-4 pb-2">
                  <span className="text-[11px] font-medium tracking-[0.5px] uppercase text-[hsl(var(--on-surface-variant))]">
                    {drawerCat.label}
                  </span>
                </div>

                {/* Child links */}
                <nav className="flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-0.5">
                  {drawerCat.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={[
                          "no-underline flex items-center px-3 py-2.5 rounded-full",
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
              </div>
            )}
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="ml-20">
          <main className="p-8 max-w-240">{children}</main>
        </div>
      </body>
    </html>
  );
}
