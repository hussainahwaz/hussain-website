export type Activity = {
  id: string;
  name: string;
  emoji: string;
  start_time: string; // "HH:MM:SS" format from Supabase
  end_time: string;
  day_of_week: number | null;
  specific_date: string | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  notes: string | null;
};

const TIMEZONE = 'Asia/Kuala_Lumpur';

// Gets the current date/time info, but according to our fixed timezone,
// not the visitor's browser timezone.
function getNowInTimezone() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour12: false,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return {
    dayOfWeek: weekdayMap[get('weekday')],
    timeString: `${get('hour')}:${get('minute')}`, // "14:30"
    dateString: `${get('year')}-${get('month')}-${get('day')}`, // "2026-09-23"
  };
}

// Converts "HH:MM" or "HH:MM:SS" into minutes-since-midnight, for easy comparison.
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function activityAppliesToday(
  activity: Activity,
  dayOfWeek: number,
  dateString: string
): boolean {
  if (activity.specific_date) {
    return activity.specific_date === dateString;
  }
  return activity.day_of_week === dayOfWeek;
}

export function getCurrentAndNextActivity(activities: Activity[]) {
  const { dayOfWeek, timeString, dateString } = getNowInTimezone();
  const nowMinutes = toMinutes(timeString);

  // We need to consider not just today's activities, but also any activity
  // that started YESTERDAY and crosses midnight into today.
  const yesterdayDayOfWeek = (dayOfWeek + 6) % 7; // wraps 0 (Sun) back to 6 (Sat)

  const todaysActivities = activities
    .filter((a) => activityAppliesToday(a, dayOfWeek, dateString))
    .sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time));

  const overnightFromYesterday = activities.filter((a) => {
    const crossesMidnight = toMinutes(a.end_time) <= toMinutes(a.start_time);
    if (!crossesMidnight) return false;
    // Was this activity scheduled for yesterday (recurring) and still running?
    return a.day_of_week === yesterdayDayOfWeek && a.specific_date === null;
  });

  let current: Activity | null = null;
  let next: Activity | null = null;

  // Check overnight activities from yesterday first — e.g. Sleep 23:00-07:00,
  // and it's currently 02:00, so this is still "current" even though it
  // technically started "yesterday."
  for (const activity of overnightFromYesterday) {
    const start = toMinutes(activity.start_time);
    const end = toMinutes(activity.end_time);
    if (nowMinutes < end || nowMinutes >= start) {
      // still within the overnight window (early morning portion)
      if (nowMinutes < end) {
        current = activity;
      }
    }
  }

  for (const activity of todaysActivities) {
    const start = toMinutes(activity.start_time);
    const end = toMinutes(activity.end_time);
    const crossesMidnight = end <= start;

    if (crossesMidnight) {
      // e.g. starts at 23:00, ends at 07:00 tomorrow — "current" if we're
      // past the start time today (the early-morning portion is handled
      // by the overnightFromYesterday check above).
      if (nowMinutes >= start) {
        current = activity;
      } else if (next === null) {
        // hasn't started yet today — it's a valid "next" candidate
        next = activity;
      }
      continue;
    }

    if (nowMinutes >= start && nowMinutes < end) {
      current = activity;
    } else if (nowMinutes < start && next === null) {
      next = activity;
    }
  }

  return { current, next, todaysActivities };
}

import {
  GraduationCap, Utensils, Coffee, Dumbbell, Gamepad2,
  BookOpen, Footprints, Moon, Briefcase, Home, Circle,
} from 'lucide-react';

// Maps a short "icon key" (stored in the emoji column) to a Lucide icon component.
export const iconMap: Record<string, typeof Circle> = {
  university: GraduationCap,
  lunch: Utensils,
  dinner: Utensils,
  breakfast: Coffee,
  gym: Dumbbell,
  gaming: Gamepad2,
  study: BookOpen,
  walking: Footprints,
  sleep: Moon,
  work: Briefcase,
  home: Home,
};

export function getActivityIcon(key: string) {
  return iconMap[key] ?? Circle; // fallback icon if key isn't recognized
}