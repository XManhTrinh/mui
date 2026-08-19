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
  Button,
  Icon,
} from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const dialogContentProps: PropDef[] = [
  {
    name: "fullScreen",
    type: "boolean",
    default: "false",
    description:
      "Full-screen on mobile, centered dialog on desktop",
  },
  {
    name: "icon",
    type: "string",
    default: "undefined",
    description:
      "Material Symbol name for hero icon; triggers center-aligned layout",
  },
  {
    name: "showClose",
    type: "boolean",
    default: "false",
    description: "Show close X button in top-right corner",
  },
  {
    name: "alert",
    type: "boolean",
    default: "false",
    description:
      "Alert dialog mode; prevents dismissal except via action buttons",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional Tailwind classes",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Dialog body content",
  },
];

export default function DialogPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Dialog
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Dialogs provide important prompts in a user flow. They can require an
          action, communicate information, or help users accomplish a task.
          Follows M3 Expressive specs with alert mode and scrollable content support.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic Dialog</h2>
        <Showcase title="Basic" code={`<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="filled">Open Dialog</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Discard draft?</DialogTitle>\n      <DialogDescription>Your changes have not been saved.</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="text">Cancel</Button>\n      </DialogClose>\n      <Button variant="text">Discard</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="filled">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Discard draft?</DialogTitle>
                <DialogDescription>
                  Your changes have not been saved. If you discard, your draft
                  will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="text">Cancel</Button>
                </DialogClose>
                <Button variant="text">Discard</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icon</h2>
        <Showcase title="Icon Dialog" code={`<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="outlined">Delete Item</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <Icon name="delete" size={24} />\n      <DialogTitle>Delete file?</DialogTitle>\n      <DialogDescription>This action cannot be undone.</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="text">Cancel</Button>\n      </DialogClose>\n      <Button variant="text">Delete</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outlined">Delete Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <Icon name="delete" size={24} />
                </div>
                <DialogTitle className="text-center">Delete file?</DialogTitle>
                <DialogDescription className="text-center">
                  This action cannot be undone. The file will be permanently
                  removed from your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="text">Cancel</Button>
                </DialogClose>
                <Button variant="text">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Full-Screen Dialog</h2>
        <Showcase title="Full-Screen" code={`<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="tonal">Open Full-Screen</Button>\n  </DialogTrigger>\n  <DialogContent fullScreen>\n    <DialogHeader>\n      <DialogTitle>New Event</DialogTitle>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="text">Cancel</Button>\n      </DialogClose>\n      <Button variant="text">Save</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="tonal">Open Full-Screen</Button>
            </DialogTrigger>
            <DialogContent fullScreen>
              <DialogHeader>
                <DialogTitle>New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new event.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-sm text-surface-foreground">
                  Full-screen dialogs fill the entire screen, containing a
                  series of tasks that require user input.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="text">Cancel</Button>
                </DialogClose>
                <Button variant="text">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Alert Dialog</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          Alert dialogs prevent dismissal via outside click or Escape key. The
          user must choose an action button to close the dialog.
        </p>
        <Showcase
          title="Alert Dialog"
          code={`<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="filled">Delete Account</Button>\n  </DialogTrigger>\n  <DialogContent alert>\n    <DialogHeader>\n      <DialogTitle>Delete account?</DialogTitle>\n      <DialogDescription>\n        This action is permanent and cannot be undone.\n        All your data will be erased.\n      </DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="text">Cancel</Button>\n      </DialogClose>\n      <DialogClose asChild>\n        <Button variant="text">Delete</Button>\n      </DialogClose>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="filled">Delete Account</Button>
            </DialogTrigger>
            <DialogContent alert>
              <DialogHeader>
                <DialogTitle>Delete account?</DialogTitle>
                <DialogDescription>
                  This action is permanent and cannot be undone. All your data
                  will be erased. Clicking outside or pressing Escape will not
                  dismiss this dialog.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="text">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="text">Delete</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Scrollable Dialog</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          When content exceeds the available height, dividers appear between the
          header and content, and between content and actions. The title and
          buttons stay fixed while the body scrolls.
        </p>
        <Showcase
          title="Scrollable Content"
          code={`<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="outlined">View Terms</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Terms of Service</DialogTitle>\n      <DialogDescription>Please read and accept the terms.</DialogDescription>\n    </DialogHeader>\n    {/* Long content triggers scrollable behavior */}\n    <div className="space-y-4">\n      <p>Section 1: Lorem ipsum dolor sit amet...</p>\n      <p>Section 2: Consectetur adipiscing elit...</p>\n      <p>Section 3: Sed do eiusmod tempor...</p>\n      {/* More sections */}\n    </div>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="text">Decline</Button>\n      </DialogClose>\n      <DialogClose asChild>\n        <Button variant="text">Accept</Button>\n      </DialogClose>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outlined">View Terms</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Terms of Service</DialogTitle>
                <DialogDescription>
                  Please read and accept the following terms before continuing.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-surface-foreground">
                  <strong>Section 1: General Terms</strong>
                  <br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-sm text-surface-foreground">
                  <strong>Section 2: Privacy Policy</strong>
                  <br />
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <p className="text-sm text-surface-foreground">
                  <strong>Section 3: Data Usage</strong>
                  <br />
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
                <p className="text-sm text-surface-foreground">
                  <strong>Section 4: User Responsibilities</strong>
                  <br />
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet.
                </p>
                <p className="text-sm text-surface-foreground">
                  <strong>Section 5: Termination</strong>
                  <br />
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident.
                </p>
                <p className="text-sm text-surface-foreground">
                  <strong>Section 6: Liability</strong>
                  <br />
                  Similique sunt in culpa qui officia deserunt mollitia animi, id
                  est laborum et dolorum fuga. Et harum quidem rerum facilis est
                  et expedita distinctio. Nam libero tempore, cum soluta nobis
                  est eligendi optio cumque nihil impedit quo minus.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="text">Decline</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="text">Accept</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <PropsTable componentName="DialogContent" props={dialogContentProps} />
    </div>
  );
}
