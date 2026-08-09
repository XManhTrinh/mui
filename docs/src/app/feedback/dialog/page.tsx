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
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic Dialog</h2>
        <Showcase title="Basic">
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
                <Button variant="filled">Discard</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icon</h2>
        <Showcase title="Icon Dialog">
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
                <Button variant="filled">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Full-Screen Dialog</h2>
        <Showcase title="Full-Screen">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="tonal">Open Full-Screen</Button>
            </DialogTrigger>
            <DialogContent variant="fullscreen">
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
                <Button variant="filled">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>
      </section>
    </div>
  );
}
