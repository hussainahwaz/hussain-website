import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This client uses the secret service role key, which bypasses Row Level
// Security. It must ONLY ever be imported into server-side code (API routes),
// never into a component that runs in the browser.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);