"use client";

import "material-symbols/rounded.css";
import "./globals.css";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconButton, FAB } from "@mui/index";

// ─── Inline theme CSS for runtime switching ───────────────────────────────────
// Each preset only overrides the color custom properties. The :root block is
// applied at higher specificity (:root:root) so it wins over theme.css defaults.

const blueThemeCSS = `
:root:root{--primary:217 90% 43%;--on-primary:0 0% 100%;--primary-container:217 91% 91%;--on-primary-container:217 90% 15%;--secondary:223 17% 41%;--on-secondary:0 0% 100%;--secondary-container:225 72% 92%;--on-secondary-container:218 39% 12%;--tertiary:304 16% 40%;--on-tertiary:0 0% 100%;--tertiary-container:315 100% 92%;--on-tertiary-container:302 46% 12%;--surface:240 100% 99%;--on-surface:214 12% 11%;--surface-variant:225 23% 90%;--on-surface-variant:218 8% 28%;--outline:220 5% 47%;--outline-variant:225 11% 79%;--inverse-surface:225 8% 20%;--inverse-on-surface:240 30% 95%;--inverse-primary:217 89% 82%;--surface-container-lowest:0 0% 100%;--surface-container-low:240 41% 97%;--surface-container:231 24% 94%;--surface-container-high:231 17% 92%;--surface-container-highest:231 13% 90%;--surface-bright:240 100% 99%;--surface-dim:240 10% 86%}
:root:root.dark{--primary:217 89% 82%;--on-primary:217 90% 23%;--primary-container:217 90% 33%;--on-primary-container:217 91% 91%;--secondary:224 30% 80%;--on-secondary:218 24% 21%;--secondary-container:220 18% 30%;--on-secondary-container:225 72% 92%;--tertiary:295 37% 81%;--on-tertiary:289 26% 21%;--tertiary-container:290 19% 30%;--on-tertiary-container:315 100% 92%;--surface:223 17% 8%;--on-surface:231 13% 90%;--surface-variant:218 8% 28%;--on-surface-variant:225 11% 79%;--outline:220 6% 58%;--outline-variant:218 8% 28%;--inverse-surface:231 13% 90%;--inverse-on-surface:225 8% 20%;--inverse-primary:217 90% 43%;--surface-container-lowest:223 23% 6%;--surface-container-low:214 12% 11%;--surface-container:214 11% 13%;--surface-container-high:223 8% 17%;--surface-container-highest:223 6% 21%;--surface-bright:223 6% 23%;--surface-dim:223 17% 8%}`;

const tealThemeCSS = `
:root:root{--primary:180 100% 21%;--on-primary:0 0% 100%;--primary-container:179 75% 78%;--on-primary-container:180 100% 6%;--secondary:180 14% 34%;--on-secondary:0 0% 100%;--secondary-container:178 38% 85%;--on-secondary-container:180 72% 7%;--tertiary:214 25% 39%;--on-tertiary:0 0% 100%;--tertiary-container:217 91% 91%;--on-tertiary-container:217 90% 15%;--surface:171 47% 97%;--on-surface:180 14% 10%;--surface-variant:175 17% 88%;--on-surface-variant:174 7% 27%;--outline:180 4% 45%;--outline-variant:175 9% 77%;--inverse-surface:171 8% 18%;--inverse-on-surface:170 19% 94%;--inverse-primary:179 50% 67%;--surface-container-lowest:0 0% 100%;--surface-container-low:171 26% 95%;--surface-container:171 18% 92%;--surface-container-high:180 12% 90%;--surface-container-highest:171 11% 88%;--surface-bright:171 47% 97%;--surface-dim:180 8% 85%}
:root:root.dark{--primary:179 50% 67%;--on-primary:180 100% 11%;--primary-container:180 100% 15%;--on-primary-container:179 75% 78%;--secondary:178 22% 75%;--on-secondary:178 33% 16%;--secondary-container:180 20% 25%;--on-secondary-container:178 38% 85%;--tertiary:216 54% 81%;--on-tertiary:213 46% 20%;--tertiary-container:215 32% 29%;--on-tertiary-container:217 91% 91%;--surface:171 20% 7%;--on-surface:171 11% 88%;--surface-variant:174 7% 27%;--on-surface-variant:175 9% 77%;--outline:174 4% 56%;--outline-variant:174 7% 27%;--inverse-surface:171 11% 88%;--inverse-on-surface:171 8% 18%;--inverse-primary:180 100% 21%;--surface-container-lowest:180 25% 5%;--surface-container-low:180 14% 10%;--surface-container:180 12% 12%;--surface-container-high:180 8% 16%;--surface-container-highest:180 6% 20%;--surface-bright:171 6% 22%;--surface-dim:171 20% 7%}`;

const greenThemeCSS = `
:root:root{--primary:162 100% 21%;--on-primary:0 0% 100%;--primary-container:154 89% 75%;--on-primary-container:156 100% 6%;--secondary:145 13% 35%;--on-secondary:0 0% 100%;--secondary-container:140 34% 86%;--on-secondary-container:150 48% 8%;--tertiary:197 31% 35%;--on-tertiary:0 0% 100%;--tertiary-container:200 88% 87%;--on-tertiary-container:195 100% 8%;--surface:120 43% 97%;--on-surface:140 12% 10%;--surface-variant:127 15% 88%;--on-surface-variant:140 7% 27%;--outline:140 4% 46%;--outline-variant:127 8% 77%;--inverse-surface:130 6% 18%;--inverse-on-surface:120 19% 94%;--inverse-primary:155 61% 64%;--surface-container-lowest:0 0% 100%;--surface-container-low:120 23% 95%;--surface-container:129 19% 93%;--surface-container-high:120 12% 91%;--surface-container-highest:129 12% 88%;--surface-bright:120 43% 97%;--surface-dim:120 8% 85%}
:root:root.dark{--primary:155 61% 64%;--on-primary:160 100% 11%;--primary-container:161 100% 16%;--on-primary-container:154 89% 75%;--secondary:140 19% 75%;--on-secondary:146 25% 17%;--secondary-container:146 16% 25%;--on-secondary-container:140 34% 86%;--tertiary:199 46% 76%;--on-tertiary:194 81% 15%;--tertiary-container:196 43% 25%;--on-tertiary-container:200 88% 87%;--surface:140 17% 7%;--on-surface:129 12% 88%;--surface-variant:140 7% 27%;--on-surface-variant:127 8% 77%;--outline:133 4% 56%;--outline-variant:140 7% 27%;--inverse-surface:129 12% 88%;--inverse-on-surface:130 6% 18%;--inverse-primary:162 100% 21%;--surface-container-lowest:140 23% 5%;--surface-container-low:140 12% 10%;--surface-container:140 10% 12%;--surface-container-high:130 7% 16%;--surface-container-highest:130 6% 20%;--surface-bright:130 5% 22%;--surface-dim:140 17% 7%}`;

const redThemeCSS = `
:root:root{--primary:357 41% 43%;--on-primary:0 0% 100%;--primary-container:358 100% 93%;--on-primary-container:352 100% 13%;--secondary:356 16% 40%;--on-secondary:0 0% 100%;--secondary-container:358 100% 93%;--on-secondary-container:355 35% 13%;--tertiary:37 43% 32%;--on-tertiary:0 0% 100%;--tertiary-container:34 100% 85%;--on-tertiary-container:38 100% 8%;--surface:300 100% 99%;--on-surface:0 10% 11%;--surface-variant:0 51% 91%;--on-surface-variant:0 10% 29%;--outline:0 7% 49%;--outline-variant:0 22% 80%;--inverse-surface:0 7% 20%;--inverse-on-surface:0 55% 96%;--inverse-primary:357 100% 85%;--surface-container-lowest:0 0% 100%;--surface-container-low:0 76% 97%;--surface-container:0 50% 95%;--surface-container-high:0 35% 92%;--surface-container-highest:0 27% 90%;--surface-bright:300 100% 99%;--surface-dim:0 19% 87%}
:root:root.dark{--primary:357 100% 85%;--on-primary:353 67% 22%;--primary-container:356 50% 33%;--on-primary-container:358 100% 93%;--secondary:359 45% 82%;--on-secondary:356 25% 21%;--secondary-container:356 19% 31%;--on-secondary-container:358 100% 93%;--tertiary:36 61% 72%;--on-tertiary:40 83% 14%;--tertiary-container:38 55% 23%;--on-tertiary-container:34 100% 85%;--surface:0 14% 8%;--on-surface:0 27% 90%;--surface-variant:0 10% 29%;--on-surface-variant:0 22% 80%;--outline:0 10% 59%;--outline-variant:0 10% 29%;--inverse-surface:0 27% 90%;--inverse-on-surface:0 7% 20%;--inverse-primary:357 41% 43%;--surface-container-lowest:0 16% 6%;--surface-container-low:0 10% 11%;--surface-container:0 9% 13%;--surface-container-high:0 8% 17%;--surface-container-highest:0 6% 21%;--surface-bright:0 7% 23%;--surface-dim:0 14% 8%}`;

const amberThemeCSS = `
:root:root{--primary:44 100% 24%;--on-primary:0 0% 100%;--primary-container:40 100% 81%;--on-primary-container:41 100% 7%;--secondary:41 26% 33%;--on-secondary:0 0% 100%;--secondary-container:40 70% 84%;--on-secondary-container:41 80% 8%;--tertiary:114 17% 34%;--on-tertiary:0 0% 100%;--tertiary-container:108 49% 85%;--on-tertiary-container:125 64% 8%;--surface:32 100% 97%;--on-surface:40 24% 10%;--surface-variant:37 43% 87%;--on-surface-variant:41 14% 26%;--outline:39 10% 45%;--outline-variant:36 23% 76%;--inverse-surface:39 15% 18%;--inverse-on-surface:35 61% 93%;--inverse-primary:42 87% 62%;--surface-container-lowest:0 0% 100%;--surface-container-low:37 68% 94%;--surface-container:35 52% 92%;--surface-container-high:35 41% 89%;--surface-container-highest:37 32% 87%;--surface-bright:32 100% 97%;--surface-dim:37 26% 84%}
:root:root.dark{--primary:42 87% 62%;--on-primary:42 100% 13%;--primary-container:44 100% 18%;--on-primary-container:40 100% 81%;--secondary:40 40% 73%;--on-secondary:42 47% 15%;--secondary-container:40 32% 24%;--on-secondary-container:40 70% 84%;--tertiary:110 28% 74%;--on-tertiary:118 32% 16%;--tertiary-container:116 22% 25%;--on-tertiary-container:108 49% 85%;--surface:40 35% 7%;--on-surface:37 32% 87%;--surface-variant:41 14% 26%;--on-surface-variant:36 23% 76%;--outline:38 11% 55%;--outline-variant:41 14% 26%;--inverse-surface:37 32% 87%;--inverse-on-surface:39 15% 18%;--inverse-primary:44 100% 24%;--surface-container-lowest:42 42% 5%;--surface-container-low:40 24% 10%;--surface-container:40 21% 11%;--surface-container-high:37 16% 15%;--surface-container-highest:39 14% 20%;--surface-bright:34 13% 22%;--surface-dim:40 35% 7%}`;

const facebookThemeCSS = `
:root:root{--primary:214 89% 52%;--on-primary:0 0% 100%;--primary-container:219 100% 92%;--on-primary-container:212 100% 12%;--secondary:219 14% 39%;--on-secondary:0 0% 100%;--secondary-container:221 69% 91%;--on-secondary-container:216 41% 12%;--tertiary:285 16% 40%;--on-tertiary:0 0% 100%;--tertiary-container:289 95% 92%;--on-tertiary-container:283 42% 13%;--surface:240 100% 99%;--on-surface:220 10% 11%;--surface-variant:225 23% 90%;--on-surface-variant:218 8% 28%;--outline:220 5% 47%;--outline-variant:220 11% 79%;--inverse-surface:230 6% 20%;--inverse-on-surface:240 30% 95%;--inverse-primary:217 100% 82%;--surface-container-lowest:0 0% 100%;--surface-container-low:240 41% 97%;--surface-container:240 24% 94%;--surface-container-high:240 18% 92%;--surface-container-highest:240 14% 90%;--surface-bright:240 100% 99%;--surface-dim:249 10% 86%}
:root:root.dark{--primary:217 100% 82%;--on-primary:210 100% 19%;--primary-container:208 100% 26%;--on-primary-container:219 100% 92%;--secondary:221 31% 80%;--on-secondary:217 25% 20%;--secondary-container:218 18% 29%;--on-secondary-container:221 69% 91%;--tertiary:287 39% 81%;--on-tertiary:283 27% 21%;--tertiary-container:284 19% 31%;--on-tertiary-container:289 95% 92%;--surface:225 10% 8%;--on-surface:240 14% 90%;--surface-variant:218 8% 28%;--on-surface-variant:220 11% 79%;--outline:220 6% 58%;--outline-variant:218 8% 28%;--inverse-surface:240 14% 90%;--inverse-on-surface:230 6% 20%;--inverse-primary:211 73% 39%;--surface-container-lowest:225 13% 6%;--surface-container-low:220 10% 11%;--surface-container:220 9% 13%;--surface-container-high:220 7% 17%;--surface-container-highest:220 6% 21%;--surface-bright:220 5% 23%;--surface-dim:225 10% 8%}`;

const whatsappThemeCSS = `
:root:root{--primary:142 70% 49%;--on-primary:0 0% 100%;--primary-container:141 99% 68%;--on-primary-container:145 100% 6%;--secondary:137 12% 35%;--on-secondary:0 0% 100%;--secondary-container:133 34% 86%;--on-secondary-container:144 48% 8%;--tertiary:194 31% 34%;--on-tertiary:0 0% 100%;--tertiary-container:195 78% 86%;--on-tertiary-container:194 100% 8%;--surface:111 47% 97%;--on-surface:130 12% 10%;--surface-variant:114 16% 88%;--on-surface-variant:133 7% 27%;--outline:133 4% 46%;--outline-variant:120 8% 77%;--inverse-surface:120 6% 18%;--inverse-on-surface:111 21% 94%;--inverse-primary:146 75% 52%;--surface-container-lowest:0 0% 100%;--surface-container-low:111 26% 95%;--surface-container:111 18% 92%;--surface-container-high:120 14% 90%;--surface-container-highest:111 11% 88%;--surface-bright:111 47% 97%;--surface-dim:111 9% 85%}
:root:root.dark{--primary:146 75% 52%;--on-primary:149 100% 11%;--primary-container:151 100% 16%;--on-primary-container:141 99% 68%;--secondary:133 18% 75%;--on-secondary:143 25% 17%;--secondary-container:138 15% 25%;--on-secondary-container:133 34% 86%;--tertiary:195 44% 75%;--on-tertiary:192 91% 14%;--tertiary-container:193 44% 24%;--on-tertiary-container:195 78% 86%;--surface:130 17% 7%;--on-surface:111 11% 88%;--surface-variant:133 7% 27%;--on-surface-variant:120 8% 77%;--outline:127 4% 56%;--outline-variant:133 7% 27%;--inverse-surface:111 11% 88%;--inverse-on-surface:120 6% 18%;--inverse-primary:152 100% 21%;--surface-container-lowest:130 23% 5%;--surface-container-low:130 12% 10%;--surface-container:130 10% 12%;--surface-container-high:120 7% 16%;--surface-container-highest:129 7% 20%;--surface-bright:120 5% 22%;--surface-dim:130 17% 7%}`;

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
  const [activeTheme, setActiveTheme] = React.useState("purple");

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

  // ── Theme color switching ──────────────────────────────────
  // Apply theme by setting CSS custom properties on :root.
  // "purple" removes overrides (falls back to theme.css defaults).
  const applyTheme = React.useCallback((tokens: string | null) => {
    const name = tokens ?? "purple";
    setActiveTheme(name);

    const el = document.documentElement;

    // Remove any previous overrides
    const existing = document.getElementById("m3-theme-preset");
    if (existing) existing.remove();

    if (name === "purple") return; // default from theme.css

    // Inject the theme preset CSS as a style tag
    const themeMap: Record<string, string> = {
      blue: blueThemeCSS,
      teal: tealThemeCSS,
      green: greenThemeCSS,
      red: redThemeCSS,
      amber: amberThemeCSS,
      facebook: facebookThemeCSS,
      whatsapp: whatsappThemeCSS,
    };

    const css = themeMap[name];
    if (css) {
      const style = document.createElement("style");
      style.id = "m3-theme-preset";
      style.textContent = css;
      document.head.appendChild(style);
    }
  }, []);

  const activeCategory = React.useMemo(
    () => findActiveCategory(pathname),
    [pathname]
  );

  // On component pages the drawer is "pinned" — stays open and pushes content.
  // On the homepage there's no active category so nothing is pinned.
  const isPinned = pathname !== "/" && !!activeCategory;

  // Auto-set the drawer to the active category on navigation
  React.useEffect(() => {
    if (isPinned) {
      setOpenDrawer(activeCategory!);
    } else {
      setOpenDrawer(null);
    }
  }, [isPinned, activeCategory]);

  // ── Hover logic ─────────────────────────────────────────────────

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

  // Only schedule a close if not pinned. When pinned, the drawer
  // snaps back to the active category instead of closing.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (isPinned) {
        setOpenDrawer(activeCategory!);
      } else {
        setOpenDrawer(null);
      }
    }, 250);
  };

  // The drawer content for the currently hovered category (if any).
  const drawerCat = categories.find((c) => c.value === openDrawer);
  const isDrawerVisible = !!drawerCat;

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body className="bg-surface text-surface-foreground min-h-screen">
        {/* ── Sidebar: rail + drawer ───────────────────────────────── */}
        <div className="fixed top-0 left-0 h-screen z-40 flex">
          {/* Rail — always visible (80px) */}
          <nav className="flex flex-col items-center w-20 shrink-0 bg-surface-container h-full py-3 z-10">
            {/* Home */}
            <Link href="/" className="no-underline mb-4">
              <FAB
                size="fab"
                shape="rounded"
                color="primary"
                icon={<Icon name="home" />}
                aria-label="Home"
                className="shadow-none!"
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

            {/* Theme controls */}
            <div className="flex flex-col items-center gap-2 pt-2 pb-1">
              {/* Color palette dots */}
              <div className="flex flex-wrap justify-center gap-1.5 px-2">
                {([
                  { name: "purple", color: "#6750A4", tokens: null },
                  { name: "blue", color: "#0B57D0", tokens: "blue" },
                  { name: "teal", color: "#006A6A", tokens: "teal" },
                  { name: "green", color: "#006C4C", tokens: "green" },
                  { name: "red", color: "#B8232A", tokens: "red" },
                  { name: "amber", color: "#795900", tokens: "amber" },
                  { name: "facebook", color: "#1877F2", tokens: "facebook" },
                  { name: "whatsapp", color: "#25D366", tokens: "whatsapp" },
                ] as const).map((t) => (
                  <button
                    key={t.name}
                    title={t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                    onClick={() => applyTheme(t.tokens)}
                    className={[
                      "size-5 rounded-full cursor-pointer transition-all duration-200 outline-none",
                      "ring-offset-1 ring-offset-surface-container",
                      activeTheme === (t.tokens ?? "purple")
                        ? "ring-2 ring-primary scale-110"
                        : "hover:scale-110 ring-1 ring-outline-variant",
                    ].join(" ")}
                    style={{ backgroundColor: t.color }}
                    aria-label={`${t.name} theme`}
                  />
                ))}
              </div>
              {/* Dark/light toggle */}
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
              // Subtle shadow on the right edge (falls onto main content)
              "shadow-[2px_0_8px_0_hsl(var(--elevation-1))]",
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
        <div
          className={[
            "transition-[margin-left] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            // When drawer is pinned (component page), push content right.
            // Rail = 80px, drawer = 224px → total 304px.
            // When only rail visible → 80px.
            isDrawerVisible && isPinned ? "ml-76" : "ml-20",
          ].join(" ")}
        >
          <main className="p-8 max-w-240">{children}</main>
        </div>
      </body>
    </html>
  );
}
