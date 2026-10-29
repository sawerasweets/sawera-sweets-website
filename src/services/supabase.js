import { createClient } from '@supabase/supabase-js';

export const OFFICIAL_SUPABASE_URL = 'https://dfhmkymkbgnlkdjcuwva.supabase.co';
export const OFFICIAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaG1reW1rYmdubGtkamN1d3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMDk0NjksImV4cCI6MjEwODc4NTQ2OX0.chBtY_LkxG9pumYzyLsGRSmYc_N82qvzHHKEKFEHseA';

const rawUrl = import.meta?.env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '') || '';
const rawKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : '') || '';

// Reject invalid, placeholder, or obsolete hosts like mkglsbjcrvubgxgezew
const isCustomValid = rawUrl && 
  rawKey && 
  rawUrl.startsWith('https://') && 
  !rawUrl.includes('your-project-ref') && 
  !rawUrl.includes('[REF]') &&
  !rawUrl.includes('mkglsbjcrvubgxgezew');

const supabaseUrl = isCustomValid ? rawUrl : OFFICIAL_SUPABASE_URL;
const supabaseAnonKey = isCustomValid ? rawKey : OFFICIAL_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
