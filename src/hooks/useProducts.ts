import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/data/products';

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  image: string | null;
  description: string | null;
  mrp?: number;
  images?: string[];
}

function toProduct(row: ProductRow): Product {
  const rawImage = row.image ?? null;
  const images =
    rawImage && rawImage.length > 0
      ? rawImage
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : undefined;

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    unit: row.unit,
    image: images?.[0],
    description: row.description ?? undefined,
    mrp: row.mrp ?? undefined,
    images: images ?? row.images ?? undefined,
  };
}

/** Load all products from Supabase. */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  if (error) {
    console.error('[fetchProducts] Supabase error:', error.message, error.details);
    throw error;
  }
  return (data ?? []).map(toProduct);
}

/** Load all categories from Supabase. */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) {
    console.error('[fetchCategories] Supabase error:', error.message, error.details);
    throw error;
  }
  return (data ?? []) as Category[];
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useProductMutations() {
  const qc = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (p: Omit<Product, 'id'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          unit: p.unit,
          image: p.image ?? null,
          description: p.description ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return toProduct(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const updateProduct = useMutation({
    mutationFn: async (p: Product) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          unit: p.unit,
          image: p.image ?? null,
          description: p.description ?? null,
        })
        .eq('id', p.id)
        .select()
        .single();
      if (error) throw error;
      return toProduct(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  return { createProduct, updateProduct, deleteProduct };
}

export function useCategoryMutations() {
  const qc = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, sort_order: 999 })
        .select()
        .single();
      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { createCategory, updateCategory, deleteCategory };
}
