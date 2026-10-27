-- ====================================================================
-- SAWERA SWEETS & BAKERS - SUPABASE DATABASE SCHEMA
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Click on "SQL Editor" on the left menu
-- 3. Click "New query", paste this entire script, and click "Run" (green button)
-- ====================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.sawera_products (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.sawera_orders (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Store Settings Table
CREATE TABLE IF NOT EXISTS public.sawera_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.sawera_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sawera_settings ENABLE ROW LEVEL SECURITY;

-- 5. Secure Granular Access Policies
-- Products: Public can read products for storefront catalog; anon/auth can update
DROP POLICY IF EXISTS "Public access to sawera_products" ON public.sawera_products;
DROP POLICY IF EXISTS "Allow public read sawera_products" ON public.sawera_products;
DROP POLICY IF EXISTS "Allow anon upsert sawera_products" ON public.sawera_products;

CREATE POLICY "Allow public read sawera_products" 
  ON public.sawera_products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow anon upsert sawera_products" 
  ON public.sawera_products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Orders: Public can create orders (INSERT); orders readable for tracking
DROP POLICY IF EXISTS "Public access to sawera_orders" ON public.sawera_orders;
DROP POLICY IF EXISTS "Allow public insert sawera_orders" ON public.sawera_orders;
DROP POLICY IF EXISTS "Allow public read sawera_orders" ON public.sawera_orders;

CREATE POLICY "Allow public insert sawera_orders" 
  ON public.sawera_orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read sawera_orders" 
  ON public.sawera_orders 
  FOR SELECT 
  USING (true);

-- Settings: Public can read general store settings
DROP POLICY IF EXISTS "Public access to sawera_settings" ON public.sawera_settings;
DROP POLICY IF EXISTS "Allow read sawera_settings" ON public.sawera_settings;
DROP POLICY IF EXISTS "Allow update sawera_settings" ON public.sawera_settings;

CREATE POLICY "Allow read sawera_settings" 
  ON public.sawera_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow update sawera_settings" 
  ON public.sawera_settings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 6. Enable Realtime broadcasting
ALTER PUBLICATION supabase_realtime ADD TABLE public.sawera_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sawera_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sawera_settings;
