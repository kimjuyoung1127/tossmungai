import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase Error: SUPABASE_URL or SUPABASE_ANON_KEY is missing in environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);