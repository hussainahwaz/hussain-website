import { Activity } from '@/lib/schedule';
import { formatTime } from './CurrentActivityCard';

export function TodaySchedule({
  activities,
  currentActivityId,
}: {
  activities: Activity[];
  currentActivityId: string | null;
}) {
  if (activities.length === 0) {
    return <p>Nothing scheduled today</p>;
  }

  return (
    <div>
      <p>Today</p>
      <ul>
        {activities.map((activity) => {
          const isCurrent = activity.id === currentActivityId;
          return (
            <li key={activity.id}>
              {formatTime(activity.start_time)} {activity.emoji} {activity.name}
              {isCurrent ? ' ← now' : ''}
            </li>
          );
        })}
      </ul>
    </div>
  );
}