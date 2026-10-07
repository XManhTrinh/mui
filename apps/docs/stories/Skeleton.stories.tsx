import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonGroup, type SkeletonAnimation } from '@vkieu/mui/vk';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const meta = {
  title: 'VK/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A content card while it loads: media, title, two lines of text and an avatar row. */
function CardSkeleton() {
  return (
    <div className="flex w-[240px] flex-col overflow-hidden rounded-corner-medium border border-outline-variant">
      <Skeleton className="h-28" corner="none" />
      <div className="flex flex-col gap-1 p-4">
        <Skeleton variant="text" typescale="title-medium" className="w-3/4" />
        <Skeleton variant="text" typescale="body-medium" lines={2} />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton variant="circle" className="size-6" />
          <Skeleton variant="text" typescale="label-large" className="w-20" />
        </div>
      </div>
    </div>
  );
}

/** Cards in a loading region, as a home-page row shows them. */
export const Cards: StoryObj<{ animation: SkeletonAnimation }> = {
  args: { animation: 'pulse' },
  argTypes: { animation: { control: 'inline-radio', options: ['pulse', 'shimmer', 'none'] } },
  render: ({ animation }) => (
    <div className="bg-surface p-4" data-testid="skeleton">
      <SkeletonGroup label="Loading businesses" animation={animation} className="flex gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </SkeletonGroup>
    </div>
  ),
};

/** Type-scale classes, written out in full so Tailwind finds them. */
const ROLES = [
  ['headline-small', 'text-headline-small'],
  ['title-medium', 'text-title-medium'],
  ['body-large', 'text-body-large'],
  ['body-medium', 'text-body-medium'],
  ['label-small', 'text-label-small'],
] as const;

/** Each type-scale role beside real text: the line is as tall as the text it stands for. */
export const TextRoles: Story = {
  render: () => (
    <SkeletonGroup
      label="Loading text"
      animation="none"
      className="grid w-[480px] grid-cols-2 items-start gap-x-6 gap-y-2 bg-surface p-4 text-on-surface"
    >
      {ROLES.map(([role, textClass]) => (
        <div key={role} className="contents">
          <p data-testid={`text-${role}`} className={textClass}>
            {role}
          </p>
          <Skeleton data-testid={`skeleton-${role}`} variant="text" typescale={role} />
        </div>
      ))}
    </SkeletonGroup>
  ),
};

/** Every shape, corner and tone, on surface and inside a container. */
export const Shapes: Story = {
  render: () => (
    <SkeletonGroup
      label="Loading"
      animation="none"
      className="flex w-[480px] flex-col gap-4 bg-surface p-4"
      data-testid="shapes"
    >
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" corner="large" />
        <Skeleton className="h-10 w-24" corner="full" />
      </div>
      <div className="flex flex-col gap-2 rounded-corner-large bg-surface-container p-4">
        <Skeleton className="h-16" corner="medium" />
        <Skeleton variant="text" lines={3} />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton tone="high" className="h-16" corner="medium" />
        <Skeleton tone="high" variant="text" lines={2} />
      </div>
    </SkeletonGroup>
  ),
};

/** Layout safety (architecture §10). */
export const LayoutOverride: StoryObj<{
  override: LayoutOverrideName;
  transformedAncestor: boolean;
}> = {
  args: { override: 'none', transformedAncestor: false },
  argTypes: { override: { control: 'select', options: LAYOUT_OVERRIDE_NAMES } },
  render: ({ override, transformedAncestor }) => (
    <div
      className={transformedAncestor ? 'translate-x-2' : undefined}
      style={{ minHeight: 200, width: 360 }}
    >
      <Skeleton data-testid="target" className={LAYOUT_OVERRIDES[override]} />
    </div>
  ),
};
