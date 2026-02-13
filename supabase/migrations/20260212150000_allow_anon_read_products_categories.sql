-- Ensure anonymous (anon) and authenticated users can read products and categories.
-- If your app shows empty lists but Table Editor has data, RLS was blocking the anon key.
-- Run this migration: supabase db push  (or apply in Dashboard SQL Editor)

-- Products: allow anyone to SELECT
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- Categories: allow anyone to SELECT
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT
  TO public
  USING (true);
