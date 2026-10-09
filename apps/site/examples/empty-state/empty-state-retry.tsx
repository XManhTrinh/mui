import { Button } from '@vkieu/mui';
import { EmptyState } from '@vkieu/mui/vk';
import { CloudOffIcon } from '../../components/icons';

/** A list that couldn't load: the error tone, small, with one retry action. */
export function EmptyStateRetry() {
  return (
    <div className="w-full max-w-sm rounded-corner-medium border border-outline-variant">
      <EmptyState
        size="sm"
        tone="error"
        icon={<CloudOffIcon />}
        title="Couldn't load this list"
        description="Check your connection and try again."
        actions={<Button variant="tonal">Try again</Button>}
      />
    </div>
  );
}
