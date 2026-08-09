"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  SnackbarProvider,
  useSnackbar,
  Menu,
  MenuItem,
  MenuDivider,
  LinearProgress,
  CircularProgress,
  LoadingIndicator,
  Button,
  Icon,
  IconButton,
} from "@mui/index";
import { Showcase } from "@/components/showcase";

function SnackbarDemo() {
  const { show } = useSnackbar();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="filled"
        onClick={() => show({ message: "This is a snackbar message" })}
      >
        Show Snackbar
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          show({
            message: "Item archived",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        With Action
      </Button>
      <Button
        variant="tonal"
        onClick={() =>
          show({
            message: "Something happened",
            showClose: true,
          })
        }
      >
        With Close
      </Button>
    </div>
  );
}

export default function FeedbackPage() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(45);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <SnackbarProvider>
      <div className="max-w-5xl space-y-8">
        <div>
          <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
            Feedback
          </h1>
          <p className="text-[16px] leading-6 text-surface-variant-foreground">
            Feedback components communicate status, alerts, and results of user
            actions.
          </p>
        </div>

        {/* Dialog */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Dialog</h2>

          <Showcase title="Basic Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="filled">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Discard draft?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Your current draft will be
                    permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="text">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="filled">Discard</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Showcase>

          <Showcase title="Dialog with Icon">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outlined">Delete Item</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex justify-center mb-4">
                    <Icon name="delete" size={24} className="text-error" />
                  </div>
                  <DialogTitle className="text-center">Delete this item?</DialogTitle>
                  <DialogDescription className="text-center">
                    This will permanently remove the item and all associated
                    data. This cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="text">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="filled">Delete</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Showcase>
        </section>

        {/* Snackbar */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Snackbar</h2>

          <Showcase title="Snackbar Examples">
            <SnackbarDemo />
          </Showcase>
        </section>

        {/* Menu */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Menu</h2>

          <Showcase title="Menu with Icons">
            <Menu
              trigger={
                <IconButton variant="standard" aria-label="More options">
                  <Icon name="more_vert" />
                </IconButton>
              }
            >
              <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
              <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
              <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
              <MenuDivider />
              <MenuItem leadingIcon="select_all" trailingText="⌘A">Select All</MenuItem>
            </Menu>

            <Menu
              trigger={
                <Button variant="outlined" icon={<Icon name="sort" />}>
                  Sort by
                </Button>
              }
            >
              <MenuItem trailingText="A→Z">Name</MenuItem>
              <MenuItem trailingText="Newest">Date modified</MenuItem>
              <MenuItem trailingText="Largest">Size</MenuItem>
              <MenuDivider />
              <MenuItem leadingIcon="filter_list">More filters...</MenuItem>
            </Menu>
          </Showcase>
        </section>

        {/* Linear Progress */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Linear Progress</h2>

          <Showcase title="Determinate" className="flex-col items-stretch">
            <div className="max-w-md w-full space-y-4">
              <LinearProgress value={progress} />
              <LinearProgress value={25} />
              <LinearProgress value={75} />
            </div>
          </Showcase>

          <Showcase title="Indeterminate" className="flex-col items-stretch">
            <div className="max-w-md w-full">
              <LinearProgress />
            </div>
          </Showcase>
        </section>

        {/* Circular Progress */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Circular Progress</h2>

          <Showcase title="Determinate">
            <CircularProgress value={25} />
            <CircularProgress value={50} />
            <CircularProgress value={75} />
            <CircularProgress value={progress} />
          </Showcase>

          <Showcase title="Indeterminate">
            <CircularProgress />
          </Showcase>
        </section>

        {/* Loading Indicator */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Loading Indicator</h2>

          <Showcase title="Loading Indicator Sizes">
            <LoadingIndicator size="sm" />
            <LoadingIndicator size="md" />
            <LoadingIndicator size="lg" />
          </Showcase>
        </section>

        {/* Props Table */}
        <section className="space-y-4">
          <h2 className="text-[22px] leading-7 font-normal">Dialog Props</h2>
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
                  <td className="px-4 py-2 font-mono text-xs">open</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">—</td>
                  <td className="px-4 py-2">Controlled open state</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">onOpenChange</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(open: boolean) => void`}</td>
                  <td className="px-4 py-2 font-mono text-xs">—</td>
                  <td className="px-4 py-2">Callback when open state changes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-[22px] leading-7 font-normal">LinearProgress Props</h2>
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
                  <td className="px-4 py-2 font-mono text-xs">value</td>
                  <td className="px-4 py-2 font-mono text-xs">number | undefined</td>
                  <td className="px-4 py-2 font-mono text-xs">undefined</td>
                  <td className="px-4 py-2">Progress value (0–100). Undefined renders indeterminate.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </SnackbarProvider>
  );
}
