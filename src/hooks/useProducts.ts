import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/data/products';

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

function toProduct(row: {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  image: string | null;
  description: string | null;
}): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    unit: row.unit,
    image: row.image ?? undefined,
    description: row.description ?? undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
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
