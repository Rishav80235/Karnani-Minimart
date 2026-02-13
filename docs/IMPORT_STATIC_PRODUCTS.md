# Import Static Products to Supabase

## Quick Steps

1. **Make sure your Supabase tables exist** - Run migrations (see `SUPABASE_SETUP.md` Part 3).

2. **Open your app** → Go to **Admin** page (you need to be logged in as admin).

3. **Click "Import static products"** button in the Products tab.

4. **Confirm** the import dialog.

5. **Done!** The products from `src/data/products.ts` are now in your Supabase `products` table.

6. **Refresh the homepage** - You should now see all products displayed from Supabase.

## What Happens

- The import function reads all products from `src/data/products.ts`.
- It checks if each product already exists in Supabase (by name + brand).
- It inserts only new products (skips duplicates).
- Shows a summary: "Imported X, skipped Y existing."

## Verify It Worked

1. **In Supabase Dashboard** → **Table Editor** → **products** table - You should see all 20 products.
2. **In your app homepage** - Products should display automatically (the app reads from Supabase via `useProducts()` hook).

## The App Already Shows Supabase Data

The homepage (`src/pages/Index.tsx`) uses:
```typescript
const { data: products = [], isLoading } = useProducts();
```

Which calls `fetchProducts()` from `src/hooks/useProducts.ts`:
```typescript
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  // ...
}
```

So once products are in Supabase, they automatically appear on the homepage!

## Troubleshooting

- **"No products found"** on homepage:
  - Check browser console for `[fetchProducts]` errors.
  - Verify RLS policies allow public SELECT (run migration `20260212150000_allow_anon_read_products_categories.sql`).
  - Check `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

- **Import button doesn't work**:
  - Make sure you're logged in as admin.
  - Check browser console for errors.
  - Verify Supabase connection in Network tab.
