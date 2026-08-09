"use client";

import * as React from "react";
import {
  Button,
  IconButton,
  FAB,
  ExtendedFAB,
  SplitButton,
  ButtonGroup,
  ButtonGroupItem,
  Icon,
} from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function ButtonsPage() {
  const [loading, setLoading] = React.useState(false);
  const [togglePressed, setTogglePressed] = React.useState(false);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-foreground mb-1">
          Buttons
        </h1>
        <p className="text-surface-variant-foreground">
          M3 buttons communicate actions users can take. They come in five
          variants with different emphasis levels.
        </p>
      </div>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Variants</h2>

        <Showcase title="Filled Button">
          <Button variant="filled" size="s">Small</Button>
          <Button variant="filled" size="m">Medium</Button>
          <Button variant="filled" size="l">Large</Button>
        </Showcase>

        <Showcase title="Outlined Button">
          <Button variant="outlined" size="s">Small</Button>
          <Button variant="outlined" size="m">Medium</Button>
          <Button variant="outlined" size="l">Large</Button>
        </Showcase>

        <Showcase title="Text Button">
          <Button variant="text" size="s">Small</Button>
          <Button variant="text" size="m">Medium</Button>
          <Button variant="text" size="l">Large</Button>
        </Showcase>

        <Showcase title="Elevated Button">
          <Button variant="elevated" size="s">Small</Button>
          <Button variant="elevated" size="m">Medium</Button>
          <Button variant="elevated" size="l">Large</Button>
        </Showcase>

        <Showcase title="Tonal Button">
          <Button variant="tonal" size="s">Small</Button>
          <Button variant="tonal" size="m">Medium</Button>
          <Button variant="tonal" size="l">Large</Button>
        </Showcase>
      </section>

      {/* Button with Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons with Icons</h2>

        <Showcase title="Leading Icon">
          <Button variant="filled" icon={<Icon name="add" />}>
            Create
          </Button>
          <Button variant="outlined" icon={<Icon name="edit" />}>
            Edit
          </Button>
          <Button variant="tonal" icon={<Icon name="send" />}>
            Send
          </Button>
        </Showcase>

        <Showcase title="Trailing Icon">
          <Button variant="filled" trailingIcon={<Icon name="arrow_forward" />}>
            Next
          </Button>
          <Button variant="outlined" trailingIcon={<Icon name="open_in_new" />}>
            Open
          </Button>
        </Showcase>

        <Showcase title="Both Icons">
          <Button
            variant="tonal"
            icon={<Icon name="attach_file" />}
            trailingIcon={<Icon name="arrow_drop_down" />}
          >
            Attach
          </Button>
        </Showcase>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loading State</h2>

        <Showcase title="Loading Button">
          <Button variant="filled" loading={loading} onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}>
            {loading ? "Saving..." : "Click to Load"}
          </Button>
          <Button variant="outlined" loading>
            Loading
          </Button>
          <Button variant="tonal" loading>
            Processing
          </Button>
        </Showcase>
      </section>

      {/* Icon Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Buttons</h2>

        <Showcase title="Standard">
          <IconButton variant="standard" aria-label="Settings">
            <Icon name="settings" />
          </IconButton>
          <IconButton variant="standard" aria-label="Search">
            <Icon name="search" />
          </IconButton>
          <IconButton variant="standard" aria-label="Close">
            <Icon name="close" />
          </IconButton>
        </Showcase>

        <Showcase title="Filled">
          <IconButton variant="filled" aria-label="Add">
            <Icon name="add" />
          </IconButton>
          <IconButton variant="filled" aria-label="Edit">
            <Icon name="edit" />
          </IconButton>
          <IconButton variant="filled" aria-label="Delete">
            <Icon name="delete" />
          </IconButton>
        </Showcase>

        <Showcase title="Filled Tonal">
          <IconButton variant="filled-tonal" aria-label="Bookmark">
            <Icon name="bookmark" />
          </IconButton>
          <IconButton variant="filled-tonal" aria-label="Share">
            <Icon name="share" />
          </IconButton>
          <IconButton variant="filled-tonal" aria-label="Download">
            <Icon name="download" />
          </IconButton>
        </Showcase>

        <Showcase title="Outlined">
          <IconButton variant="outlined" aria-label="Favorite">
            <Icon name="favorite" />
          </IconButton>
          <IconButton variant="outlined" aria-label="Print">
            <Icon name="print" />
          </IconButton>
          <IconButton variant="outlined" aria-label="More">
            <Icon name="more_vert" />
          </IconButton>
        </Showcase>

        <Showcase title="Square Shape">
          <IconButton variant="filled" shape="square" aria-label="Grid">
            <Icon name="grid_view" />
          </IconButton>
          <IconButton variant="filled-tonal" shape="square" aria-label="List">
            <Icon name="view_list" />
          </IconButton>
          <IconButton variant="outlined" shape="square" aria-label="Modules">
            <Icon name="view_module" />
          </IconButton>
        </Showcase>

        <Showcase title="Toggle Icon Button">
          <IconButton
            variant="standard"
            toggle
            pressed={togglePressed}
            onPressedChange={setTogglePressed}
            aria-label="Favorite"
          >
            <Icon name="favorite" filled={togglePressed} />
          </IconButton>
          <span className="text-sm text-surface-variant-foreground">
            {togglePressed ? "Pressed" : "Unpressed"} — click to toggle
          </span>
        </Showcase>
      </section>

      {/* FAB */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Floating Action Buttons</h2>

        <Showcase title="FAB Sizes">
          <FAB size="m" icon={<Icon name="add" />} aria-label="Add" />
          <FAB size="l" icon={<Icon name="add" />} aria-label="Add" />
          <FAB size="xl" icon={<Icon name="add" />} aria-label="Add" />
        </Showcase>

        <Showcase title="FAB Colors">
          <FAB color="primary" icon={<Icon name="edit" />} aria-label="Edit" />
          <FAB color="secondary" icon={<Icon name="edit" />} aria-label="Edit" />
          <FAB color="tertiary" icon={<Icon name="edit" />} aria-label="Edit" />
        </Showcase>

        <Showcase title="FAB Round Shape">
          <FAB shape="round" size="m" icon={<Icon name="navigation" />} aria-label="Navigate" />
          <FAB shape="round" size="l" icon={<Icon name="navigation" />} aria-label="Navigate" />
          <FAB shape="round" size="xl" icon={<Icon name="navigation" />} aria-label="Navigate" />
        </Showcase>
      </section>

      {/* Extended FAB */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Extended FAB</h2>

        <Showcase title="Extended FAB Sizes">
          <ExtendedFAB size="small" icon={<Icon name="add" />} label="Create" />
          <ExtendedFAB size="medium" icon={<Icon name="edit" />} label="Compose" />
          <ExtendedFAB size="large" icon={<Icon name="navigation" />} label="Navigate" />
        </Showcase>

        <Showcase title="Extended FAB Colors">
          <ExtendedFAB color="primary" icon={<Icon name="add" />} label="Primary" />
          <ExtendedFAB color="secondary" icon={<Icon name="add" />} label="Secondary" />
          <ExtendedFAB color="tertiary" icon={<Icon name="add" />} label="Tertiary" />
        </Showcase>
      </section>

      {/* Split Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Split Button</h2>

        <Showcase title="Split Button">
          <SplitButton
            label="Save"
            icon={<Icon name="save" />}
            menuContent={
              <>
                <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Draft</div>
                <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save and Publish</div>
                <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Template</div>
              </>
            }
          />
        </Showcase>
      </section>

      {/* Button Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Group</h2>

        <Showcase title="Connected Button Group">
          <ButtonGroup variant="connected">
            <ButtonGroupItem value="left" label="Left" />
            <ButtonGroupItem value="center" label="Center" />
            <ButtonGroupItem value="right" label="Right" />
          </ButtonGroup>
        </Showcase>

        <Showcase title="Standard Button Group">
          <ButtonGroup variant="standard">
            <ButtonGroupItem value="a" label="Option A" />
            <ButtonGroupItem value="b" label="Option B" />
            <ButtonGroupItem value="c" label="Option C" />
          </ButtonGroup>
        </Showcase>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Props</h2>
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
                <td className="px-4 py-2 font-mono text-xs">{`"filled" | "outlined" | "text" | "elevated" | "tonal"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"filled"`}</td>
                <td className="px-4 py-2">Visual variant</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"xs" | "s" | "m" | "l" | "xl"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"s"`}</td>
                <td className="px-4 py-2">Button size</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Leading icon</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">trailingIcon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Trailing icon</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">loading</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Shows spinner and disables interaction</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">asChild</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Render as Radix Slot</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
