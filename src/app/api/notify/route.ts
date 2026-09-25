import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const COOLDOWN_MINUTES = 5;

export async function POST(request: NextRequest) {
  // Figure out the visitor's IP address, as best we can from the request headers.
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const cooldownStart = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000).toISOString();

  // Check: has this IP sent a notification within the cooldown window?
  const { data: recentEvents, error: checkError } = await supabaseAdmin
    .from('notify_events')
    .select('created_at')
    .eq('ip_address', ip)
    .gte('created_at', cooldownStart)
    .order('created_at', { ascending: false })
    .limit(1);

  if (checkError) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }

  if (recentEvents.length > 0) {
    const lastSent = new Date(recentEvents[0].created_at);
    const nextAllowed = new Date(lastSent.getTime() + COOLDOWN_MINUTES * 60 * 1000);
    const secondsRemaining = Math.ceil((nextAllowed.getTime() - Date.now()) / 1000);

    return NextResponse.json(
      {
        error: 'cooldown',
        message: `You can notify Hussain again in ${Math.ceil(secondsRemaining / 60)} minute(s).`,
      },
      { status: 429 } // 429 = "Too Many Requests", the standard status code for rate limiting
    );
  }

  // Not rate-limited — record this notification request.
  const { error: insertError } = await supabaseAdmin
    .from('notify_events')
    .insert({ ip_address: ip });

  if (insertError) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }

  // TODO (Step 9-11): actually send a push notification via Firebase here.

  return NextResponse.json({ message: 'Notification sent! Hussain has been notified.' });
}