import { Activity, getActivityIcon } from '@/lib/schedule';
import { formatTime } from './CurrentActivityCard';

export function TodaySchedule({
  activities,
  currentActivityId,
}: {
  activities: Activity[];
  currentActivityId: string | null;
}) {
  if (activities.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-sm font-medium text-neutral-500">Today</p>
        <p className="mt-3 text-sm text-neutral-500">Nothing scheduled today</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="text-sm font-medium text-neutral-500">Today</p>
      <ul className="mt-3 divide-y divide-white/5">
        {activities.map((activity) => {
          const isCurrent = activity.id === currentActivityId;
          const Icon = getActivityIcon(activity.emoji);
          return (
            <li
              key={activity.id}
              className={`flex items-center gap-3 py-3 ${
                isCurrent ? 'text-neutral-50' : 'text-neutral-400'
              }`}
            >
              <span className="w-14 shrink-0 text-xs text-neutral-500">
                {formatTime(activity.start_time)}
              </span>
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="text-sm">{activity.name}</span>
              {isCurrent && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}