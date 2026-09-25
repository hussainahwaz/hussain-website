import { Activity } from '@/lib/schedule';
import { formatTime } from './CurrentActivityCard';

export function NextActivityPreview({ activity }: { activity: Activity | null }) {
  if (!activity) {
    return null; // nothing to show if there's no next activity
  }

  return (
    <div>
      <p>Next</p>
      <p>{activity.emoji} {activity.name} — {formatTime(activity.start_time)}</p>
    </div>
  );
}