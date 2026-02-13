import type { Product } from '@/data/products';

// Import all images from the listing folder eagerly so we can match by name.
// Assumes filenames (without extension) match the product name (case-insensitive).
const modules = import.meta.glob('@/assets/lisintng/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

const imageMap: Record<string, string[]> = {};

for (const path in modules) {
  // Vite modules usually expose the URL on .default
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = modules[path];
  const src: string | undefined = mod?.default ?? mod;
  if (!src) continue;

  const fileName = path.split('/').pop() ?? '';
  const base = fileName.replace(/\.[^/.]+$/, '');
  const key = base.toLowerCase();
  if (!imageMap[key]) imageMap[key] = [];
  imageMap[key].push(src);
}

export function getProductImages(product: Product): string[] {
  const nameKey = product.name.toLowerCase();

  if (imageMap[nameKey]) {
    return imageMap[nameKey];
  }

  return [];
}

