import { Skeleton, SkeletonGroup } from '@vkieu/mui/vk';
import { Suspense } from 'react';

// Rendered per request so the content streams in after the fallback.
export const dynamic = 'force-dynamic';

const STREAM_DELAY_MS = 2500;

async function SlowContent() {
  await new Promise((resolve) => setTimeout(resolve, STREAM_DELAY_MS));
  return <p data-testid="streamed">Streamed content</p>;
}

/**
 * A skeleton as a streamed Suspense fallback. The fallback is server HTML that React does
 * not hydrate until the content arrives, so the skeleton must animate with CSS alone.
 */
export default function StreamingPage() {
  return (
    <main className="p-6">
      <Suspense
        fallback={
          <SkeletonGroup label="Loading content" className="flex w-80 flex-col gap-2">
            <Skeleton variant="text" typescale="title-medium" className="w-1/2" />
            <Skeleton variant="text" lines={2} />
          </SkeletonGroup>
        }
      >
        <SlowContent />
      </Suspense>
    </main>
  );
}
