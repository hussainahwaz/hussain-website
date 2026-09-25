import { Activity, getActivityIcon } from '@/lib/schedule';
import { formatTime } from './CurrentActivityCard';

export function NextActivityPreview({ activity }: { activity: Activity | null }) {
  if (!activity) {
    return null;
  }

  const Icon = getActivityIcon(activity.emoji);

  return (
    <div className="mt-4 flex items-center gap-3 px-1 text-neutral-400">
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <p className="text-sm">
        Next: <span className="text-neutral-200">{activity.name}</span> at {formatTime(activity.start_time)}
      </p>
    </div>
  );
}