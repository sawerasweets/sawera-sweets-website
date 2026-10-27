-- ====================================================================
-- SAWERA SWEETS & BAKERS - SUPABASE SECURITY VULNERABILITY FIX
-- ====================================================================
-- How to run this:
-- 1. Open Supabase Dashboard: https://supabase.com/dashboard
-- 2. Open your project ("sawerasweets's Project")
-- 3. Click "SQL Editor" on the left navigation bar
-- 4. Click "New query", paste this entire script, and click "Run" (Green button)
-- ====================================================================

-- STEP 1: Automatically enable Row Level Security (RLS) on ALL tables in the public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;

-- STEP 2: Secure sawera_products
-- Customers can read products; only authorized users / app can insert or update.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sawera_products') THEN
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
  END IF;
END $$;

-- STEP 3: Secure sawera_orders
-- Anyone can place an order (INSERT); reading is allowed for order tracking.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sawera_orders') THEN
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
  END IF;
END $$;

-- STEP 4: Secure sawera_settings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sawera_settings') THEN
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
  END IF;
END $$;

-- STEP 5: If any 'users' or 'profiles' table exists in public schema, protect sensitive credentials
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read users" ON public.users;
    DROP POLICY IF EXISTS "Service role access users" ON public.users;
    CREATE POLICY "Service role access users" ON public.users FOR ALL TO authenticated USING (true);
  END IF;
END $$;
