-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories: public read, authenticated admins can modify
CREATE POLICY "Anyone can read categories"
ON public.categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert categories"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products: public read, authenticated admins can modify
CREATE POLICY "Anyone can read products"
ON public.products FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Seed default categories
INSERT INTO public.categories (name, sort_order) VALUES
  ('Cheese', 1),
  ('Mayonnaise', 2),
  ('Ketchup', 3),
  ('Sauce', 4),
  ('Spread', 5),
  ('Cream', 6),
  ('Butter', 7)
ON CONFLICT (name) DO NOTHING;

-- Seed initial products
INSERT INTO public.products (name, brand, category, price, unit, description) VALUES
  ('Classic Mayonnaise', 'Veeba', 'Mayonnaise', 185, '1 Kg', 'Rich and creamy classic mayonnaise, perfect for sandwiches and burgers.'),
  ('Tandoori Mayonnaise', 'Veeba', 'Mayonnaise', 195, '1 Kg', 'Tandoori flavored mayo with authentic Indian spices.'),
  ('Cheese & Chilli Sandwich Spread', 'Veeba', 'Spread', 210, '1 Kg', 'Spicy cheese spread ideal for sandwiches and wraps.'),
  ('Tomato Ketchup', 'Veeba', 'Ketchup', 120, '1 Kg', 'Premium tomato ketchup made from ripe tomatoes.'),
  ('Sweet Chilli Sauce', 'Veeba', 'Sauce', 165, '1 Kg', 'Sweet and tangy chilli sauce for dipping and cooking.'),
  ('Chipotle Southwest Dressing', 'Veeba', 'Sauce', 225, '1 Kg', 'Smoky chipotle dressing for salads and wraps.'),
  ('Mint Mayonnaise', 'Veeba', 'Mayonnaise', 195, '1 Kg', 'Refreshing mint-flavored mayonnaise.'),
  ('Burger Mayonnaise', 'Veeba', 'Mayonnaise', 190, '1 Kg', 'Specially crafted mayo for burgers.'),
  ('Mozzarella Cheese Block', 'Lactilas', 'Cheese', 380, '1 Kg', 'Premium mozzarella cheese block, ideal for pizzas and pastas.'),
  ('Cheddar Cheese Slice', 'Lactilas', 'Cheese', 340, '500 g (24 slices)', 'Smooth cheddar cheese slices for burgers and sandwiches.'),
  ('Cream Cheese', 'Lactilas', 'Cream', 290, '1 Kg', 'Smooth and creamy cheese spread for bagels and desserts.'),
  ('Processed Cheese Block', 'Lactilas', 'Cheese', 320, '1 Kg', 'Versatile processed cheese for cooking and snacking.'),
  ('Shredded Mozzarella', 'Lactilas', 'Cheese', 410, '1 Kg', 'Pre-shredded mozzarella for quick pizza prep.'),
  ('Pizza Cheese Blend', 'Lactilas', 'Cheese', 395, '1 Kg', 'Special blend of cheeses optimized for pizza topping.'),
  ('Cooking Butter', 'Lactilas', 'Butter', 480, '1 Kg', 'Premium unsalted cooking butter.'),
  ('Hazelnut Chocolate Spread', 'Wizzie', 'Spread', 350, '1 Kg', 'Rich hazelnut chocolate spread for desserts and toast.'),
  ('Peanut Butter Creamy', 'Wizzie', 'Spread', 280, '1 Kg', 'Smooth and creamy peanut butter.'),
  ('Peanut Butter Crunchy', 'Wizzie', 'Spread', 285, '1 Kg', 'Crunchy peanut butter with real peanut pieces.'),
  ('Strawberry Jam', 'Wizzie', 'Spread', 160, '1 Kg', 'Sweet strawberry jam made from real fruit.'),
  ('Mixed Fruit Jam', 'Wizzie', 'Spread', 155, '1 Kg', 'Delicious mixed fruit jam.');
