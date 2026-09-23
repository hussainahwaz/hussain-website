import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .order('start_time');

  if (error) {
    return <div>Error loading schedule: {error.message}</div>;
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Test: Activities from Supabase</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            {activity.emoji} {activity.name} — {activity.start_time} to {activity.end_time}
          </li>
        ))}
      </ul>
    </main>
  );
}