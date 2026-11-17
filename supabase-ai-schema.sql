-- ====================================================================
-- SAWERA AI BUSINESS MANAGER - SUPABASE DATABASE SCHEMA EXTENSION
-- ====================================================================
-- Non-breaking additive tables for autonomous marketing & operations.
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- Existing tables (sawera_products, sawera_orders, sawera_settings) are 100% UNTOUCHED.
-- ====================================================================

-- 1. AI Central Memory Table
CREATE TABLE IF NOT EXISTS public.sawera_ai_memory (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL, -- 'brand_identity', 'guidelines', 'history', 'campaign_log'
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Social Media Accounts & API Connections Table
CREATE TABLE IF NOT EXISTS public.sawera_social_accounts (
  platform TEXT PRIMARY KEY, -- 'facebook', 'instagram', 'youtube', 'tiktok', 'whatsapp'
  account_name TEXT,
  account_id TEXT,
  is_connected BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error', 'testing'
  credentials JSONB DEFAULT '{}'::jsonb,
  last_sync TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Content Studio Table (Generated Copy, Images, Video Scripts)
CREATE TABLE IF NOT EXISTS public.sawera_content_studio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption_urdu TEXT,
  caption_english TEXT,
  hashtags TEXT[],
  content_type TEXT NOT NULL, -- 'image_post', 'video_reel', 'story', 'carousel'
  media_url TEXT,
  aspect_ratio TEXT DEFAULT '1:1', -- '1:1', '9:16', '16:9'
  target_product_id TEXT,
  target_platforms TEXT[], -- ['facebook', 'instagram', 'youtube', 'tiktok']
  status TEXT DEFAULT 'draft', -- 'draft', 'approved', 'scheduled', 'published', 'rejected'
  ai_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- 4. Publishing Calendar & Execution Queue Table
CREATE TABLE IF NOT EXISTS public.sawera_publishing_calendar (
  id TEXT PRIMARY KEY,
  content_id TEXT REFERENCES public.sawera_content_studio(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'publishing', 'published', 'failed', 'retrying'
  retry_count INT DEFAULT 0,
  error_message TEXT,
  response_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ
);

-- 5. WhatsApp Inbound/Outbound Conversations Table
CREATE TABLE IF NOT EXISTS public.sawera_whatsapp_inbox (
  customer_phone TEXT PRIMARY KEY,
  customer_name TEXT,
  chat_history JSONB DEFAULT '[]'::jsonb,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_escalated BOOLEAN DEFAULT false,
  order_draft JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' -- 'active', 'resolved', 'waiting_human'
);

-- 6. AI Usage & Cost Tracking Table
CREATE TABLE IF NOT EXISTS public.sawera_ai_cost_logs (
  id TEXT PRIMARY KEY,
  service_provider TEXT NOT NULL, -- 'gemini_free', 'pollinations_free', 'openai', 'meta_free'
  operation TEXT NOT NULL, -- 'text_generation', 'image_generation', 'support_reply', 'daily_briefing'
  cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
  cost_pkr NUMERIC(10, 2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT true,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Automation Rules & Autonomous Routine Config Table
CREATE TABLE IF NOT EXISTS public.sawera_automation_rules (
  id TEXT PRIMARY KEY DEFAULT 'rules',
  emergency_stop BOOLEAN DEFAULT false,
  engine_mode TEXT DEFAULT 'free', -- 'free' (Gemini/Pollinations), 'pro' (OpenAI)
  monthly_budget_cap_pkr NUMERIC(10, 2) DEFAULT 0.00,
  auto_publish_enabled BOOLEAN DEFAULT false,
  schedules JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all AI tables
ALTER TABLE public.sawera_ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_content_studio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_publishing_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_whatsapp_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_ai_cost_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_automation_rules ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon access with permissive development policies
CREATE POLICY "Allow all on sawera_ai_memory" ON public.sawera_ai_memory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sawera_social_accounts" ON public.sawera_social_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sawera_content_studio" ON public.sawera_content_studio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sawera_publishing_calendar" ON public.sawera_publishing_calendar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sawera_whatsapp_inbox" ON public.sawera_whatsapp_inbox FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sawera_ai_cost_logs" ON public.sawera_ai_cost_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sawera_automation_rules" ON public.sawera_automation_rules FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime Broadcasting on Content and Calendar tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sawera_content_studio;
ALTER PUBLICATION supabase_publishing_calendar ADD TABLE public.sawera_publishing_calendar;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sawera_automation_rules;
