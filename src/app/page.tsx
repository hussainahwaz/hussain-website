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
    <main style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>What Is Hussain Doing?</h1>
      <CurrentActivityCard activity={current} />
      <NextActivityPreview activity={next} />
      <TodaySchedule activities={todaysActivities} currentActivityId={current?.id ?? null} />
    </main>
  );
}