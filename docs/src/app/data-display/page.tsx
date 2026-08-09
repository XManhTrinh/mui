"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Chip,
  List,
  ListItem,
  Tooltip,
  Divider,
  Icon,
  Button,
  IconButton,
} from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function DataDisplayPage() {
  const [filterSelected, setFilterSelected] = React.useState(false);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Data Display
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Components for displaying content, data, and metadata in structured layouts.
        </p>
      </div>

      {/* Card */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Card</h2>

        <Showcase title="Card Variants" className="items-start">
          <Card variant="elevated" className="w-64">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Uses shadow for elevation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card uses elevation shadow to stand out from the surface.</p>
            </CardContent>
            <CardFooter>
              <Button variant="text" size="s">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="filled" className="w-64">
            <CardHeader>
              <CardTitle>Filled Card</CardTitle>
              <CardDescription>Filled container background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card uses a container fill color for visual weight.</p>
            </CardContent>
            <CardFooter>
              <Button variant="text" size="s">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="outlined" className="w-64">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>Border outline style</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card uses an outline border to define its boundary.</p>
            </CardContent>
            <CardFooter>
              <Button variant="text" size="s">Action</Button>
            </CardFooter>
          </Card>
        </Showcase>

        <Showcase title="Interactive Card" className="items-start">
          <Card variant="elevated" interactive className="w-72">
            <CardHeader>
              <CardTitle>Clickable Card</CardTitle>
              <CardDescription>Hover to see state layer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card responds to hover and press interactions.</p>
            </CardContent>
          </Card>
        </Showcase>
      </section>

      {/* Badge */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Badge</h2>

        <Showcase title="Badge Variants">
          <Badge variant="dot" visible>
            <IconButton variant="standard" aria-label="Notifications">
              <Icon name="notifications" />
            </IconButton>
          </Badge>
          <Badge variant="count" count={3} visible>
            <IconButton variant="standard" aria-label="Mail">
              <Icon name="mail" />
            </IconButton>
          </Badge>
          <Badge variant="count" count={99} visible>
            <IconButton variant="standard" aria-label="Chat">
              <Icon name="chat" />
            </IconButton>
          </Badge>
          <Badge variant="count" count={999} visible>
            <IconButton variant="standard" aria-label="Updates">
              <Icon name="update" />
            </IconButton>
          </Badge>
        </Showcase>
      </section>

      {/* Chip */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Chip</h2>

        <Showcase title="Assist Chip">
          <Chip variant="assist" leadingIcon="event">Event</Chip>
          <Chip variant="assist" leadingIcon="directions">Directions</Chip>
          <Chip variant="assist" elevated>Elevated</Chip>
        </Showcase>

        <Showcase title="Filter Chip">
          <Chip
            variant="filter"
            selected={filterSelected}
            onClick={() => setFilterSelected(!filterSelected)}
          >
            {filterSelected ? "Selected" : "Unselected"}
          </Chip>
          <Chip variant="filter" selected>Running</Chip>
          <Chip variant="filter" selected={false}>Walking</Chip>
          <Chip variant="filter" selected>Cycling</Chip>
        </Showcase>

        <Showcase title="Input Chip">
          <Chip variant="input" onDismiss={() => {}}>John Doe</Chip>
          <Chip variant="input" leadingIcon="person" onDismiss={() => {}}>Jane Smith</Chip>
          <Chip variant="input" onDismiss={() => {}}>Tag Name</Chip>
        </Showcase>

        <Showcase title="Suggestion Chip">
          <Chip variant="suggestion">Try this</Chip>
          <Chip variant="suggestion">Or this</Chip>
          <Chip variant="suggestion">Suggested</Chip>
        </Showcase>
      </section>

      {/* List */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">List</h2>

        <Showcase title="One-line List" className="flex-col items-stretch">
          <div className="max-w-md w-full bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <List>
              <ListItem>List Item 1</ListItem>
              <ListItem>List Item 2</ListItem>
              <ListItem>List Item 3</ListItem>
            </List>
          </div>
        </Showcase>

        <Showcase title="Two-line List" className="flex-col items-stretch">
          <div className="max-w-md w-full bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <List>
              <ListItem
                supporting="Jan 9, 2024"
                leading={<Icon name="folder" size={24} />}
                lines={2}
              >
                Photos
              </ListItem>
              <ListItem
                supporting="Jan 17, 2024"
                leading={<Icon name="folder" size={24} />}
                lines={2}
              >
                Recipes
              </ListItem>
              <ListItem
                supporting="Jan 28, 2024"
                leading={<Icon name="folder" size={24} />}
                lines={2}
              >
                Work
              </ListItem>
            </List>
          </div>
        </Showcase>

        <Showcase title="Three-line List with Trailing" className="flex-col items-stretch">
          <div className="max-w-md w-full bg-surface rounded-xl border border-outline-variant overflow-hidden">
            <List>
              <ListItem
                supporting="Ali Connors — I'll be at the usual spot on Saturday."
                leading={<Icon name="person" size={24} />}
                trailing={<span className="text-xs text-surface-variant-foreground">3m</span>}
                lines={3}
              >
                Brunch this weekend?
              </ListItem>
              <ListItem
                supporting="to Alex, Scott, Jennifer — Wish I could come, but I'm out."
                leading={<Icon name="person" size={24} />}
                trailing={<span className="text-xs text-surface-variant-foreground">1h</span>}
                lines={3}
              >
                Summer BBQ
              </ListItem>
            </List>
          </div>
        </Showcase>
      </section>

      {/* Tooltip */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Tooltip</h2>

        <Showcase title="Plain Tooltip">
          <Tooltip content="Add to favorites">
            <IconButton variant="standard" aria-label="Favorite">
              <Icon name="favorite" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Share this item">
            <IconButton variant="standard" aria-label="Share">
              <Icon name="share" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete permanently">
            <IconButton variant="standard" aria-label="Delete">
              <Icon name="delete" />
            </IconButton>
          </Tooltip>
        </Showcase>

        <Showcase title="Rich Tooltip">
          <Tooltip
            variant="rich"
            content="Rich tooltips can contain more detailed information and span multiple lines."
          >
            <Button variant="outlined">Hover for details</Button>
          </Tooltip>
        </Showcase>
      </section>

      {/* Divider */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Divider</h2>

        <Showcase title="Divider Variants" className="flex-col items-stretch">
          <div className="max-w-md w-full space-y-4">
            <p className="text-sm text-surface-variant-foreground">Full width:</p>
            <Divider />

            <p className="text-sm text-surface-variant-foreground">Inset:</p>
            <Divider variant="inset" />

            <p className="text-sm text-surface-variant-foreground">Middle inset:</p>
            <Divider variant="middle-inset" />
          </div>
        </Showcase>
      </section>

      {/* Icon */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Icon</h2>

        <Showcase title="Icon Sizes">
          <Icon name="home" size={18} />
          <Icon name="home" size={20} />
          <Icon name="home" size={24} />
          <Icon name="home" size={40} />
          <Icon name="home" size={48} />
        </Showcase>

        <Showcase title="Icon Weights">
          <Icon name="settings" weight={100} />
          <Icon name="settings" weight={200} />
          <Icon name="settings" weight={300} />
          <Icon name="settings" weight={400} />
          <Icon name="settings" weight={500} />
          <Icon name="settings" weight={600} />
          <Icon name="settings" weight={700} />
        </Showcase>

        <Showcase title="Filled vs Outlined">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Icon name="favorite" filled={false} />
              <span className="text-xs">Outlined</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="favorite" filled={true} />
              <span className="text-xs">Filled</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="bookmark" filled={false} />
              <span className="text-xs">Outlined</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="bookmark" filled={true} />
              <span className="text-xs">Filled</span>
            </div>
          </div>
        </Showcase>
      </section>

      {/* Props Tables */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Card Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">variant</td>
                <td className="px-4 py-2 font-mono text-xs">{`"elevated" | "filled" | "outlined"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"elevated"`}</td>
                <td className="px-4 py-2">Card visual style</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">interactive</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Enables hover and press state layers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
