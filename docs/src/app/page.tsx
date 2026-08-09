import { Icon } from "@mui/index";

export default function HomePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-bold text-surface-foreground mb-2">
        M3 Components
      </h1>
      <p className="text-lg text-surface-variant-foreground mb-8">
        A Material Design 3 Expressive component library for React and Next.js,
        built with Tailwind CSS v4 and Radix primitives.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PageCard
          icon="buttons_alt"
          title="Buttons"
          description="Button, IconButton, FAB, ExtendedFAB, SplitButton, ButtonGroup"
          href="/buttons"
        />
        <PageCard
          icon="input"
          title="Inputs"
          description="TextField, Checkbox, Radio, Switch, Slider, Search"
          href="/inputs"
        />
        <PageCard
          icon="dashboard"
          title="Data Display"
          description="Card, Badge, Chip, List, Tooltip, Divider, Icon"
          href="/data-display"
        />
        <PageCard
          icon="feedback"
          title="Feedback"
          description="Dialog, Snackbar, Menu, Progress, LoadingIndicator"
          href="/feedback"
        />
        <PageCard
          icon="menu"
          title="Navigation"
          description="NavigationBar, NavigationRail"
          href="/navigation"
        />
        <PageCard
          icon="view_sidebar"
          title="Layout"
          description="AppBar, Tabs, Sheets, Toolbar, Carousel"
          href="/layout-components"
        />
      </div>
    </div>
  );
}

function PageCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group block rounded-2xl border border-outline-variant p-5 bg-surface-container-low hover:bg-surface-container transition-colors"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon name={icon} size={24} className="text-primary" />
        <h2 className="text-base font-semibold text-surface-foreground">
          {title}
        </h2>
      </div>
      <p className="text-sm text-surface-variant-foreground">{description}</p>
    </a>
  );
}
