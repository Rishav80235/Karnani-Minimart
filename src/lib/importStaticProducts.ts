import { supabase } from '@/integrations/supabase/client';
import { products as staticProducts } from '@/data/products';

/**
 * Import all products from src/data/products.ts into Supabase products table.
 * Skips products that already exist (by name + brand combination).
 */
export async function importStaticProductsToSupabase(): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  // Check existing products to avoid duplicates
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('name, brand');

  if (fetchError) {
    throw new Error(`Failed to fetch existing products: ${fetchError.message}`);
  }

  const existingKeys = new Set(
    (existingProducts || []).map((p) => `${p.name}|${p.brand}`.toLowerCase()),
  );

  // Import each product
  for (const product of staticProducts) {
    const key = `${product.name}|${product.brand}`.toLowerCase();

    // Skip if already exists
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    // Insert into Supabase
    const { error } = await supabase.from('products').insert({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.image ?? null,
      description: product.description ?? null,
      // Note: mrp and images fields may not exist in your Supabase table yet
      // If you get errors, you may need to add these columns first
    });

    if (error) {
      errors.push(`${product.name}: ${error.message}`);
    } else {
      imported++;
    }
  }

  return { imported, skipped, errors };
}
