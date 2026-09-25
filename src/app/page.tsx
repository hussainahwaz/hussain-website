import { supabase } from '@/lib/supabase';
import { getCurrentAndNextActivity } from '@/lib/schedule';

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
    <main style={{ padding: '2rem' }}>
      <h1>Logic test</h1>
      <p>Current: {current ? `${current.emoji} ${current.name}` : 'Nothing right now'}</p>
      <p>Next: {next ? `${next.emoji} ${next.name}` : 'Nothing next'}</p>
      <h2>Today's activities ({todaysActivities.length})</h2>
      <ul>
        {todaysActivities.map((a) => (
          <li key={a.id}>{a.emoji} {a.name} — {a.start_time} to {a.end_time}</li>
        ))}
      </ul>
    </main>
  );
}