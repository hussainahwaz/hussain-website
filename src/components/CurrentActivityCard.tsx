import { Activity } from '@/lib/schedule';

export function CurrentActivityCard({ activity }: { activity: Activity | null }) {
  if (!activity) {
    return (
      <div>
        <p>Nothing scheduled right now</p>
      </div>
    );
  }

  return (
    <div>
      <p>RIGHT NOW</p>
      <p>{activity.emoji} {activity.name}</p>
      <p>{formatTimeRange(activity.start_time, activity.end_time)}</p>
    </div>
  );
}

// Converts "14:00:00" into "2:00 PM"
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}