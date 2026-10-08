'use client';

import {
  AssistChip,
  Button,
  ButtonGroup,
  Fab,
  FilterChip,
  FloatingToolbar,
  IconButton,
  LinearProgressIndicator,
  LoadingIndicator,
  Menu,
  MenuItem,
  SplitButton,
  SuggestionChip,
} from '@vkieu/mui';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  AddIcon,
  ArrowForwardIcon,
  EditIcon,
  FormatBoldIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
} from '../icons';

interface ExpressiveCardProps {
  preview: ReactNode;
  title: string;
  description: string;
  /** Optional call-to-action (e.g. a link) rendered under the description. */
  action?: ReactNode;
}

function ExpressiveCard({ preview, title, description, action }: ExpressiveCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-corner-extra-large bg-surface-container-low">
      {/* Fixed-height preview band keeps the top edge of every text block aligned. */}
      <div className="flex h-[200px] shrink-0 items-center justify-center bg-secondary-container p-8">
        {preview}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-title-large text-on-surface">{title}</h3>
        <p className="text-body-medium text-on-surface-variant">{description}</p>
        {action ? <div className="mt-auto pt-2">{action}</div> : null}
      </div>
    </div>
  );
}

/** Expressive-components section — mirrors the M3 homepage showcase grid. */
export function ExpressiveShowcase() {
  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h2 className="text-display-small text-on-surface">Expressive components</h2>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          Fourteen new or updated components now feature more configuration capabilities, shape
          options, emphasized text, and other expressive updates.
        </p>
      </div>

      {/* Bento-deck intro video */}
      <div className="overflow-hidden rounded-corner-extra-large bg-surface-container-low">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full"
          aria-hidden="true"
        >
          <source
            src="https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fm3%2Fimages%2Fmpy2t3cm-00_Bento_Deck_Light_Purple.mp4?alt=media&token=b6d52685-b47f-4b89-88e1-1992330aa85a"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Row 1: Toolbars + Split button */}
      <div className="grid grid-cols-1 gap-4 medium:grid-cols-2">
        <ExpressiveCard
          title="New: Toolbars"
          description="Flexible component to display frequently used actions. Toolbars hold a variety of controls like buttons, and can also be paired with a FAB."
          preview={
            <FloatingToolbar aria-label="Text formatting" expanded={true}>
              <IconButton toggle icon={<FormatBoldIcon />} aria-label="Bold" />
              <IconButton toggle icon={<FormatItalicIcon />} aria-label="Italic" />
              <IconButton toggle icon={<FormatUnderlinedIcon />} aria-label="Underline" />
              <IconButton toggle icon={<AddIcon />} aria-label="Add" />
            </FloatingToolbar>
          }
        />
        <ExpressiveCard
          title="New: Split button"
          description="Pair a button with related actions in a connected menu. Split buttons leverage expressive shape and motion strategies."
          preview={
            <SplitButton
              leadingIcon={<AddIcon />}
              menuLabel="More share options"
              menu={
                <Menu>
                  <MenuItem key="link">Copy link</MenuItem>
                  <MenuItem key="email">Share via email</MenuItem>
                </Menu>
              }
            >
              Share
            </SplitButton>
          }
        />
      </div>

      {/* Row 2: Progress + Button groups + See all */}
      <div className="grid grid-cols-1 gap-4 medium:grid-cols-3">
        <ExpressiveCard
          title="Updated: Progress indicators"
          description="An eye-catching way to show the status of a process in real time. Customize waveform and thickness to show progress with style."
          preview={
            <div className="flex items-center gap-6">
              <LinearProgressIndicator wavy aria-label="Loading" className="w-32" />
              <LoadingIndicator aria-label="Loading" />
            </div>
          }
        />
        <ExpressiveCard
          title="New: Button groups"
          description="A new way to organize related buttons—with shape-shifting buttons that bump and react to each other."
          preview={
            <ButtonGroup
              variant="connected"
              selectionMode="single"
              disallowEmptySelection
              defaultSelectedKeys={['week']}
              aria-label="Calendar view"
            >
              <Button toggle value="day">
                Day
              </Button>
              <Button toggle value="week">
                Week
              </Button>
              <Button toggle value="month">
                Month
              </Button>
            </ButtonGroup>
          }
        />

        {/* "See all" card — same shape as the others, with a live component cluster */}
        <ExpressiveCard
          title="See all expressive components"
          description="Check out all 14 new and updated M3 Expressive components."
          action={
            <Link
              href="/components"
              className="group/link inline-flex items-center gap-1 rounded-sm text-label-large text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Browse all
              <span className="inline-flex size-5 transition-transform group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5 motion-reduce:transition-none">
                <ArrowForwardIcon />
              </span>
            </Link>
          }
          preview={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <AssistChip leadingIcon={<EditIcon />}>Edit</AssistChip>
              <FilterChip selected>Filter</FilterChip>
              <SuggestionChip>Suggest</SuggestionChip>
              <LoadingIndicator aria-label="Loading" />
              <Fab size="default" color="tertiary-container" icon={<AddIcon />} aria-label="Add" />
            </div>
          }
        />
      </div>
    </section>
  );
}
