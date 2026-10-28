import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://dfhmkymkbgnlkdjcuwva.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaG1reW1rYmdubGtkamN1d3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMDk0NjksImV4cCI6MjEwODc4NTQ2OX0.chBtY_LkxG9pumYzyLsGRSmYc_N82qvzHHKEKFEHseA';

const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '') || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : '') || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseUrl.includes('[REF]')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
