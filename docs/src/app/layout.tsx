"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton } from "@mui/index";

// ─── Navigation structure ─────────────────────────────────────────────────────

type NavEntry =
  | { kind: "link"; label: string; href: string }
  | { kind: "group"; label: string; children: { label: string; href: string }[] };

/** Flat + grouped list matching the m3.material.io component drawer. */
const componentEntries: NavEntry[] = [
  { kind: "link", label: "Overview", href: "/" },
  { kind: "link", label: "App bars", href: "/layout/app-bar" },
  { kind: "link", label: "Badges", href: "/data-display/badges" },
  {
    kind: "group",
    label: "Buttons",
    children: [
      { label: "All buttons", href: "/buttons" },
      { label: "Button groups", href: "/buttons/button-group" },
      { label: "Common buttons", href: "/buttons" },
      { label: "Extended FABs", href: "/buttons/fabs" },
      { label: "FAB menu", href: "/buttons/fabs" },
      { label: "FABs", href: "/buttons/fabs" },
      { label: "Icon buttons", href: "/buttons/icon-buttons" },
      { label: "Split button", href: "/buttons/split-button" },
    ],
  },
  { kind: "link", label: "Cards", href: "/data-display/cards" },
  { kind: "link", label: "Carousel", href: "/layout/carousel" },
  { kind: "link", label: "Checkbox", href: "/inputs/checkbox" },
  { kind: "link", label: "Chips", href: "/data-display/chips" },
  {
    kind: "group",
    label: "Date & time pickers",
    children: [
      { label: "Date picker", href: "/pickers/date" },
      { label: "Time picker", href: "/pickers/time" },
    ],
  },
  { kind: "link", label: "Dialogs", href: "/feedback/dialog" },
  { kind: "link", label: "Divider", href: "/data-display/divider" },
  { kind: "link", label: "Icon", href: "/data-display/icon" },
  { kind: "link", label: "Lists", href: "/data-display/lists" },
  { kind: "link", label: "Menus", href: "/feedback/menu" },
  {
    kind: "group",
    label: "Navigation",
    children: [
      { label: "Navigation bar", href: "/navigation/bar" },
      { label: "Navigation rail", href: "/navigation/rail" },
    ],
  },
  {
    kind: "group",
    label: "Progress indicators",
    children: [
      { label: "All indicators", href: "/feedback/progress" },
    ],
  },
  { kind: "link", label: "Radio", href: "/inputs/radio" },
  { kind: "link", label: "Search", href: "/inputs/search" },
  { kind: "link", label: "Select", href: "/inputs/select" },
  {
    kind: "group",
    label: "Sheets",
    children: [
      { label: "Bottom sheet", href: "/layout/bottom-sheet" },
      { label: "Side sheet", href: "/layout/side-sheet" },
    ],
  },
  { kind: "link", label: "Slider", href: "/inputs/slider" },
  { kind: "link", label: "Snackbar", href: "/feedback/snackbar" },
  { kind: "link", label: "Switch", href: "/inputs/switch" },
  { kind: "link", label: "Tabs", href: "/layout/tabs" },
  { kind: "link", label: "Text fields", href: "/inputs/text-fields" },
  { kind: "link", label: "Toolbar", href: "/layout/toolbar" },
  { kind: "link", label: "Tooltip", href: "/data-display/tooltip" },
  { kind: "link", label: "Typography", href: "/layout/typography" },
];

// ─── Rail items (top-level sections like m3.material.io) ──────────────────────

type RailItem = {
  value: string;
  icon: string;
  label: string;
  href?: string; // direct link (non-drawer items)
};

const railItems: RailItem[] = [
  { value: "home", icon: "home", label: "Home", href: "/" },
  { value: "components", icon: "widgets", label: "Components" },
];

// ─── Collapsible group component ──────────────────────────────────────────────

function NavGroup({
  label,
  children,
  pathname,
  defaultOpen,
}: {
  label: string;
  children: { label: string; href: string }[];
  pathname: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  // Auto-open when a child becomes active
  React.useEffect(() => {
    if (children.some((c) => pathname === c.href)) {
      setOpen(true);
    }
  }, [pathname, children]);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "flex items-center w-full px-4 py-3 rounded-full cursor-pointer",
          "text-[14px] leading-5 text-[hsl(var(--on-surface-variant))]",
          "hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary",
        ].join(" ")}
      >
        <span className="flex-1 text-start">{label}</span>
        <Icon
          name={open ? "arrow_drop_up" : "arrow_drop_down"}
          size={20}
          className="text-[hsl(var(--on-surface-variant))]"
        />
      </button>

      {open && (
        <div className="flex flex-col gap-0.5 ps-3">
          {children.map((child) => {
            const isActive = pathname === child.href;
            return (
              <Link
                key={child.href + child.label}
                href={child.href}
                className={[
                  "no-underline flex items-center px-4 py-2.5 rounded-full",
                  "text-[14px] leading-5 transition-colors",
                  isActive
                    ? "bg-secondary-container text-secondary-container-foreground font-medium"
                    : "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--on-surface)/0.08)]",
                ].join(" ")}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dark, setDark] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // "pinned" means the user is on a component page — drawer stays open
  // even after the cursor leaves. On the homepage it unpins.
  const [pinned, setPinned] = React.useState(false);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Pin the drawer open when on a component page; unpin on homepage
  React.useEffect(() => {
    if (pathname === "/") {
      setPinned(false);
      setDrawerOpen(false);
    } else {
      setPinned(true);
      setDrawerOpen(true);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  // Hover open — cancel any pending close and show the drawer
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDrawerOpen(true);
  };

  // Hover close — only close if not pinned. Grace period so the user
  // can move between the rail item and the drawer.
  const handleMouseLeave = () => {
    if (pinned) return;
    closeTimerRef.current = setTimeout(() => {
      setDrawerOpen(false);
    }, 220);
  };

  const activeRail = pathname === "/" ? "home" : "components";

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* ── Sidebar: rail + drawer side by side ──────────────────── */}
        <div className="fixed inset-t-0 inset-l-0 h-screen z-40 flex">
          {/* Rail — always visible, 80px */}
          <nav className="flex flex-col items-center w-20 shrink-0 bg-surface-container h-full py-3">
            {/* Rail items */}
            <div className="flex flex-col items-center gap-2 flex-1">
              {railItems.map((item) => {
                const isActive = activeRail === item.value;
                const isComponents = item.value === "components";

                const inner = (
                  <button
                    key={item.value}
                    onMouseEnter={isComponents ? handleMouseEnter : undefined}
                    onMouseLeave={isComponents ? handleMouseLeave : undefined}
                    className={[
                      "group relative flex flex-col items-center justify-center cursor-pointer outline-none",
                      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-lg py-1",
                    ].join(" ")}
                  >
                    <span className="relative flex items-center justify-center w-14 h-8">
                      <span
                        className={[
                          "absolute inset-0 rounded-full transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center",
                          isActive
                            ? "bg-secondary-container scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0",
                        ].join(" ")}
                      />
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
                    <span
                      className={[
                        "text-[12px] leading-4 font-medium tracking-[0.5px] mt-0.5",
                        isActive ? "text-secondary" : "text-[hsl(var(--on-surface-variant))]",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                  </button>
                );

                // Home links directly; Components toggles the drawer
                if (item.href) {
                  return (
                    <Link key={item.value} href={item.href} className="no-underline">
                      {inner}
                    </Link>
                  );
                }
                return <React.Fragment key={item.value}>{inner}</React.Fragment>;
              })}
            </div>

            {/* Theme toggle at bottom */}
            <div className="pt-2">
              <IconButton
                icon={dark ? "light_mode" : "dark_mode"}
                variant="standard"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              />
            </div>
          </nav>

          {/* Drawer — slides in from the right of the rail */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={[
              "h-full bg-surface-container border-e border-outline-variant overflow-hidden",
              "transition-[width,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              drawerOpen ? "w-70 opacity-100" : "w-0 opacity-0",
            ].join(" ")}
          >
            <div className="w-70 h-full flex flex-col">
              {/* Drawer content — scrollable list */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
                {componentEntries.map((entry, i) => {
                  if (entry.kind === "link") {
                    const isActive = pathname === entry.href;
                    return (
                      <Link
                        key={entry.href + i}
                        href={entry.href}
                        className={[
                          "no-underline flex items-center px-4 py-3 rounded-full",
                          "text-[14px] leading-5 transition-colors",
                          isActive
                            ? "bg-secondary-container text-secondary-container-foreground font-medium"
                            : "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--on-surface)/0.08)]",
                        ].join(" ")}
                      >
                        {entry.label}
                      </Link>
                    );
                  }

                  // Collapsible group
                  const hasActiveChild = entry.children.some(
                    (c) => pathname === c.href
                  );
                  return (
                    <NavGroup
                      key={entry.label}
                      label={entry.label}
                      children={entry.children}
                      pathname={pathname}
                      defaultOpen={hasActiveChild}
                    />
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* ── Main content — pushes with the sidebar ───────────────── */}
        <div
          className={[
            "transition-[margin-left] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            drawerOpen ? "ml-[360px]" : "ml-20",
          ].join(" ")}
        >
          <main className="p-8 max-w-240">{children}</main>
        </div>
      </body>
    </html>
  );
}
