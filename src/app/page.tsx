import { supabase } from '@/lib/supabase';
import { getCurrentAndNextActivity } from '@/lib/schedule';
import { CurrentActivityCard } from '@/components/CurrentActivityCard';
import { NextActivityPreview } from '@/components/NextActivityPreview';
import { TodaySchedule } from '@/components/TodaySchedule';

export default async function Home() {
  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .order('start_time');

  if (error) {
    return <div>Error loading schedule: {error.message}</div>;
  }

  const { current, next, todaysActivities } = getCurrentAndNextActivity(activities);

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-lg font-medium text-neutral-300">
          What is Hussain doing?
        </h1>
        <CurrentActivityCard activity={current} />
        <NextActivityPreview activity={next} />
        <TodaySchedule activities={todaysActivities} currentActivityId={current?.id ?? null} />
      </div>
    </main>
  );
}