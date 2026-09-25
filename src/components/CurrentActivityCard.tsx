import { Activity, getActivityIcon } from '@/lib/schedule';

export function CurrentActivityCard({ activity }: { activity: Activity | null }) {
  if (!activity) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
        <p className="text-neutral-400">Nothing scheduled right now</p>
      </div>
    );
  }

  const Icon = getActivityIcon(activity.emoji);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
        </span>
        <span className="text-sm font-medium tracking-wide text-amber-400">Right now</span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <Icon className="h-10 w-10 shrink-0 text-neutral-100" strokeWidth={1.5} />
        <div>
          <p className="text-2xl font-semibold text-neutral-50">{activity.name}</p>
          <p className="text-sm text-neutral-400">
            {formatTimeRange(activity.start_time, activity.end_time)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}